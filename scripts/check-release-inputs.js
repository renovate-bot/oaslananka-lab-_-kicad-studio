#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8')
);
const inputVersion =
  process.env.RELEASE_VERSION || process.env.GITHUB_REF_NAME || '';
const normalized = inputVersion.replace(/^v/, '');

if (
  !/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(
    inputVersion
  )
) {
  throw new Error(
    `Release version must be a v-prefixed semver tag or input, got: ${inputVersion}`
  );
}

if (normalized !== pkg.version) {
  throw new Error(
    `Release version ${normalized} does not match package.json version ${pkg.version}`
  );
}

if (process.env.GITHUB_REF_TYPE === 'tag') {
  const expectedTag = `v${pkg.version}`;
  if (process.env.GITHUB_REF_NAME !== expectedTag) {
    throw new Error(
      `Git tag ${process.env.GITHUB_REF_NAME} does not match package.json version ${expectedTag}`
    );
  }
}
