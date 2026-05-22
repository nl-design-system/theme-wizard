import { prepareEnvironment } from '@gmrchk/cli-testing-library';
import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens.json';
import { renderStringToFrames } from 'ansivision';
import { dset } from 'dset';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcIndex = path.resolve(__dirname, 'index.ts');
const nodeExec = process.execPath;

it('exits 0 and prints success for valid tokens', async () => {
  const { cleanup, execute, writeFile } = await prepareEnvironment();
  await writeFile('tokens.json', JSON.stringify(startTokens));

  const { code, stderr, stdout } = await execute(nodeExec, `${srcIndex} tokens.json`);

  expect(code).toBe(0);
  expect(stderr).toEqual([]);
  const frames = await renderStringToFrames(stdout.join(' '));
  expect(frames).toMatchSnapshot();

  await cleanup();
});

it('exits 1 and prints issues for invalid tokens', async () => {
  const { cleanup, execute, writeFile } = await prepareEnvironment();

  // Create a bad tokens file
  const bad = structuredClone(startTokens) as Record<string, unknown>;
  dset(bad, 'basis.color.transparent.$value', '{this.does.not.exist}');
  await writeFile('tokens.json', JSON.stringify(bad));

  const { code, stderr, stdout } = await execute(nodeExec, `${srcIndex} tokens.json`);

  expect(code).toBe(1);
  expect(stderr.length).toBeGreaterThan(0);
  const frames = await renderStringToFrames(stderr.join('\n'));
  expect(frames).toMatchSnapshot();
  expect(stdout).toEqual([]);

  await cleanup();
});

it('exits 1 with usage message when no file is given', async () => {
  const { cleanup, execute } = await prepareEnvironment();

  const { code, stderr } = await execute(nodeExec, srcIndex);

  expect(code).toBe(1);
  expect(stderr.join(' ')).toContain('no input files provided');

  await cleanup();
});

it('merges multiple files and exits 0 when all are valid', async () => {
  const { cleanup, execute, writeFile } = await prepareEnvironment();
  const half = Object.fromEntries(Object.entries(startTokens).slice(0, 1));
  const other = Object.fromEntries(Object.entries(startTokens).slice(1));
  await writeFile('a.json', JSON.stringify(half));
  await writeFile('b.json', JSON.stringify(other));

  const { code, stderr } = await execute(nodeExec, `${srcIndex} a.json b.json`);

  expect(code).toBe(0);
  expect(stderr).toEqual([]);

  await cleanup();
});

it('--verbose writes step messages to stderr', async () => {
  const { cleanup, execute, writeFile } = await prepareEnvironment();
  await writeFile('tokens.json', JSON.stringify(startTokens));

  const { code, stderr } = await execute(nodeExec, `${srcIndex} --verbose tokens.json`);

  expect(code).toBe(0);
  expect(stderr.join(' ')).toContain('Loading:');
  expect(stderr.join(' ')).toContain('Validating tokens');

  await cleanup();
});

it('--debug writes intermediate JSON to stderr', async () => {
  const { cleanup, execute, writeFile } = await prepareEnvironment();
  await writeFile('tokens.json', JSON.stringify({ basis: startTokens.basis }));

  const { stderr } = await execute(nodeExec, `${srcIndex} --debug tokens.json`);

  expect(stderr.join(' ')).toContain('Parsed JSON:');

  await cleanup();
});

it('--exclude-parent-keys validates tokens wrapped in a layer', async () => {
  const { cleanup, execute, writeFile } = await prepareEnvironment();
  const layered = { 'my-layer': startTokens };
  await writeFile('tokens.json', JSON.stringify(layered));

  const { code } = await execute(nodeExec, `${srcIndex} --exclude-parent-keys tokens.json`);

  expect(code).toBe(0);

  await cleanup();
});

describe('--help', () => {
  it.each(['--help', '-h'])('%s exits 0 and prints help to stdout', async (flag) => {
    const { cleanup, execute } = await prepareEnvironment();

    const { code, stderr, stdout } = await execute(nodeExec, `${srcIndex} ${flag}`);

    expect(code).toBe(0);
    expect(stderr).toEqual([]);
    const frames = await renderStringToFrames(stdout.join('\n'));
    expect(frames).toMatchSnapshot();

    await cleanup();
  });
});

describe('--out', () => {
  it.each(['-o', '--out'])('%s writes result JSON to file on success', async (flag) => {
    const { cleanup, execute, readFile, writeFile } = await prepareEnvironment();
    await writeFile('tokens.json', JSON.stringify(startTokens));

    const { code, stderr, stdout } = await execute(nodeExec, `${srcIndex} ${flag} result.json tokens.json`);

    expect(code).toBe(0);
    expect(stderr).toEqual([]);
    const frames = await renderStringToFrames(stdout.join(' '));
    expect(frames).toMatchSnapshot();
    const written = JSON.parse(await readFile('result.json'));
    expect(written.success).toBe(true);

    await cleanup();
  });

  it('--out writes result JSON with issues on failure', async () => {
    const { cleanup, execute, readFile, writeFile } = await prepareEnvironment();
    const bad = structuredClone(startTokens) as Record<string, unknown>;
    dset(bad, 'basis.color.transparent.$value', '{this.does.not.exist}');
    await writeFile('tokens.json', JSON.stringify(bad));

    const { code, stderr, stdout } = await execute(nodeExec, `${srcIndex} --out result.json tokens.json`);

    expect(code).toBe(1);
    expect(stderr.length).toBeGreaterThan(0);
    expect(stdout).toEqual([]);
    const written = JSON.parse(await readFile('result.json'));
    expect(written.success).toBe(false);
    expect(written.issues.length).toBeGreaterThan(0);

    await cleanup();
  });

  it('--out exits 1 when output path is not writable', async () => {
    const { cleanup, execute, writeFile } = await prepareEnvironment();
    await writeFile('tokens.json', JSON.stringify(startTokens));

    const { code, stderr, stdout } = await execute(
      nodeExec,
      `${srcIndex} --out /nonexistent/dir/result.json tokens.json`,
    );

    expect(code).toBe(1);
    expect(stderr.join(' ')).toContain('could not write output file');
    expect(stdout).toEqual([]);

    await cleanup();
  });
});
