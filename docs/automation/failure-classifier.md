# Failure Classifier

`scripts/classify-gh-failure.mjs` maps recurring GitHub Actions failures to a
stable class, recommended fix, and automation boundary.

## Usage

```bash
node scripts/classify-gh-failure.mjs --log-file failed-run.log --json
node scripts/classify-gh-failure.mjs --text "pnpm audit high vulnerability"
gh run view <run-id> --repo oaslananka-lab/kicad-studio --log-failed \
  | node scripts/classify-gh-failure.mjs --json
```

## Output Fields

Each classification includes:

- `class`
- `rootCause`
- `recommendedFix`
- `autoFixAllowed`
- `humanApprovalRequired`
- `releasePublishMustStop`
- `auto_fix_allowed`
- `human_approval_required`
- `publish_must_stop`
- `confidence`

## Classes

The classifier recognizes:

- `marketplace-trusted-publisher-mismatch`
- `marketplace-token-missing`
- `vscode-marketplace-publish-failed`
- `open-vsx-token-missing`
- `open-vsx-publish-failed`
- `vsix-package-invalid`
- `vsix-contents-invalid`
- `vsce-package-error`
- `ovsx-package-error`
- `extension-manifest-invalid`
- `package-json-version-drift`
- `release-tag-version-mismatch`
- `artifact-attestation-failed`
- `sbom-generation-failed`
- `checksum-generation-failed`
- `generated-assets-drift`
- `workflow-syntax`
- `actionlint`
- `zizmor`
- `dependency-cache/restore issue`
- `CodeQL finding`
- `Gitleaks finding`
- `gitleaks-secret`
- `Trivy finding`
- `test failure`
- `typecheck failure`
- `lint failure`
- `pnpm audit failure`
- `dependency audit finding`
- `package build failure`
- `personal-mirror-tag-clobber`
- `personal-mirror-branch-divergence`
- `flaky/infra failure`

Unknown failures are intentionally classified as requiring human approval and
stopping release or publish work. Add a new class only after the same failure
mode repeats or has a clear remediation path.

## Automation Policy

Auto-fix is allowed only for narrow, source-controlled corrections such as
format, lint, package metadata drift, generated asset drift, workflow upload
folder mistakes, docs link drift, and clear fixture expectation updates.

Human approval is required for anything involving publish credentials,
environment protection, branch rules, disabling checks, security policy,
package identity, destructive mirror force, or release behavior that could
enable production publishing.
