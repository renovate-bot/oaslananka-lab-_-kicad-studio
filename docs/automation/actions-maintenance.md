# Actions Maintenance

`actions-maintenance.yml` is a manual-only operations workflow for triage and
safe CI cleanup. It is not a release workflow and cannot publish artifacts.

## Modes

- `list-failed-runs`: list recent failed runs, optionally filtered by branch
- `classify-run`: fetch failed logs for one run and classify them with
  `scripts/classify-gh-failure.mjs`
- `cancel-superseded-pr-runs`: cancel in-progress pull request runs for one
  branch
- `rerun-infra-only-failure`: rerun failed jobs for a known infrastructure
  failure
- `release-summary`: run `scripts/release-state.mjs` and list recent release
  workflow runs
- `detect-stale-drafts`: list draft PRs and recent releases for maintainer
  cleanup

## Default Safety

The workflow defaults to `dry_run=true`. Mutation modes require:

- manual dispatch
- canonical repository guard
- `dry_run=false`
- a target branch or run id

It never deletes tags, deletes releases, creates releases, publishes
Marketplace/Open VSX packages, force mirrors refs, approves PRs, or merges PRs.

## Examples

```bash
gh workflow run actions-maintenance.yml \
  --repo oaslananka-lab/kicad-studio \
  -f mode=list-failed-runs \
  -f dry_run=true
```

```bash
gh workflow run actions-maintenance.yml \
  --repo oaslananka-lab/kicad-studio \
  -f mode=classify-run \
  -f run_id=<run-id> \
  -f dry_run=true
```

Only use mutation modes after the failure classifier or run logs show that the
failure is infrastructure-only or superseded.
