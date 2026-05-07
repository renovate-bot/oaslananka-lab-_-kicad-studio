# Agent Review Fix Loop

`agent-review-fix-loop.yml` is a guarded review-remediation workflow. It can
invoke Jules to fix actionable review feedback on same-repository pull request
branches, but it cannot publish, merge, approve, or change secrets.

## Triggers

- Manual dispatch with a PR number.
- `/agent-review-fix` on a pull request issue comment.
- `/agent-review-fix` on a pull request review or review comment.
- Applying the `agent:fix-review` label.

The actor must be allowlisted. The current allowlist is:

- `oaslananka`

Fork pull requests are not eligible because the workflow must not expose
`JULES_API_KEY` or other trusted automation to fork-origin code.

## Loop Limits

The workflow writes comments with the marker:

```text
[agent-review-fix-loop]
```

It refuses to run after the configured maximum iteration count, capped at three
iterations per PR. This prevents automation loops when a bot or reviewer keeps
adding new feedback.

## Jules Prompt Contract

Jules is instructed to:

- inspect unresolved, not-outdated review threads
- prefer human review feedback over bot feedback
- group actionable feedback by path
- parse GitHub suggestion blocks
- apply the smallest verified fix
- run cheap gates and targeted tests
- commit and push only when validation passes
- leave a PR comment with threads inspected, fixes applied, ignored outdated
  threads, tests run, remaining threads, and publish status

## Hard Stops

The workflow and prompt prohibit:

- VS Marketplace publish
- Open VSX publish
- npm publish
- Docker publish
- production GitHub Releases
- merge or approval
- secret printing or modification
- CI, test, security, Workspace Trust, AI opt-in, or MCP opt-in weakening
- permission broadening
- unreviewed changes to release, Marketplace, Open VSX, or mirror-force
  behavior

## Dry Run

Manual dispatch defaults to dry-run mode. Dry run inspects review threads and
comments with the actionable count without invoking Jules.
