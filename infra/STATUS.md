# Alsamos Infra Status

Updated: 2026-07-08

## Stage 1 - Ecosystem Consolidation

| Phase | Status | Proof / Blocker |
| --- | --- | --- |
| 0 - Secrets hygiene | PARTIAL | `apps/accounts/docs/oauth-clients-config.json` removed, `apps/accounts/.gitignore` now ignores `.env*` and the OAuth client registry, hardcoded `social_secret_2024_secure_key_abc123` replaced with `import.meta.env.VITE_ALSAMOS_OAUTH_CLIENT_SECRET`. Targeted scan found no remaining literal OAuth client secrets; remaining `client_secret` hits are type/UI field names. Committed and pushed in `apps/accounts` as `91f4e32`. BLOCKED: needs human approval and secure out-of-band storage location before rotating and distributing all external OAuth client secrets. |
| A - Merge schemas into social Supabase | PARTIAL | Social remote verified as `https://github.com/SamandarAlimov/socialalsamos.git`. Pushed `alsamos-web` commit `4a99084` with consolidation migration, ported Supabase functions, and `supabase/config.toml`. Static validation found no `DROP TABLE` or `CREATE TABLE profiles/notifications/user_roles/user_sessions`; only `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS` is used for profile additions. All `auth.users` FKs in the consolidation migration use `ON DELETE CASCADE`; no `public.profiles` FK was found. BLOCKED: needs social Supabase service role key and DB connection string only for CLI `db push`; Lovable SQL editor can apply the printed SQL without CLI keys. |
| B - Unified auth | PARTIAL | Accounts, mail, and social now use shared `.alsamos.com` cookie-backed Supabase storage and point at canonical project `mbhjganbihamoiqmankv`; pushed social commit `1f33d63`, accounts commit `6680ea2`, and mail commit `fe47414` for shared auth/env examples. Cookie round-trip simulation verified an 11,038-byte auth value split into 3 chunks, read back exactly, and removed cleanly. Local production builds passed for social, accounts, and mail with Node `v24.18.0` / npm `11.16.0`. BLOCKED: real browser test on `*.alsamos.com` waits for Cloudflare/public deploy. |
| C - Storage consolidation | NEXT | Needs social Supabase service role key to create/verify buckets and policies. |
| D - Oracle public deploy | DONE | Frontends are live through Cloudflare Tunnel on Oracle K3s. Proof: `https://app.alsamos.com`, `https://accounts.alsamos.com`, and `https://mail.alsamos.com` return `HTTP/1.1 200 OK`; cert-manager certificate `apps/alsamos-frontends-tls` is `Ready=True`. |
| E - AI service | PARTIAL | Root local commit `1841582` added `services/ai` FastAPI gateway using `python:3.12-slim`, Pollinations and OpenRouter `:free` routing only, plus `infra/k8s/apps/ai-gateway.yaml` for `ai.alsamos.com` TLS. Local Python compile/run was not possible because only the Microsoft Store Python stub is installed. BLOCKED: OPENROUTER_API_KEY pending for OpenRouter free models. |
| F - Monorepo + CI/CD | DONE | Root monorepo remote is `https://github.com/SamandarAlimov/alsamos.git`. GitHub Actions run `28958191697` completed successfully: buildx `linux/arm64` pushed GHCR images and deployed to Oracle K3s over SSH. Proof: `social-web`, `accounts-web`, and `mail-web` rolled out with image tag `52d02fc8ffe996d4d99615fb94a0bf9d46a3806a`. |

## Stage 1 - Step 3 Execution

Credential matrix: S1 Supabase = BLOCKED-EXTERNAL (Supabase CLI browser login is 2FA-locked); S2 GitHub/GHCR = AVAILABLE (`gh auth status` logged in as `SamandarAlimov` with `write:packages`); S3 Cloudflare = AVAILABLE (`cloudflared tunnel list` shows tunnel `alsamos` id `8bc83c19-748b-49a9-a10f-58a8e7f38e78`); S4 Kubeconfig = AVAILABLE (`sudo k3s kubectl get ns data` returned `namespace/data`); S5 OpenRouter = BLOCKED-EXTERNAL (`OPENROUTER_API_KEY` missing).

