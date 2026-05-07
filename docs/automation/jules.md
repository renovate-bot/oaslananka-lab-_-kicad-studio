# Jules Automation

Jules automation is enabled only in the canonical organization repository:

- Canonical repository: `https://github.com/oaslananka-lab/kicad-studio`
- Personal showcase mirror: `https://github.com/oaslananka/kicad-studio`

The personal repository is a showcase mirror only. Do not add or run Jules workflows there.

## What Jules Can Do

Jules may create or update fix branches and pull requests for:

- CI failures from trusted same-repository workflow runs
- Manual maintainer-requested fixes
- Controlled dependency triage
- Trusted, allowlisted issue triggers
- Tests, docs, MCP integration, security hardening, packaging dry-run, Marketplace packaging dry-run, and Open VSX packaging dry-run fixes

Every Jules prompt requires local validation before opening or updating a PR:

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

`ovsx` does not expose a non-publishing `package` subcommand in the current CLI. `package:ovsx` intentionally builds the same VSIX that `ovsx publish` would upload, but it never calls `ovsx publish`.

If a command is missing, Jules must add the script or document why it is not applicable. It must not silently skip validation.

## What Jules Must Not Do

Jules must never:

- Publish to the Visual Studio Marketplace.
- Publish to Open VSX.
- Create production GitHub Releases.
- Publish VSIX production artifacts.
- Publish npm packages.
- Publish Docker images.
- Modify marketplace metadata for a live publish.
- Merge PRs.
- Approve PRs.
- Print or store secrets.
- Modify secrets or require new credentials without documentation.
- Weaken CI, linting, security checks, Workspace Trust, AI opt-in behavior, or MCP opt-in behavior.
- Execute fork PR code with secrets.
- Use `pull_request_target` to check out or run untrusted code.

Human review and the release environment remain required for all release and publish workflows.

## Required Secret

Add this as a GitHub Actions secret in the organization repository:

- `JULES_API_KEY`

Do not store this secret in the repo, Doppler docs, PR bodies, logs, or screenshots.

## Workflows

### Manual Jules

Workflow: `.github/workflows/jules-manual.yml`

Maintainers can run a focused Jules task with:

```bash
gh workflow run jules-manual.yml --repo oaslananka-lab/kicad-studio
```

Inputs:

- `branch`: branch Jules starts from, default `main`
- `task_type`: guarded task category
- `prompt`: focused task text
- `include_last_commit`: whether to include the latest commit diff
- `include_commit_log`: whether to include recent commit history

### CI Fixer

Workflow: `.github/workflows/jules-ci-fixer.yml`

This workflow uses `workflow_run` and runs only when all of these are true:

- Repository is `oaslananka-lab/kicad-studio`.
- The triggering workflow failed.
- The failed run came from the same repository, not a fork.
- The branch does not start with `jules/`, `dependabot/`, or `release-please--`.
- The failed workflow is not a release, publish, mirror, or Jules workflow.

The prompt includes the failed workflow URL, branch, commit, and validation checklist. It does not fetch or execute fork code.

Expected skips:

- Fork-origin workflow runs.
- Personal showcase repository runs.
- Release and publish workflows.
- Jules-created branches.
- Dependabot branches.
- Release Please branches.

### Dependency Fixer

Workflow: `.github/workflows/jules-dependency-fixer.yml`

Maintainers can run controlled dependency triage with:

```bash
gh workflow run jules-dependency-fixer.yml --repo oaslananka-lab/kicad-studio
```

Modes:

- `dry-run`
- `consolidate-dependabot`
- `security-only`
- `socket-alerts`

Jules must use one controlled branch, `chore/dependency-hardening-jules`, classify updates, respect VS Code extension compatibility, keep Node types aligned to Node 24.x, keep `@types/vscode` aligned to the minimum `engines.vscode` target unless justified, and avoid blind major upgrades.

### Issue Agent

Workflow: `.github/workflows/jules-issue-agent.yml`

This workflow runs only for issue label events when:

- Repository is `oaslananka-lab/kicad-studio`.
- Issue author is allowlisted as `oaslananka`.
- The applied label is one of `jules`, `bug`, `ci-fix`, `dependency-fix`, or `mcp-integration`.

No fork code is checked out or executed.

## Auto-Merge Decision

No Jules auto-approve or auto-merge workflow is implemented. Jules PRs require human review. This avoids accidental merges that touch protected workflow, release, package metadata, security policy, `.vscodeignore`, or credential documentation paths.

## Quick Disable

To disable Jules quickly, remove or disable the `JULES_API_KEY` Actions secret in `oaslananka-lab/kicad-studio`. To disable a specific workflow without editing code:

```bash
gh workflow disable jules-manual.yml --repo oaslananka-lab/kicad-studio
gh workflow disable jules-ci-fixer.yml --repo oaslananka-lab/kicad-studio
gh workflow disable jules-dependency-fixer.yml --repo oaslananka-lab/kicad-studio
gh workflow disable jules-issue-agent.yml --repo oaslananka-lab/kicad-studio
```

Do not disable or edit workflows in the personal showcase mirror as an operational workaround. The organization repository is the only CI/CD and automation authority.
