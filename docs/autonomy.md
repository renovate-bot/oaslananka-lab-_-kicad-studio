# Repository Autonomy

This repository implements a fully autonomous infrastructure model.

- **Dual-Owner Mirroring:** Heavy CI operations run isolated in the `oaslananka-lab` organization.
- **Secret Management:** All repository secrets are managed through Doppler and injected just-in-time.
- **Workflow Integrity:** Checks enforce Conventional Commits, standard linting, and automated test publishing.
- **Release Automation:** Automated changelog generation and secure publish pipelines via GitHub Actions.
