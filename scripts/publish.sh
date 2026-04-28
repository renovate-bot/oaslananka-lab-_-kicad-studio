#!/usr/bin/env bash
set -euo pipefail

echo "Publishing to VS Code Marketplace..."
if [ -n "${VSCE_PAT:-}" ]; then
  npx vsce publish --pat "$VSCE_PAT" --no-dependencies
else
  echo "VSCE_PAT not set; skipping Marketplace."
fi

echo "Publishing to Open VSX..."
if [ -n "${OVSX_PAT:-}" ]; then
  npx ovsx publish --pat "$OVSX_PAT"
else
  echo "OVSX_PAT not set; skipping Open VSX."
fi
