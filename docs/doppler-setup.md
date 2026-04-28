# Doppler Setup

To set up secrets for this repository:

1. Go to Doppler dashboard → Integrations → GitHub.
2. Install the Doppler app on both `oaslananka` and `oaslananka-lab`.
3. Create two GitHub Sync configurations per repo (canonical and org).
4. Add `DOPPLER_TOKEN` (read-only service token, scoped to `all/main`) as a GitHub Action secret on both repositories.
