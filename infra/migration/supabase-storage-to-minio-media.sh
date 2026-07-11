#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${SUPABASE_URL:-}" || -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
  echo "BLOCKED: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment." >&2
  exit 2
fi

export SUPABASE_URL="${SUPABASE_URL%/}"
export MINIO_ENDPOINT="${MINIO_ENDPOINT:-https://media.alsamos.com}"
export MINIO_BUCKET="${MINIO_BUCKET:-media}"
export MINIO_REGION="${MINIO_REGION:-us-east-1}"
export MINIO_KEY_PREFIX="${MINIO_KEY_PREFIX:-legacy}"
export MIGRATION_STATE_DIR="${MIGRATION_STATE_DIR:-infra/migration/state}"

if [[ -z "${MINIO_ACCESS_KEY:-}" || -z "${MINIO_SECRET_KEY:-}" ]]; then
  ORACLE_SSH_TARGET="${ORACLE_SSH_TARGET:-ubuntu@92.4.76.166}"
  ORACLE_SSH_KEY="${ORACLE_SSH_KEY:-$HOME/.ssh/alsamos}"
  if command -v ssh >/dev/null 2>&1 && [[ -f "$ORACLE_SSH_KEY" ]]; then
    MINIO_ACCESS_KEY="$(ssh -i "$ORACLE_SSH_KEY" "$ORACLE_SSH_TARGET" "sudo k3s kubectl -n apps get secret minio-media-secret -o jsonpath='{.data.MINIO_ACCESS_KEY}' | base64 -d" 2>/dev/null || true)"
    MINIO_SECRET_KEY="$(ssh -i "$ORACLE_SSH_KEY" "$ORACLE_SSH_TARGET" "sudo k3s kubectl -n apps get secret minio-media-secret -o jsonpath='{.data.MINIO_SECRET_KEY}' | base64 -d" 2>/dev/null || true)"
    export MINIO_ACCESS_KEY MINIO_SECRET_KEY
  fi
  if [[ -z "${MINIO_ACCESS_KEY:-}" || -z "${MINIO_SECRET_KEY:-}" ]]; then
    echo "BLOCKED: set MINIO_ACCESS_KEY and MINIO_SECRET_KEY, or keep Oracle SSH available for apps/minio-media-secret lookup." >&2
    exit 2
  fi
fi

mkdir -p "$MIGRATION_STATE_DIR"

python3 - <<'PY'
import base64
import datetime as dt
import hashlib
import hmac
import json
import mimetypes
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

SUPABASE_URL = os.environ["SUPABASE_URL"].rstrip("/")
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
MINIO_ENDPOINT = os.environ["MINIO_ENDPOINT"].rstrip("/")
MINIO_BUCKET = os.environ["MINIO_BUCKET"]
MINIO_REGION = os.environ["MINIO_REGION"]
MINIO_ACCESS_KEY = os.environ["MINIO_ACCESS_KEY"]
MINIO_SECRET_KEY = os.environ["MINIO_SECRET_KEY"]
MINIO_KEY_PREFIX = os.environ["MINIO_KEY_PREFIX"].strip("/")
STATE_DIR = Path(os.environ["MIGRATION_STATE_DIR"])
MANIFEST = STATE_DIR / "media-migration-manifest.jsonl"
FAILURES = STATE_DIR / "media-migration-failures.jsonl"

STATE_DIR.mkdir(parents=True, exist_ok=True)

def supabase_req(method, path, body=None, raw=False):
    data = None
    headers = {
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "apikey": SUPABASE_KEY,
    }
    if body is not None:
        data = json.dumps(body).encode()
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(SUPABASE_URL + path, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=60) as res:
        payload = res.read()
        if raw:
            return payload, dict(res.headers)
        if not payload:
            return None
        return json.loads(payload.decode())

def list_buckets():
    return supabase_req("GET", "/storage/v1/bucket") or []

def list_prefix(bucket, prefix=""):
    out = []
    offset = 0
    while True:
        rows = supabase_req("POST", f"/storage/v1/object/list/{urllib.parse.quote(bucket)}", {
            "prefix": prefix,
            "limit": 1000,
            "offset": offset,
            "sortBy": {"column": "name", "order": "asc"},
        }) or []
        if not rows:
            break
        for row in rows:
            name = row.get("name") or ""
            if not name:
                continue
            full = f"{prefix.rstrip('/')}/{name}" if prefix else name
            if row.get("id") is None and row.get("metadata") is None:
                out.extend(list_prefix(bucket, full))
            else:
                out.append({
                    "bucket": bucket,
                    "path": full,
                    "metadata": row.get("metadata") or {},
                })
        if len(rows) < 1000:
            break
        offset += len(rows)
    return out

def object_url_path(bucket, object_path):
    return "/storage/v1/object/" + urllib.parse.quote(bucket, safe="") + "/" + urllib.parse.quote(object_path, safe="/")

def download_object(bucket, object_path):
    return supabase_req("GET", object_url_path(bucket, object_path), raw=True)

def s3_escape(path):
    return "/".join(urllib.parse.quote(p, safe="") for p in path.split("/"))

def sign(key, msg):
    return hmac.new(key, msg.encode(), hashlib.sha256).digest()

