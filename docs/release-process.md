# Release Process

This repository automates releases using GitHub Actions.

To invoke a release:

1. Go to the Actions tab in the `oaslananka-lab/kicad-studio` repository.
2. Select the "Release" workflow.
3. Click "Run workflow".
4. Provide the version string (e.g., `v1.2.3`).
5. To actually publish to registries, set "Publish to registries" to `true` and type `APPROVE_RELEASE` in the approval field.

The workflow will build the project, attest artifacts, publish to Open VSX and VS Code Marketplace, and create a GitHub release.
