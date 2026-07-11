#!/usr/bin/env bash
set -euo pipefail

echo "BLOCKED until SUPABASE_SERVICE_ROLE_KEY is available."
echo "Expected env:"
echo "  SUPABASE_URL=https://mbhjganbihamoiqmankv.supabase.co"
echo "  SUPABASE_SERVICE_ROLE_KEY=..."
echo "  MINIO_ALIAS=local"
echo "  MINIO_BUCKET=media"
echo
echo "Plan:"
echo "  1. List Supabase Storage objects from message-attachments, mini-app-icons, email-attachments."
echo "  2. Copy each object to MinIO under media/legacy/<bucket>/<path>."
echo "  3. Verify copied count == source count and failed == 0."
echo "  4. Run operator-media-urls.sql in Lovable."
echo "  5. Only after UI verification, delete originals in a separate audited batch."
exit 2