| Task | Status | Proof / Blocker |
| --- | --- | --- |
| E1 - Supabase edge functions | BLOCKED-EXTERNAL | Deferred by Step 3.2. Supabase CLI browser login is 2FA-locked; consolidation SQL was already applied via Lovable, so migration is not rerun. |
| E2 - OAuth client secret rotation | BLOCKED-EXTERNAL | Deferred by Step 3.2. Rotation approval and storage location are approved (`data/oidc-secrets`), but updating live `oauth_clients` rows requires Supabase admin access or Lovable SQL editor `UPDATE oauth_clients`. Plaintext secrets were not generated, logged, or committed. |
| E3 - Oracle frontends + Cloudflare Tunnel | DONE | Built ARM64 images on Oracle with `sudo docker`, imported into K3s containerd, applied `frontend-apps` and `cloudflared`, and stored tunnel token in Kubernetes Secret `edge/cloudflared-token`. Proof: pods `social-web`, `accounts-web`, `mail-web`, `cloudflared` are `Running`; ingress `alsamos-frontends` exists for `app/accounts/mail.alsamos.com`; certificate `alsamos-frontends-tls` is `Ready=True`; `curl -I` returned `HTTP/1.1 200 OK` for `https://app.alsamos.com`, `https://accounts.alsamos.com`, and `https://mail.alsamos.com`. |
| E4 - Oracle AI service | BLOCKED-EXTERNAL | Needs `OPENROUTER_API_KEY`; env var is missing. No AI Secret or Kubernetes apply run. |
| E5 - CI/CD activation | DONE | Repo `https://github.com/SamandarAlimov/alsamos.git` is live. GitHub Secrets include `KUBECONFIG`, `ORACLE_SSH_KEY_B64`, and `VITE_SUPABASE_PUBLISHABLE_KEY` (no plaintext committed). Green workflow: `https://github.com/SamandarAlimov/alsamos/actions/runs/28958191697`. Proof: `deployment "social-web" successfully rolled out`, `deployment "accounts-web" successfully rolled out`, `deployment "mail-web" successfully rolled out`; images use GHCR tag `52d02fc8ffe996d4d99615fb94a0bf9d46a3806a`. |
| E6 - Cross-app SSO verification | DONE | App-level Supabase auth verified without dashboard access. Proof: `GET /auth/v1/settings` returned `200` with `mailer_autoconfirm=true`; signup created throwaway user `ssotest+ee9142de912d@alsamos.com`; `GET /auth/v1/user` returned `200` for user id `318994d4-120e-4bb8-80e3-442a7d46839b`. Social, accounts, and mail now all use `sharedSupabaseStorage` with `domain=.alsamos.com` and the same `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`; `curl` returned `app=200`, `accounts=200`, `mail=200`. Cleanup note: deleting the throwaway user needs Supabase service_role/dashboard access. |

| Phase | Status | Notes |
| --- | --- | --- |
| B - Domain, TLS, ingress, Cloudflare | PARTIAL | cert-manager v1.20.3 installed and verified. Let's Encrypt staging/prod ClusterIssuers are Ready with alsamos.company@gmail.com. Cloudflare Tunnel/DNS is blocked because alsamos.com still uses rdns1/rdns2.ahost.uz and no tunnel token was provided. |
| C - Alsamos ID (SSO) | PARTIAL | Accounts frontend and internal identity-api are deployed as ClusterIP. OIDC schema is loaded, RS256 JWKS works, and an internal PKCE code-to-token test passed. Full login UI and leaked client secret rotation still need user confirmation/work. |
| D - Supabase migration | BLOCKED | Prep scripts added. Needs Supabase project ref, DB connection string, service role key, and cutover confirmation. |
| E - Super-app first launch | DONE | Social PWA is live at `https://app.alsamos.com` with Cloudflare Tunnel, Traefik, and cert-manager TLS. Authenticated SSO browser proof remains tracked under Step 3 E6. |
| F - Mail | DONE | Mail frontend is live at `https://mail.alsamos.com` with Cloudflare Tunnel, Traefik, and cert-manager TLS. Authenticated SSO browser proof remains tracked under Step 3 E6. |
| G - AI free models | PARTIAL | Pollinations-only internal AI gateway deployed with X-API-Key Secret and OpenAI-compatible endpoints. OpenRouter integration needs API key. |
| H - CI/CD | DONE | GitHub Actions buildx ARM64 -> GHCR -> Oracle K3s rollout is active. Green run: `https://github.com/SamandarAlimov/alsamos/actions/runs/28958191697`; rollout proof for social/accounts/mail succeeded. |
| I - Monitoring and backups | DONE | kube-prometheus-stack, Loki, and promtail are deployed internally. PostgreSQL daily MinIO backup CronJob was created and manually verified. |
| J - Security hardening | DONE | fail2ban enabled. SSH password auth and root login disabled; port 22 preserved. |

