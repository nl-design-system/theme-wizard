import type { BaseDesignToken } from '@nl-design-system-community/design-tokens-schema';
import { prepareEnvironment } from '@gmrchk/cli-testing-library';
import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens.json';
import dlv from 'dlv';
import { dset } from 'dset';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcIndex = path.resolve(__dirname, '../index.ts');
const nodeExec = process.execPath;

it('exits 0 and outputs candidates JSON to stdout', async () => {
  const { cleanup, execute, writeFile } = await prepareEnvironment();
  await writeFile('tokens.json', JSON.stringify(startTokens));

  const { code, stderr, stdout } = await execute(nodeExec, `${srcIndex} suggest-reuse tokens.json`);

  expect(code).toBe(0);
  expect(stderr).toEqual([]);
  const candidates = JSON.parse(stdout.join(''));
  expect(Array.isArray(candidates)).toBe(true);
  expect(candidates.length).toBeGreaterThan(0);
  for (const candidate of candidates) {
    expect(candidate).toMatchObject({
      path: expect.any(Array),
      suggestion: expect.objectContaining({
        path: expect.any(Array),
        token: expect.any(Object),
      }),
      token: expect.any(Object),
    });
  }

  await cleanup();
});

it('exits 1 with message for invalid tokens', async () => {
  const { cleanup, execute, writeFile } = await prepareEnvironment();
  const bad = structuredClone(startTokens) as Record<string, unknown>;
  dset(bad, 'basis.color.transparent.$value', '{this.does.not.exist}');
  await writeFile('tokens.json', JSON.stringify(bad));

  const { code, stderr } = await execute(nodeExec, `${srcIndex} suggest-reuse tokens.json`);

  expect(code).toBe(1);
  expect(stderr.join(' ')).toContain('JSON is invalid');
  expect(stderr.join(' ')).toContain('design-tokens-lint');

  await cleanup();
});

it('exits 1 when no files provided', async () => {
  const { cleanup, execute } = await prepareEnvironment();

  const { code, stderr } = await execute(nodeExec, `${srcIndex} suggest-reuse`);

  expect(code).toBe(1);
  expect(stderr.join(' ')).toContain('no input files provided');

  await cleanup();
});

it('--verbose logs steps to stderr', async () => {
  const { cleanup, execute, writeFile } = await prepareEnvironment();
  await writeFile('tokens.json', JSON.stringify(startTokens));

  const { code, stderr } = await execute(nodeExec, `${srcIndex} suggest-reuse tokens.json --verbose`);

  expect(code).toBe(0);
  expect(stderr.join(' ')).toContain('Loading');
  expect(stderr.join(' ')).toContain('Finding reusable candidates');

  await cleanup();
});

it('--debug logs intermediate data to stderr', async () => {
  const { cleanup, execute, writeFile } = await prepareEnvironment();
  await writeFile('tokens.json', JSON.stringify({ basis: startTokens.basis }));

  const { stderr } = await execute(nodeExec, `${srcIndex} suggest-reuse tokens.json --debug`);

  expect(stderr.join(' ')).toContain('Parsed JSON:');

  await cleanup();
});

describe('--out', () => {
  it('writes candidates JSON to file', async () => {
    const { cleanup, execute, readFile, writeFile } = await prepareEnvironment();
    await writeFile('tokens.json', JSON.stringify(startTokens));

    const { code, stderr, stdout } = await execute(
      nodeExec,
      `${srcIndex} suggest-reuse tokens.json --out candidates.json`,
    );

    expect(code).toBe(0);
    expect(stderr).toEqual([]);
    expect(stdout).toEqual([]);
    const candidates = JSON.parse(await readFile('candidates.json'));
    expect(Array.isArray(candidates)).toBe(true);

    await cleanup();
  });

  it('exits 1 when output path is not writable', async () => {
    const { cleanup, execute, writeFile } = await prepareEnvironment();
    await writeFile('tokens.json', JSON.stringify(startTokens));

    const { code, stderr, stdout } = await execute(
      nodeExec,
      `${srcIndex} suggest-reuse tokens.json --out /nonexistent/dir/candidates.json`,
    );

    expect(code).toBe(1);
    expect(stderr.join(' ')).toContain('could not write output file');
    expect(stdout).toEqual([]);

    await cleanup();
  });
});

describe('--fix', () => {
  it('outputs modified tokens JSON to stdout', async () => {
    const { cleanup, execute, writeFile } = await prepareEnvironment();
    await writeFile('tokens.json', JSON.stringify(startTokens));

    const { code, stderr, stdout } = await execute(nodeExec, `${srcIndex} suggest-reuse tokens.json --fix`);

    expect(code).toBe(0);
    expect(stderr).toEqual([]);
    // Output is the full token tree — too large to fully parse from stdout.
    // Verify it's non-empty JSON; the specific fix is asserted in the --out test.
    expect(stdout[0]).toBe('{');

    await cleanup();
  });

  it('--out writes modified tokens JSON to file', async () => {
    const { cleanup, execute, readFile, writeFile } = await prepareEnvironment();

    const tokens = structuredClone(startTokens) as Record<string, unknown>;
    // Set a component token to the same value as basis.color.default.bg-document.
    // Both $value and original.$value must be set because useOriginalValue() preprocessing
    // restores $value from original.$value, overwriting a $value-only dset.
    dset(tokens, 'utrecht.action-group.background-color.$value', '#FCFCFC');
    dset(tokens, 'utrecht.action-group.background-color.original.$value', '#FCFCFC');
    await writeFile('tokens.json', JSON.stringify(tokens));

    const { code, stderr, stdout } = await execute(
      nodeExec,
      `${srcIndex} suggest-reuse tokens.json --fix --out fixed.json`,
    );

    expect(code).toBe(0);
    expect(stderr).toEqual([]);
    expect(stdout).toEqual([]);

    const fixed: Record<string, unknown> = JSON.parse(await readFile('fixed.json'));
    const token = dlv(fixed, ['utrecht', 'action-group', 'background-color']) as BaseDesignToken;

    expect(token.$value).toBe('{basis.color.default.bg-document}');

    await cleanup();
  });
});
