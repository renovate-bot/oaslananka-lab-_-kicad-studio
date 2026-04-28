# Branch Protection

Branch protection is managed via GitHub rulesets.

To apply the ruleset manually, run the following commands:

```bash
gh api -X POST /repos/oaslananka/kicad-studio/rulesets --input .github/rulesets/main.json
gh api -X POST /repos/oaslananka-lab/kicad-studio/rulesets --input .github/rulesets/main.json
```

For required status checks, edit `.github/rulesets/main.json` to include the names of the checks you want to enforce.
