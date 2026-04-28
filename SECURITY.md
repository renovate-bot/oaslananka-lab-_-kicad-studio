# Security Policy

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Send details to the maintainer privately via GitHub's **Report a vulnerability**
button in the repository Security tab.

Include: description, reproduction steps, potential impact, and any suggested fix.

We aim to respond within 5 business days and coordinate a fix release.

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 2.x     | Yes       |
| 1.x     | No        |

## Maintainer Security Checks

Before release, run:

```bash
task security
```

The local security task runs high-severity `npm audit`, `gitleaks detect --redact`, and the bundle-size gate. GitHub pull request, merge queue, and push security workflows are expected to fail closed on findings.
