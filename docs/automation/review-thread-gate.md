# Review Thread Gate

`review-thread-gate.yml` is a cheap pull request gate for unresolved review
threads. It does not publish, merge, approve, or resolve review conversations.

## What It Checks

The workflow calls:

```bash
node scripts/check-review-threads.mjs --repo oaslananka-lab/kicad-studio --pr <number> --json --fail-on-actionable
```

The script uses GitHub GraphQL to read the pull request, draft state, and up to
100 review threads with path, line, original line, diff side, and comments.

The gate ignores:

- resolved threads
- outdated threads
- automation-only informational threads

The gate blocks on:

- unresolved, not-outdated human review threads
- unresolved, not-outdated automation-authored threads containing actionable release,
  security, workflow, package, Marketplace, `vsce`, `ovsx`, secret, token,
  correctness, vulnerability, or suggested-fix language

## Labels

When actionable unresolved threads exist, the workflow adds:

- `review:blocked`
- `ci:hold`

When no actionable unresolved threads exist, it adds:

- `review:clean`
- `ci:ready`

The workflow creates these labels if they are missing. Label updates are a PR
triage aid; the repository ruleset remains the authoritative branch protection
mechanism for required review-thread resolution.

## Security Boundaries

- Runs only in `oaslananka-lab/kicad-studio`.
- Uses the default `GITHUB_TOKEN`; no external secrets are required.
- Does not use `pull_request_target`.
- Does not auto-resolve human review threads.
- Writes a redacted `review-thread-summary.json` artifact and Markdown job
  summary.

## Local Use

```bash
GH_TOKEN=<token> node scripts/check-review-threads.mjs \
  --repo oaslananka-lab/kicad-studio \
  --pr <number> \
  --json \
  --summary-file review-thread-summary.json \
  --fail-on-actionable
```
