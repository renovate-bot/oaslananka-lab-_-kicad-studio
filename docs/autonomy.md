# Repository Autonomy

This repository follows a 2026 principal-engineer automation model.

## Key Principles

- **Dual-owner mirror:** Heavy CI and releases run in a dedicated lab mirror (`oaslananka-lab`) to keep the canonical repository clean.
- **Doppler-first secrets:** Secrets are managed centrally in Doppler. No secrets are stored in GitHub except for the bootstrap `DOPPLER_TOKEN`.
- **Local-first quality gates:** Every check that runs in CI can be run locally via `task ci`.
- **Conventional Commits:** Enforced via `commitlint` to ensure a clean changelog.
- **Auto-drafted releases:** Release notes are automatically generated from merged PRs.

## Workflow

1. Human pushes to `oaslananka/kicad-studio`.
2. `Mirror to org` workflow pushes the changes to `oaslananka-lab/kicad-studio`.
3. `KiCad Studio CI` runs in the lab mirror.
4. Security scans (CodeQL, Gitleaks, Scorecard) run in the lab mirror.
5. Releases are manually triggered in the lab mirror and mirrored back to the canonical repo.
