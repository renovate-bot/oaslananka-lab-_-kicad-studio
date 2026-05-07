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

## Manual Dry Run

Manual dispatch defaults to dry-run:

```bash
gh workflow run mirror-personal.yml \
  --repo oaslananka-lab/kicad-studio \
  -f dry_run=true \
  -f force_mirror=false \
  -f ref_scope=main-and-tags
```

The workflow prints the exact ref plan without changing personal refs.

## Divergent Tag Policy

If a personal tag diverges, automatic mode fails with:

```text
Personal showcase tag <tag> diverges from canonical. Run mirror-personal.yml with force_mirror=true, ref_scope=tags, tag_name=<tag>, approval=MIRROR_CANONICAL_TO_PERSONAL.
```

Do not delete or overwrite the tag automatically. Review the canonical tag
object first.

## Manual Force Mode

Force mode requires all of these:

- `workflow_dispatch`
- `force_mirror=true`
- `approval=MIRROR_CANONICAL_TO_PERSONAL`
- explicit `ref_scope`
- optional `tag_name` when forcing a single tag

The workflow uses `--force-with-lease` and prints the exact ref plan. The
`PERSONAL_REPO_PUSH_TOKEN` value must never be printed or stored in the
repository.

## Required Secret

- `PERSONAL_REPO_PUSH_TOKEN`

The token should be scoped only to pushing refs to the personal showcase
repository.
