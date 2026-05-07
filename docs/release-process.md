# Release Process

Releases are triggered manually from the canonical `oaslananka-lab/kicad-studio` repository. The personal `oaslananka/kicad-studio` repository is a showcase mirror and is never the release authority.

1. Go to **Actions** → **Release**.
2. Click **Run workflow**.
3. Enter the version (e.g., `v2.7.7`).
4. Choose whether to **Publish to registries** (`true` or `false`).
5. If publishing, type `APPROVE_RELEASE` in the approval field.

The workflow will:

- Build and package the extension.
- Validate the package metadata and required VSIX runtime assets.
- Generate `SHA256SUMS.txt`.
- Generate `sbom.cdx.json`.
- Create a build provenance attestation.
- Publish to VS Code Marketplace and Open VSX (if requested).
- Create a GitHub Release (draft if not publishing).

Required environment:

- `release`

Required secrets:

- `VSCE_PAT`
- `OVSX_PAT`
- `DOPPLER_GITHUB_SERVICE_TOKEN` only if maintainers later replace the default
  `github.token` GitHub Release flow with a service-token fallback

Supporting secrets:

- `CODECOV_TOKEN` for coverage upload only
- `JULES_API_KEY` for Jules automation only
- `PERSONAL_REPO_PUSH_TOKEN` for one-way showcase mirroring only
- `SENTRY_AUTH_TOKEN` only when source maps are uploaded

Publishing must not run unless `publish=true` and `approval=APPROVE_RELEASE`.

Before any publish attempt, inspect the state machine:

```bash
GH_TOKEN=<token> node scripts/release-state.mjs --repo oaslananka-lab/kicad-studio --json
```

`safe_to_publish` is advisory and conservative. Even when it is true, publishing
still requires manual workflow dispatch and the `release` environment approval.
