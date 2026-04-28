#!/usr/bin/env bash
set -euo pipefail

REPO_NAME="kicad-studio"
OWNER="oaslananka"
ORG="oaslananka-lab"

# Ensure personal remote
if ! git remote | grep -q "^personal$"; then
  git remote add personal "https://github.com/${OWNER}/${REPO_NAME}.git"
fi

# Ensure org remote
if ! git remote | grep -q "^org$"; then
  git remote add org "https://github.com/${ORG}/${REPO_NAME}.git"
fi

echo "Fetching all..."
git fetch --all

echo "Pushing to personal..."
git push personal --all --tags

echo "Pushing to org..."
git push org --all --tags

echo "Sync complete."
