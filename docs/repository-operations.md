# Repository Operations

## Repository Model

- Canonical repository: `https://github.com/oaslananka-lab/kicad-studio`
- Personal showcase mirror: `https://github.com/oaslananka/kicad-studio`
- CI/CD, releases, marketplace publishing, signing, security scanning, dependency automation, mirror automation, and Jules automation run only from the organization repository.
- The personal repository is a showcase mirror and must not run publish workflows.
- If organization and personal repository state conflict, the organization repository wins.

Release and publish jobs must keep this repository guard:

```yaml
if: github.repository == 'oaslananka-lab/kicad-studio'
```

## Control Plane Model

Blocking correctness gates:

- format
- lint
- typecheck
- unit tests
- build
- VSIX package
- workflow syntax/actionlint
- secret scan
- package metadata consistency

Advisory gates:

- Scorecard
- docs links
- optional package smoke
- personal mirror
- Marketplace and Open VSX dry-run packaging

Release authority gates:

- `release` environment approval
- explicit `approval=APPROVE_RELEASE`
- version and tag consistency
- VSIX package integrity
- checksums, SBOM, and artifact attestations
- production VS Marketplace, Open VSX, and GitHub Release publish

Bot and agent feedback gates:

- unresolved review threads
- Jules, Sentry, Gemini, Codex, and other bot comments
- GitHub suggested changes
- human review comments

Cheap PR gates run on draft PRs. Heavy full CI and CodeQL wait until a pull
request is ready for review. Push-to-main and merge queue checks are not
skipped.

## Workflow Inventory

| Class                | Workflows                                                                                 | Notes                                                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Blocking correctness | `ci.yml`, `lint-fast.yml`, `commitlint.yml`, `gitleaks.yml`, `review-thread-gate.yml`     | Required before merge when applicable. Draft PRs run cheap gates; full CI waits for ready-for-review.                          |
| Advisory             | `scorecard.yml`, `pr-size.yml`, `stale.yml`, `release-drafter.yml`, `mirror-personal.yml` | Useful signal, but not release authority. Mirror failures require triage but personal state does not control publish.          |
| Release authority    | `release.yml`                                                                             | Manual dispatch, `release` environment, version validation, explicit approval, VSIX, checksum, SBOM, and attestation handling. |
| Bot and agent        | `jules-*.yml`, `agent-review-fix-loop.yml`, `actions-maintenance.yml`                     | Create/update PRs or triage runs only. They do not publish, merge, approve, or change secrets.                                 |

## Daily Operations

### Local Sync

```bash
bash scripts/sync-remotes.sh
```

### Local Validation

```bash
corepack npm ci
corepack npm run format:check
corepack npm run lint
corepack npm run typecheck
corepack npm run test:unit
corepack npm test
corepack npm run build
corepack npm run package
corepack npm run workflows:lint
npm audit --audit-level=high
npx @vscode/vsce package
corepack npm run package:ovsx
```

`package:ovsx` is the safe Open VSX packaging check. The current `ovsx` CLI publishes through `ovsx publish`; do not use that command outside the guarded release workflow.

`npm run publish` is intentionally fail-closed. Production publishing must use
`.github/workflows/release.yml` with `publish=true`,
`approval=APPROVE_RELEASE`, and the `release` environment approval.

### Repository Hygiene

```bash
bash scripts/repo-cleanup.sh           # dry-run
bash scripts/repo-cleanup.sh --apply   # execute deletions
```

## Jules Automation

Jules workflows live only in the organization repository:

- `.github/workflows/jules-manual.yml`
- `.github/workflows/jules-ci-fixer.yml`
- `.github/workflows/jules-dependency-fixer.yml`
- `.github/workflows/jules-issue-agent.yml`
- `.github/workflows/agent-review-fix-loop.yml`

Required secret:

- `JULES_API_KEY`

Manual trigger:

```bash
gh workflow run jules-manual.yml --repo oaslananka-lab/kicad-studio
```

Dependency triage trigger:

```bash
gh workflow run jules-dependency-fixer.yml --repo oaslananka-lab/kicad-studio
```

Jules may create or update fix branches and PRs. Jules must not publish, merge, approve, alter secrets, or weaken release, publish, security, Workspace Trust, AI, or MCP guardrails. See [automation/jules.md](automation/jules.md).

No auto-approve or auto-merge workflow is enabled for Jules PRs.

## Review Thread Control

Review-thread state is checked by:

- `scripts/check-review-threads.mjs`
- `.github/workflows/review-thread-gate.yml`
- [automation/review-thread-gate.md](automation/review-thread-gate.md)

Actionable unresolved threads add `review:blocked` and `ci:hold`. Clean review
state adds `review:clean` and `ci:ready`. Human review threads are never
auto-resolved.

The guarded review fix loop is documented in
[automation/agent-review-fix-loop.md](automation/agent-review-fix-loop.md).

## Failure Classification And Maintenance

- `scripts/classify-gh-failure.mjs`
- `.github/workflows/actions-maintenance.yml`
- [automation/failure-classifier.md](automation/failure-classifier.md)
- [automation/actions-maintenance.md](automation/actions-maintenance.md)

Maintenance is manual-only and dry-run by default. It may classify failures,
list stale drafts, summarize release state, cancel superseded PR runs, or rerun
infra-only failures under explicit guards. It must not publish, force mirror,
delete tags, delete releases, approve PRs, or merge PRs.

## Release And Publish Authority

Only the organization repository may run release or publish workflows. Marketplace publishing, Open VSX publishing, and GitHub Release creation remain human-gated and environment-gated.

Required release environment:

- `release`

Required secrets:

- `VSCE_PAT`
- `OVSX_PAT`
- `JULES_API_KEY`
- `PERSONAL_REPO_PUSH_TOKEN`
- `DOPPLER_GITHUB_SERVICE_TOKEN` only if maintainers later replace the default
  `github.token` GitHub Release flow with a service-token fallback
- `CODECOV_TOKEN` only for coverage upload
- `SENTRY_AUTH_TOKEN` only when source maps are uploaded

Required vars:

- `AUTO_RELEASE_PUBLISH=false`
- `AUTO_RELEASE_TARGET=dry-run`
- `EXTENSION_PUBLISHER=oaslananka`
- `VS_MARKETPLACE_ITEM=oaslananka.kicadstudio`
- `OPEN_VSX_NAMESPACE=oaslananka`

Do not print tokens. Do not store API keys in the repository.

## Codecov

`CODECOV_TOKEN` is available as an organization-level selected secret and may be used only for coverage upload. It must not be used as a Codecov API token.

Fork pull requests must not require token-backed upload. Coverage upload failures should not mask test failures.

## Personal Showcase Mirror

The personal repository is showcase-only. It should receive one-way source mirroring from `oaslananka-lab/kicad-studio` for `main` and `v*.*.*` tags only. Do not mirror issues, releases, workflow state, release-please branches, or PR branches.

Mirror behavior is documented in [automation/mirror-personal.md](automation/mirror-personal.md).
Automatic mode pushes only safe main updates and missing tags. Divergent tags
or divergent personal main fail with an actionable manual force-with-lease
instruction.

To ensure no Actions minutes are consumed on the personal repository, disable Actions there:

```bash
gh api -X PUT /repos/oaslananka/kicad-studio/actions/permissions -f enabled=false
```

Enable automatic head branch deletion in the organization repository:

```bash
gh api -X PATCH /repos/oaslananka-lab/kicad-studio -f delete_branch_on_merge=true
```
