#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8')
);
const vsixName = `${pkg.name}-${pkg.version}.vsix`;
const vsixPath = path.join(root, vsixName);

if (!fs.existsSync(vsixPath)) {
  throw new Error(`Missing VSIX artifact: ${vsixName}`);
}

const digest = crypto
  .createHash('sha256')
  .update(fs.readFileSync(vsixPath))
  .digest('hex');
fs.writeFileSync(
  path.join(root, 'SHA256SUMS.txt'),
  `${digest}  ${vsixName}\n`,
  'utf8'
);

const sbom = spawnSync(
  process.execPath,
  [
    bin('cyclonedx-npm'),
    '--output-file',
    'sbom.cdx.json',
    '--output-format',
    'JSON',
    '--spec-version',
    '1.6',
    '--package-lock-only'
  ],
  {
    cwd: root,
    stdio: 'inherit',
    shell: false
  }
);

if (sbom.status !== 0) {
  process.exit(sbom.status ?? 1);
}

function bin(name) {
  if (name === 'cyclonedx-npm') {
    return path.join(
      root,
      'node_modules',
      '@cyclonedx',
      'cyclonedx-npm',
      'bin',
      'cyclonedx-npm-cli.js'
    );
  }
  throw new Error(`Unknown release asset helper: ${name}`);
}
