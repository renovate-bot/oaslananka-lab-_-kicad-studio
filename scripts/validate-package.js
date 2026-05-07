#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pkg = readJson('package.json');

const expected = {
  repository: 'https://github.com/oaslananka-lab/kicad-studio',
  bugs: 'https://github.com/oaslananka-lab/kicad-studio/issues',
  homepage: 'https://github.com/oaslananka-lab/kicad-studio',
  publisher: 'oaslananka'
};

assert(
  pkg.repository?.url === expected.repository,
  'repository.url must point to the org repository'
);
assert(pkg.bugs?.url === expected.bugs, 'bugs.url must point to org issues');
assert(
  pkg.homepage === expected.homepage,
  'homepage must point to the org repository'
);
assert(
  pkg.publisher === expected.publisher,
  'publisher must remain oaslananka'
);
assert(
  pkg.engines?.vscode === '^1.99.0',
  'VS Code engine drifted unexpectedly'
);
assert(pkg.engines?.node === '24.x', 'Node runtime drifted unexpectedly');
assert(
  pkg.main === './dist/extension.js',
  'extension entrypoint drifted unexpectedly'
);

const requiredRuntimeFiles = [
  'dist/extension.js',
  'package.json',
  'README.md',
  'LICENSE',
  'CHANGELOG.md',
  'assets/icon.png',
  'assets/icon-light.png',
  'assets/icon-dark.png',
  'language-configuration.json',
  'schemas/kicad-project.schema.json',
  'schemas/vscode-mcp.kicad.json',
  'syntaxes/kicad-schematic.tmLanguage.json',
  'syntaxes/kicad-pcb.tmLanguage.json',
  'media/kicanvas/kicanvas.js'
];

for (const file of requiredRuntimeFiles) {
  assert(
    fs.existsSync(path.join(root, file)),
    `required runtime file is missing: ${file}`
  );
}

const vscodeignore = fs.readFileSync(path.join(root, '.vscodeignore'), 'utf8');
for (const pattern of [
  '.github/**',
  'scripts/**',
  'src/**',
  'test/**',
  'coverage/**',
  'node_modules/**',
  '*.vsix'
]) {
  assert(
    vscodeignore.includes(pattern),
    `.vscodeignore must exclude ${pattern}`
  );
}
assert(
  !vscodeignore.includes('dist/**'),
  '.vscodeignore must not exclude dist/**'
);
assert(
  !vscodeignore.includes('media/**'),
  '.vscodeignore must not exclude runtime media assets'
);

const lock = readJson('package-lock.json');
assert(
  lock.version === pkg.version,
  'package-lock root version must match package.json'
);
assert(
  lock.packages?.['']?.version === pkg.version,
  'package-lock package root version must match package.json'
);

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
