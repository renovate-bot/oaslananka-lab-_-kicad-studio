# Personal Showcase Mirror

`mirror-personal.yml` mirrors canonical refs from:

```text
oaslananka-lab/kicad-studio -> oaslananka/kicad-studio
```

The personal repository is a showcase mirror only. It is not a release,
publishing, CI, issue, or workflow-state authority.

## Automatic Mode

Automatic runs are triggered by:

- pushes to canonical `main`
- pushes of canonical `v*.*.*` tags

Automatic mode:

- pushes `main` only when the personal branch is missing, equal, or an ancestor
  of canonical `main`
- pushes missing `v*.*.*` tags
- refuses to overwrite divergent personal tags
- refuses to overwrite divergent personal `main`
- never deletes extra personal tags
- never mirrors PR branches, release-please branches, issues, releases, or
  workflow state

Mirror failure is advisory for release authority. It should be fixed, but it
must not cause Marketplace or Open VSX publishing to depend on the personal
repository.

## Manual Diagnostics

Manual dispatch has no inputs. It re-runs the same safe mirror plan against the
current default branch ref and refuses divergent refs.

```bash
gh workflow run mirror-personal.yml --repo oaslananka-lab/kicad-studio
```

## Divergent Ref Policy

If a personal ref diverges, automatic and manual runs fail with a clear error.
Do not delete or overwrite the personal ref from automation. Review the
canonical and personal refs before any separate recovery.

## Required Secret

- `PERSONAL_REPO_PUSH_TOKEN`

The token should be scoped only to pushing refs to the personal showcase
repository.