def signing_key(secret, date, region):
    k_date = sign(("AWS4" + secret).encode(), date)
    k_region = hmac.new(k_date, region.encode(), hashlib.sha256).digest()
    k_service = hmac.new(k_region, b"s3", hashlib.sha256).digest()
    return hmac.new(k_service, b"aws4_request", hashlib.sha256).digest()

def minio_put(key, content, content_type):
    parsed = urllib.parse.urlparse(MINIO_ENDPOINT)
    host = parsed.netloc
    now = dt.datetime.utcnow()
    amz_date = now.strftime("%Y%m%dT%H%M%SZ")
    short_date = now.strftime("%Y%m%d")
    object_path = f"/{MINIO_BUCKET}/{s3_escape(key)}"
    payload_hash = hashlib.sha256(content).hexdigest()
    headers = {
        "host": host,
        "x-amz-content-sha256": payload_hash,
        "x-amz-date": amz_date,
        "content-type": content_type,
        "cache-control": "public, max-age=31536000, immutable",
    }
    signed_headers = ";".join(sorted(headers))
    canonical_headers = "".join(f"{h}:{headers[h]}\n" for h in sorted(headers))
    canonical_request = "\n".join([
        "PUT",
        object_path,
        "",
        canonical_headers,
        signed_headers,
        payload_hash,
    ])
    scope = f"{short_date}/{MINIO_REGION}/s3/aws4_request"
    string_to_sign = "\n".join([
        "AWS4-HMAC-SHA256",
        amz_date,
        scope,
        hashlib.sha256(canonical_request.encode()).hexdigest(),
    ])
    signature = hmac.new(signing_key(MINIO_SECRET_KEY, short_date, MINIO_REGION), string_to_sign.encode(), hashlib.sha256).hexdigest()
    headers["Authorization"] = f"AWS4-HMAC-SHA256 Credential={MINIO_ACCESS_KEY}/{scope}, SignedHeaders={signed_headers}, Signature={signature}"
    url = MINIO_ENDPOINT + object_path
    req = urllib.request.Request(url, data=content, headers=headers, method="PUT")
    with urllib.request.urlopen(req, timeout=120) as res:
        res.read()
        return res.status

def content_type_for(path, headers):
    raw = headers.get("Content-Type") or headers.get("content-type") or ""
    raw = raw.split(";")[0].strip()
    if raw and raw != "application/octet-stream":
        return raw
    guessed, _ = mimetypes.guess_type(path)
    return guessed or raw or "application/octet-stream"

def load_copied():
    copied = set()
    if MANIFEST.exists():
        for line in MANIFEST.read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            try:
                row = json.loads(line)
            except json.JSONDecodeError:
                continue
            if row.get("status") == "copied":
                copied.add((row.get("bucket"), row.get("path")))
    return copied

def append_json(path, row):
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False, sort_keys=True) + "\n")

def copy_one(obj, retry=False):
    bucket = obj["bucket"]
    object_path = obj["path"]
    key = f"{MINIO_KEY_PREFIX}/{bucket}/{object_path}".strip("/")
    try:
        content, headers = download_object(bucket, object_path)
        ctype = content_type_for(object_path, headers)
        minio_put(key, content, ctype)
        append_json(MANIFEST, {
            "status": "copied",
            "bucket": bucket,
            "path": object_path,
            "key": key,
            "bytes": len(content),
            "content_type": ctype,
            "retried": retry,
            "at": dt.datetime.utcnow().isoformat() + "Z",
        })
        return True, None
    except Exception as exc:
        err = str(exc)
        append_json(FAILURES, {
            "status": "failed",
            "bucket": bucket,
            "path": object_path,
            "key": key,
            "retried": retry,
            "error": err[:500],
            "at": dt.datetime.utcnow().isoformat() + "Z",
        })
        return False, err

def main():
    buckets = list_buckets()
    objects = []
    for bucket in buckets:
        name = bucket.get("name") or bucket.get("id")
        if not name:
            continue
        bucket_objects = list_prefix(name)
        print(f"BUCKET {name}: {len(bucket_objects)} objects")
        objects.extend(bucket_objects)

    copied_state = load_copied()
    pending = [o for o in objects if (o["bucket"], o["path"]) not in copied_state]
    copied_now = 0
    failed = []
    for obj in pending:
        ok, err = copy_one(obj)
        if ok:
            copied_now += 1
        else:
            failed.append(obj)

    unresolved = []
    if failed:
        print(f"RETRY_ONCE {len(failed)}")
        time.sleep(1)
        for obj in failed:
            ok, err = copy_one(obj, retry=True)
            if ok:
                copied_now += 1
            else:
                unresolved.append({**obj, "error": err})

    copied_total = len(load_copied())
    summary = {
        "buckets_scanned": len([b for b in buckets if (b.get("name") or b.get("id"))]),
        "source_objects": len(objects),
        "already_copied": len(copied_state),
        "copied_this_run": copied_now,
        "copied_total": copied_total,
        "failed_unresolved": len(unresolved),
        "manifest": str(MANIFEST),
        "failures": str(FAILURES),
    }
    print("SUMMARY " + json.dumps(summary, sort_keys=True))
    if unresolved:
        print("UNRESOLVED_FAILURES")
        for item in unresolved:
            print(json.dumps(item, ensure_ascii=False, sort_keys=True))
        sys.exit(1)
    if copied_total != len(objects):
        print(f"COUNT_MISMATCH copied_total={copied_total} source_objects={len(objects)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
PY
