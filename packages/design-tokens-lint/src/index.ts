import { readFile, writeFile } from 'node:fs/promises';
import { parseArgs, styleText } from 'node:util';
import { validateTokens } from './validate.ts';

// Use `stderr.write()` to write 'noise' (debug/verbose)
// Use `stdout.write()` to write relevant data

function help(): string {
  return `
${styleText('bold', 'USAGE')}
  design-tokens-lint [options] <file>

${styleText('bold', 'OPTIONS')}
  --exclude-parent-keys   Exclude parent keys from validation
  --out, -o <file>        Write output to file
  --verbose               Print verbose output
  --debug                 Print debug output
  --help, -h              Show this help
  `.trim()
}

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    debug: { default: false, type: 'boolean' },
    'exclude-parent-keys': { default: false, type: 'boolean' },
    help: { default: false, short: 'h', type: 'boolean' },
    out: { short: 'o', type: 'string' },
    verbose: { default: false, type: 'boolean' },
  },
});

if (values['help']) {
  process.stdout.write(help() + '\n');
  process.exit(0);
}

if (positionals.length === 0) {
  process.stderr.write('Error: no input file provided\nUsage: design-tokens-lint [options] <file>\n');
  process.exit(1);
}
if (positionals.length > 1) {
  process.stderr.write('Error: only one input file is supported\n');
  process.exit(1);
}

const [filePath] = positionals;
const verbose = values['verbose'];
const debug = values['debug'];
const outPath = values['out'];

if (verbose) {
  process.stderr.write(`Loading: ${filePath}\n`);
}

let tokens: unknown;
try {
  tokens = JSON.parse(await readFile(filePath, 'utf8'));
} catch {
  process.stderr.write(`Error: could not read or parse: ${filePath}\n`);
  process.exit(1);
}

if (debug) {
  process.stderr.write(`Parsed JSON:\n${JSON.stringify(tokens, null, 2)}\n`);
}
if (values['exclude-parent-keys'] && verbose) {
  process.stderr.write('Excluding parent keys\n');
}
if (verbose) {
  process.stderr.write('Validating tokens\n');
}

const result = validateTokens(tokens, { excludeParentKeys: values['exclude-parent-keys'] });

if (debug) {
  process.stderr.write(`Validation result:\n${JSON.stringify(result, null, 2)}`);
}

if (outPath) {
  if (verbose) {
    process.stderr.write(`Writing output: ${outPath}\n`);
  }
  try {
    await writeFile(outPath, JSON.stringify(result, null, 2), 'utf8');
  } catch {
    process.stderr.write(`Error: could not write output file: ${outPath}\n`);
    process.exit(1);
  }
}

if (result.success) {
  process.stdout.write(styleText('green', '✓ Tokens are valid\n'));
  process.exit(0);
}

for (const issue of result.issues) {
  const prefix = issue.path.length ? issue.path.join('.') + ': ' : '';
  process.stderr.write(styleText('red', `✗ ${prefix}${issue.message}\n`));
}
process.exit(1);
