#!/usr/bin/env node

console.error(
  'Direct publish commands are disabled for KiCad Studio. Use the guarded Release workflow with publish=true, approval=APPROVE_RELEASE, and release environment approval.'
);
console.error(
  'This prevents accidental VS Marketplace, Open VSX, npm, Docker, or production GitHub Release publishing from local scripts.'
);
process.exit(1);
