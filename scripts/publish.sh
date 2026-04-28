#!/usr/bin/env bash
set -euo pipefail
npx vsce publish --pat "$VSCE_PAT"
npx ovsx publish --pat "$OVSX_PAT"
