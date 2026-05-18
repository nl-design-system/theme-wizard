import { readFile } from 'node:fs/promises';
import { parseArgs, styleText } from 'node:util';
import { validateTokens } from './validate.ts';

// 1. Use `console.error()` to write 'noise' (debug/verbose) to process.stderr
// 2. Use `console.log()` to write relevant data to process.stdout

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    debug: { default: false, type: 'boolean' },
    'exclude-parent-keys': { default: false, type: 'boolean' },
    verbose: { default: false, type: 'boolean' },
  },
});

if (positionals.length === 0) {
  console.error('Error: no input file provided\nUsage: design-tokens-lint [options] <file>');
  process.exit(1);
}
if (positionals.length > 1) {
  console.error('Error: only one input file is supported');
  process.exit(1);
}

const [filePath] = positionals;
const verbose = values['verbose'];
const debug = values['debug'];

if (verbose) {
  console.error(`Loading: ${filePath}`);
}

let tokens: unknown;
try {
  tokens = JSON.parse(await readFile(filePath, 'utf8'));
} catch {
  console.error(`Error: could not read or parse: ${filePath}`);
  process.exit(1);
}

if (debug) {
  console.error(`Parsed JSON:\n${JSON.stringify(tokens, null, 2)}`);
}
if (values['exclude-parent-keys'] && verbose) {
  console.error('Excluding parent keys');
}
if (verbose) {
  console.error('Validating tokens');
}

const result = validateTokens(tokens, { excludeParentKeys: values['exclude-parent-keys'] });

if (debug) {
  console.error(`Validation result:\n${JSON.stringify(result, null, 2)}`);
}

if (result.success) {
  console.log(styleText('green', '✓ Tokens are valid'));
  process.exit(0);
}

for (const issue of result.issues) {
  const prefix = issue.path.length ? issue.path.join('.') + ': ' : '';
  console.error(styleText('red', `✗ ${prefix}${issue.message}`));
}
process.exit(1);
