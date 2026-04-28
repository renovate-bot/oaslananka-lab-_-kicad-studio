#!/usr/bin/env bash
set -euo pipefail

git remote get-url origin >/dev/null 2>&1 || git remote add origin "git@github.com:oaslananka/kicad-studio.git"
git remote get-url org >/dev/null 2>&1 || git remote add org "git@github.com:oaslananka-lab/kicad-studio.git"

git push origin --all
git push origin --tags
git push org --all
git push org --tags
