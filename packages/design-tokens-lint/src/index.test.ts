import { prepareEnvironment } from '@gmrchk/cli-testing-library';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import pkg from '../package.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcIndex = path.resolve(__dirname, 'index.ts');
const nodeExec = process.execPath;

describe('--version', () => {
  it.each(['--version', '-V'])('%s exits 0 and prints version to stdout', async (flag) => {
    const { cleanup, execute } = await prepareEnvironment();

    const { code, stderr, stdout } = await execute(nodeExec, `${srcIndex} ${flag}`);

    expect(code).toBe(0);
    expect(stderr).toEqual([]);
    expect(stdout.join('')).toContain(pkg.version);

    await cleanup();
  });
});

describe('--help', () => {
  it.each(['--help', '-h'])('%s exits 0 and prints help to stdout', async (flag) => {
    const { cleanup, execute } = await prepareEnvironment();

    const { code, stderr, stdout } = await execute(nodeExec, `${srcIndex} ${flag}`);

    expect(code).toBe(0);
    expect(stderr).toEqual([]);
    expect(stdout.join('\n')).toContain('design-tokens-lint');
    expect(stdout.join('\n')).toContain('suggest-reuse');

    await cleanup();
  });
});
