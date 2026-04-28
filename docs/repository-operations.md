# Repository Operations

This repository uses a dual-owner model:

- `oaslananka/kicad-studio`: Canonical public repository.
- `oaslananka-lab/kicad-studio`: Internal CI/CD mirror.

All changes should be pushed to the canonical repository. The canonical repository automatically mirrors changes to the org repository where heavy CI jobs run. Releases published in the org repository are automatically mirrored back.

If the mirror breaks, you can use the manual sync script:

- `./scripts/sync-remotes.sh` (Linux/macOS)
- `.\scripts\sync-remotes.ps1` (Windows)
