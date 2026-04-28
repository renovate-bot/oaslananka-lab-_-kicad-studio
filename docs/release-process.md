# Release Process

Releases are triggered manually from the `oaslananka-lab/kicad-studio` repository.

1. Go to **Actions** → **Release**.
2. Click **Run workflow**.
3. Enter the version (e.g., `v2.6.0`).
4. Choose whether to **Publish to registries** (`true` or `false`).
5. If publishing, type `APPROVE_RELEASE` in the approval field.

The workflow will:

- Build and package the extension.
- Create a build provenance attestation.
- Publish to VS Code Marketplace and Open VSX (if requested).
- Create a GitHub Release (draft if not publishing).
