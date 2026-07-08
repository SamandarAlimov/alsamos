# Alsamos Deploy Notes

Public exposure is intentionally deferred until Cloudflare nameservers and the
Tunnel token are ready.

Current internal deploy sequence:

1. Build and push ARM64 images to GHCR.
2. Replace `PLACEHOLDER_SHA` image tags in `infra/k8s/apps/*.yaml`.
3. Create Kubernetes Secrets from real credentials, never from committed values.
4. Apply manifests from the Oracle host with `KUBECONFIG=$HOME/.kube/config`.

Required secrets before enabling deploy automation:

- `K3S_KUBECONFIG`
- `GHCR_PAT` or GitHub Actions package permission confirmation
- `CLOUDFLARE_TUNNEL_TOKEN`
- `OPENROUTER_API_KEY`
- Supabase project credentials for migrations and edge function deploys

