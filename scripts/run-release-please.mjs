#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { setTimeout } from 'node:timers';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_FILE = 'release-please-config.json';
const MANIFEST_FILE = '.release-please-manifest.json';
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  const repo = requiredEnv('GITHUB_REPOSITORY');
  const token = requiredEnv('GITHUB_TOKEN');
  const targetBranch = process.env.GITHUB_REF_NAME || 'main';
  const version = readManifestVersion();
  const versionParts = parseVersionParts(version);
  const tagName = `v${version}`;
  const before = await githubJson(
    `/repos/${repo}/releases/tags/${tagName}`,
    token
  );
  assertReleaseLookup('Initial', before);

  runReleasePlease([
    'github-release',
    '--token',
    token,
    '--repo-url',
    repo,
    '--target-branch',
    targetBranch,
    '--config-file',
    CONFIG_FILE,
    '--manifest-file',
    MANIFEST_FILE,
    '--draft'
  ]);

  const after = await githubJson(
    `/repos/${repo}/releases/tags/${tagName}`,
    token
  );
  assertReleaseLookup('Post-release', after);
  const releaseCreated = before.status === 404 && after.ok;

  if (!releaseCreated) {
    runReleasePlease([
      'release-pr',
      '--token',
      token,
      '--repo-url',
      repo,
      '--target-branch',
      targetBranch,
      '--config-file',
      CONFIG_FILE,
      '--manifest-file',
      MANIFEST_FILE,
      '--pull-request-header',
      'Release changes are prepared from the conventional commit history.',
      '--pull-request-footer',
      ''
    ]);
  }

  setOutput('release_created', releaseCreated ? 'true' : 'false');
  setOutput('version', version);
  setOutput('tag_name', tagName);
  setOutput('major', versionParts.major);
  setOutput('minor', versionParts.minor);
  setOutput('patch', versionParts.patch);

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `## Release Automation\n\n- release_created: ${releaseCreated}\n- version: ${version}\n- tag: ${tagName}\n`
    );
  }
}

function runReleasePlease(args) {
  const pnpmArgs = ['exec', 'release-please', ...args];
  const invocation =
    process.platform === 'win32'
      ? {
          command: process.env.ComSpec ?? 'cmd.exe',
          args: ['/d', '/s', '/c', 'pnpm', ...pnpmArgs]
        }
      : { command: 'pnpm', args: pnpmArgs };
  const result = spawnSync(invocation.command, invocation.args, {
    cwd: ROOT,
    env: process.env,
    stdio: 'inherit'
  });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function githubJson(pathname, token) {
  let result = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(`https://api.github.com${pathname}`, {
      headers: {
        authorization: `Bearer ${token}`,
        accept: 'application/vnd.github+json',
        'x-github-api-version': '2022-11-28',
        'user-agent': 'kicad-studio-release'
      }
    });
    result = {
      ok: response.ok,
      status: response.status,
      data: await readResponseBody(response)
    };

    if (!RETRYABLE_STATUSES.has(result.status) || attempt === 3) {
      return result;
    }
    await delay(attempt * 1000);
  }
  return result;
}

async function readResponseBody(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('json')) {
    return { message: text.slice(0, 500) };
  }
  try {
    return JSON.parse(text);
  } catch {
    return { message: text.slice(0, 500) };
  }
}

function assertReleaseLookup(label, result) {
  if (result.ok || result.status === 404) {
    return;
  }
  throw new Error(
    `${label} release lookup failed with ${result.status}: ${apiMessage(result)}`
  );
}

function apiMessage(result) {
  if (
    result.data &&
    typeof result.data === 'object' &&
    typeof result.data.message === 'string'
  ) {
    return result.data.message;
  }
  return 'GitHub API returned an unexpected response.';
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function setOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
  }
  console.log(`${name}=${value}`);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
}

function readManifestVersion() {
  const manifest = readJson(MANIFEST_FILE);
  const version = manifest['.'];
  if (typeof version !== 'string') {
    throw new Error(`${MANIFEST_FILE} must define a string version for ".".`);
  }
  parseVersionParts(version);
  return version;
}

function parseVersionParts(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:[-+][0-9A-Za-z.-]+)?$/);
  if (!match) {
    throw new Error(`${MANIFEST_FILE} contains an invalid SemVer: ${version}`);
  }
  return { major: match[1], minor: match[2], patch: match[3] };
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}