## Stage 2 - Phase G/H Data + Identity Dual-Run

| Task | Status | Proof / Blocker |
| --- | --- | --- |
| G1 - PostgreSQL backups | DONE | CronJob `data/postgres-backup-to-minio` is applied. Manual job `postgres-backup-stage2-20260708205947` completed and uploaded `local/pg-backups/alsamos-20260708T205948Z.dump`; `mc ls` showed both `alsamos-20260708T073238Z.dump` and `alsamos-20260708T205948Z.dump`. |
| G2 - PgBouncer pooling | DONE | Added `infra/k8s/pgbouncer.yaml`; deployment `data/pgbouncer` rolled out and `postgres-0` verified `psql -h pgbouncer -p 6432 -U postgres -d alsamos -c "select 1"` returned `1`. |
| G3 - Oracle social schema | DONE | Applied 51 transformed Supabase migration files into Oracle Postgres schema `social` with standalone stubs for `auth.users`, `auth.uid()`, Supabase roles, storage tables, and `supabase_realtime`; proof: `information_schema` reports 78 base tables in `social`, and `\dt social.*` lists 78 rows. |
| H1 - Alsamos ID scaffold | DONE | Added `services/alsamos-id` Go service with `/healthz`, `/signup`, `/login`, `/token`, `/userinfo`, `/.well-known/openid-configuration`, and `/jwks.json`; passwords use bcrypt and tokens are RS256. |
| H2 - Dual-run shadow mode | DONE | Alsamos ID issues tokens independently from `identity.users` in Oracle Postgres; Supabase Auth remains live source of truth and no app cutover was performed. Signup/login responses include `shadow=true`. |
| H3 - Alsamos ID deploy | DONE | ARM64 image built on Oracle and imported into K3s; K8s Secrets `apps/alsamos-id-jwt` and `apps/alsamos-id-db` created without committing plaintext; deployment `apps/alsamos-id` rolled out Running. Public proof: `https://id.alsamos.com/.well-known/openid-configuration` returned `200` JSON, `https://id.alsamos.com/jwks.json` returned `200` JSON with kid `alsamos-id-stage2`, and cert `apps/id-alsamos-com-tls` is `Ready=True`. Signup/login returned RS256 JWTs in shadow mode. |
| H4 - Kafka KRaft | DONE | Added `infra/k8s/kafka.yaml`; StatefulSet `data/kafka` rolled out with pod `kafka-0` Running, heap `-Xmx512m`, one 10Gi PVC; topics created and listed: `auth.events`, `user.events`. |

CI note: GitHub Actions run `https://github.com/SamandarAlimov/alsamos/actions/runs/28992727993` is still `in_progress`; `ai-gateway`, `accounts-web`, `mail-web`, and `alsamos-id` image builds completed successfully, while `social-web` root image build is still running.

Deferred unchanged: live-user migration needs Supabase `auth.users` hash export after dashboard 2FA recovery; live data copy needs Supabase DB connection string.

## Stage 2 - API Gateway Shadow

