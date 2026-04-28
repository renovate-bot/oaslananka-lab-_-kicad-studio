# Repository Operations

## Dual-owner mirror model

- `oaslananka/kicad-studio` is the canonical public repository.
- `oaslananka-lab/kicad-studio` is the CI/CD runner mirror.
- The human pushes only to the canonical repo.
- Mirroring is automatic via GitHub Actions.

## Daily operations

### Local sync

```bash
bash scripts/sync-remotes.sh
```

### Secret verification

```bash
task doppler:check
```

## Repository hygiene

A cleanup script is available to identify and prune old branches:

```bash
bash scripts/repo-cleanup.sh           # dry-run
bash scripts/repo-cleanup.sh --apply   # execute deletions
```

## Auto-delete head branches

It is recommended to enable "Automatically delete head branches" in GitHub settings for the canonical repo:

```bash
gh api -X PATCH /repos/oaslananka/kicad-studio -f delete_branch_on_merge=true
```
