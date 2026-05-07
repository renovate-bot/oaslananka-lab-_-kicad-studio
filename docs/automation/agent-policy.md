# Bot And Agent Automation Policy

This repository accepts automation that reduces maintainer toil without moving
release authority away from humans and GitHub environment protection.

## Authority Model

- Canonical repository: `oaslananka-lab/kicad-studio`
- Personal showcase mirror: `oaslananka/kicad-studio`
- CI/CD, release, Marketplace, Open VSX, VSIX, SBOM, attestation, Jules, and
  mirror authority live only in the canonical repository.
- The personal repository is advisory showcase state only.

Every org-only workflow must keep:

```yaml
if: github.repository == 'oaslananka-lab/kicad-studio'
```

## Agents May Auto-Fix

Agents may create or update branches and PRs for:

- formatting
- trivial lint failures
- package metadata drift
- changelog or release-note noise
- workflow artifact upload path mistakes
- docs link drift
- test fixture expectation updates when the failed assertion clearly proves the
  expected output changed

Agents must run relevant validation and report exact commands and results.

## Agents May Not Auto-Fix Without Human Review

Human review is required before changing:

- VS Marketplace token, publisher, or trusted-publisher configuration
- Open VSX token, namespace, or publish configuration
- GitHub environment protection
- workflow permission broadening
- branch protection or repository rulesets
- disabled checks
- removed tests
- package identity, name, or publisher
- `SECURITY.md` or security policy posture
- destructive mirror force behavior
- release or publish workflow behavior that enables production publishing
- credential or secrets documentation that implies a new secret value

## Hard Prohibitions

Agents must not:

- publish to VS Marketplace
- publish to Open VSX
- publish npm packages
- publish Docker images
- create production GitHub Releases
- approve PRs
- merge PRs
- print or store secrets
- run fork PR code with secrets
- use `pull_request_target` to check out untrusted code
- weaken Workspace Trust restrictions
- make AI or MCP features mandatory

## Review Feedback

The review-thread gate blocks actionable unresolved review threads. The
agent-review fix loop may address review feedback only on same-repository
branches from an allowlisted actor request or the `agent:fix-review` label.

Human review threads are never auto-resolved by the repository automation.
