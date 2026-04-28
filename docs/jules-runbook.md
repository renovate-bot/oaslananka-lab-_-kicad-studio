# Jules / Autonomous Agent Runbook

Jules can automatically resolve issues labeled with `type:bug`, `type:docs`, `type:refactor`, or `good first issue`.

## Setup

1. Add `JULES_API_KEY` to Doppler `all/main`.
2. Ensure `DOPPLER_TOKEN` is set as a GitHub Secret.
3. Once the Jules REST API is confirmed for this repository, enable the `Jules auto-trigger` workflow.

## Manual trigger via CLI

```bash
doppler run --project all --config main -- bash -c '
  curl -fsSL -X POST https://jules.googleapis.com/v1alpha/sessions \
    -H "x-goog-api-key: $JULES_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$(jq -n \
      --arg prompt "Resolve issue #123" \
      --arg src    "sources/github/oaslananka/kicad-studio" \
      --arg title  "Fix issue #123" \
      "{prompt: \$prompt, sourceContext: {source: \$src, githubRepoContext: {startingBranch: \"main\"}}, automationMode: \"AUTO_CREATE_PR\", title: \$title}")"
'
```
