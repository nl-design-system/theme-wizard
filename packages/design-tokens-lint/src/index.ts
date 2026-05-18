import { mergeTokens } from '@nl-design-system-community/design-tokens-schema';
import { readFile, writeFile } from 'node:fs/promises';
import { parseArgs, styleText } from 'node:util';
import { validateTokens } from './validate.ts';

// Use `stderr.write()` to write 'noise' (debug/verbose)
// Use `stdout.write()` to write relevant data

function help(): string {
  return `
${styleText('bold', 'USAGE')}
  design-tokens-lint [options] <file> [files...]

${styleText('bold', 'EXAMPLES')}
  design-tokens-lint tokens.json
  design-tokens-lint base.json theme.json
  design-tokens-lint --exclude-parent-keys figma/figma.tokens.json
  design-tokens-lint --out result.json tokens.json

${styleText('bold', 'OPTIONS')}
  --exclude-parent-keys   Exclude parent keys from validation
  --out, -o <file>        Write output to file
  --verbose               Print verbose output
  --debug                 Print debug output
  --help, -h              Show this help
  `.trim();
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
  process.stderr.write('Error: no input files provided\nUsage: design-tokens-lint [options] <file> [files...]\n');
  process.exit(1);
}

const verbose = values['verbose'];
const debug = values['debug'];
const outPath = values['out'];

const tokenGroups: Record<string, unknown>[] = [];
for (const filePath of positionals) {
  if (verbose) {
    process.stderr.write(`Loading: ${filePath}\n`);
  }

  try {
    const text = await readFile(filePath, 'utf8');
    tokenGroups.push(JSON.parse(text));
  } catch {
    process.stderr.write(`Error: could not read or parse: ${filePath}\n`);
    process.exit(1);
  }
}

const tokens = mergeTokens(tokenGroups);

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
  process.stdout.write(styleText('green', '✓'));
  process.stdout.write(' No issues found\n');
  process.exit(0);
}

const issueWord = result.issues.length === 1 ? 'issue' : 'issues';
process.stderr.write(styleText('red', `✗`));
process.stderr.write(` ${result.issues.length} ${issueWord} found:\n`);

for (const issue of result.issues) {
  const prefix = issue.path.length ? issue.path.join('.') + ': ' : '';
  process.stderr.write(`• ${prefix}${issue.message}\n`);
}

process.exit(1);
