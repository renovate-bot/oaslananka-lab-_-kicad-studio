#!/usr/bin/env bash
set -euo pipefail

REPO_NAME="kicad-studio"
PERSONAL_OWNER="oaslananka"
ORG_OWNER="oaslananka-lab"

if ! git remote | grep -q "^lab$"; then
  git remote add lab "https://github.com/${ORG_OWNER}/${REPO_NAME}.git"
fi

if ! git remote | grep -q "^personal$"; then
  git remote add personal "https://github.com/${PERSONAL_OWNER}/${REPO_NAME}.git"
fi

echo "Fetching canonical org and personal showcase remotes..."
git fetch lab --prune
git fetch personal --prune || true

echo "Canonical push target: lab (${ORG_OWNER}/${REPO_NAME})"
echo "Personal showcase mirroring is handled by .github/workflows/mirror-personal.yml after org changes land."