| Task | Status | Proof / Blocker |
| --- | --- | --- |
| Go gateway scaffold | DONE | Added `services/alsamos-gateway` with `/healthz`, `/readyz`, dual-issuer JWT validation for Alsamos ID RS256 JWKS and Supabase JWKS/optional secret, reverse proxy routes for `/api/social/`, `/api/mail/`, `/api/accounts/`, `/ai/`, Redis-backed per-user/per-IP limiting, WebSocket-compatible reverse proxying, structured logs, and Prometheus `/metrics`. Oracle ARM64 Docker build succeeded and imported image `alsamos-gateway:stage2`. |
| Shadow deploy | DONE | Deployment `apps/alsamos-gateway` is `1/1` Ready with limits `256Mi/250m`; Service and Ingress `api.alsamos.com` are applied. Internal proof: `/healthz` returned `200`, valid Alsamos ID JWT to `/api/accounts/` returned `200`, invalid JWT returned `401`, rate limit returned `429_at_101`, and `/metrics` exposed `alsamos_gateway_requests_total`. Public proof: `api.alsamos.com` resolves to Cloudflare A/AAAA records, cert `apps/api-alsamos-com-tls` is `Ready=True`, and `curl -I https://api.alsamos.com/healthz` returned `HTTP/1.1 200 OK`. Fix applied: Cloudflare tunnel route exists and CoreDNS forwards `alsamos.com` lookups to public resolvers via `infra/k8s/coredns-alsamos-forward.yaml` to bypass stale Oracle VCN DNS for new subdomains. |

Deferred unchanged: live app traffic cutover through `api.alsamos.com` waits for parity verification; Supabase-dependent data routes wait for Phase I credentials.

## Stage 2 - Real Outbound Mail via Resend

| Task | Status | Proof / Blocker |
| --- | --- | --- |
| Audit | DONE | Current mail "send" path was not SMTP/API delivery: `apps/mail/src/hooks/useEmails.ts` only inserted a row into Supabase `emails` with `folder: sent`; `apps/mail/src/hooks/useScheduledEmails.ts` only changed scheduled status to `sent`. This explains Gmail/Yandex delivery failure. |
| Resend key | DONE | `RESEND_API_KEY` was provided by operator and stored only as Kubernetes Secret `apps/resend-secret`; plaintext was not committed. Gateway also has `apps/gateway-supabase` for Supabase token fallback validation. |
| Domain auth | BLOCKED-NEEDS-DNS | Resend domain slot was freed: `samos.uz` domain id `e00fb8ab-0343-40a6-b43d-e4cd285f5f46` deleted, then `alsamos.com` domain id `1f6bd1a9-1996-40fa-a25d-c4a967b158b7` created. Cloudflare API token is not available locally, so DNS was not applied. Required records: keep root MX `_dc-mx.3bad3dbeee99.alsamos.com` unchanged; keep DMARC `_dmarc TXT "v=DMARC1; p=none;"`; update root SPF TXT from `v=spf1 +a +mx +ip4:185.196.212.52 ~all` to `v=spf1 +a +mx +ip4:185.196.212.52 include:amazonses.com ~all`; add `resend._domainkey TXT "p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDWlf3OtoY8mFn6zknLkpa9LY+AGVb0pYDZWBvP8fbnfekgcVgK+O+YvQge3dKsa0myMadKhWodoceTtUx6KStRildJwsMIrQiWE4EwmIfeMkPaEqDC92Qa6vhFCmzL2qzmjGvt9NYlFN9nB1Bs2NdSD+WKS9Ixx0zWJT6WET2XaQIDAQAB"`; add `send MX 10 feedback-smtp.us-east-1.amazonses.com`; add `send TXT "v=spf1 include:amazonses.com ~all"`. Zoho MX was not removed. |
| Wire send path | DONE | Mail frontend repo `github.com/SamandarAlimov/mail` commit `01e483b` routes compose send through `https://api.alsamos.com/api/mail/send` before saving to Sent. Gateway image `alsamos-gateway:resend` rolled out `1/1`; public proof: `curl -I https://api.alsamos.com/healthz` returned `HTTP/1.1 200 OK`. |
| Test Gmail/Yandex | BLOCKED | `POST /domains/1f6bd1a9-1996-40fa-a25d-c4a967b158b7/verify` succeeded but `GET /domains/{id}` remains `status: pending` with all Resend records pending. Deferred until Cloudflare DNS records above are applied and Resend reports `verified`; no Gmail/Yandex test send was attempted. |

Remaining mail action: add the listed DNS records in Cloudflare, then rerun Resend verify and send the Gmail/Yandex test emails.
