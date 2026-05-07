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

## Release And Publish Authority

Only the organization repository may run release or publish workflows. Marketplace publishing, Open VSX publishing, and GitHub Release creation remain human-gated and environment-gated.

Required release environment:

- `release`

Required secrets:

- `VSCE_PAT`
- `OVSX_PAT`
- `JULES_API_KEY`
- `PERSONAL_REPO_PUSH_TOKEN`
- `DOPPLER_GITHUB_SERVICE_TOKEN` as an optional GitHub Release fallback
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

To ensure no Actions minutes are consumed on the personal repository, disable Actions there:

```bash
gh api -X PUT /repos/oaslananka/kicad-studio/actions/permissions -f enabled=false
```

Enable automatic head branch deletion in the organization repository:

```bash
gh api -X PATCH /repos/oaslananka-lab/kicad-studio -f delete_branch_on_merge=true
```
