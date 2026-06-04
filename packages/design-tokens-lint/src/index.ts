import { parseArgs, styleText } from 'node:util';
import { lint } from './commands/lint.ts';
import { suggestReuse } from './commands/suggest-reuse.ts';

declare const __VERSION__: string;

// In tests we spawn an entirely new node process that doesn't have access
// to __VERSION__ so for those cases we have the catch block.
function getVersion(): string {
  try {
    return __VERSION__;
  } catch {
    return process.env['npm_package_version'] ?? '0.0.0';
  }
}

// Use `stderr.write()` to write 'noise' (debug/verbose)
// Use `stdout.write()` to write relevant data

function help(): string {
  return `
${styleText('bold', 'USAGE')}
  design-tokens-lint [options] <file> [files...]
  design-tokens-lint suggest-reuse [options] <file> [files...]

${styleText('bold', 'EXAMPLES')}
  design-tokens-lint tokens.json
  design-tokens-lint base.json theme.json
  design-tokens-lint --exclude-parent-keys figma/figma.tokens.json
  design-tokens-lint --out result.json tokens.json
  design-tokens-lint suggest-reuse tokens.json
  design-tokens-lint suggest-reuse --fix tokens.json
  design-tokens-lint suggest-reuse --out candidates.json tokens.json

${styleText('bold', 'SUBCOMMANDS')}
  suggest-reuse           Find (and optionally apply) reusable basis token candidates

${styleText('bold', 'OPTIONS')}
  --exclude-parent-keys   Exclude parent keys from validation
  --fix                   Apply reuse candidates (suggest-reuse only)
  --out, -o <file>        Write output to file
  --verbose               Print verbose output
  --debug                 Print debug output
  --help, -h              Show this help
  --version, -V           Print version
  `.trim();
}

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    debug: { default: false, type: 'boolean' },
    'exclude-parent-keys': { default: false, type: 'boolean' },
    fix: { default: false, type: 'boolean' },
    help: { default: false, short: 'h', type: 'boolean' },
    out: { short: 'o', type: 'string' },
    verbose: { default: false, type: 'boolean' },
    version: { default: false, short: 'V', type: 'boolean' },
  },
});

if (values['help']) {
  process.stdout.write(help() + '\n');
  process.exit(0);
}

if (values['version']) {
  process.stdout.write(getVersion() + '\n');
  process.exit(0);
}

const subcommand = positionals[0] === 'suggest-reuse' ? 'suggest-reuse' : 'lint';
const files = subcommand === 'suggest-reuse' ? positionals.slice(1) : positionals;

if (files.length === 0) {
  process.stderr.write('Error: no input files provided\nUsage: design-tokens-lint [options] <file> [files...]\n');
  process.exit(1);
}

const debug = values['debug'];
const verbose = values['verbose'];
const outPath = values['out'];
const excludeParentKeys = values['exclude-parent-keys'];

if (subcommand === 'suggest-reuse') {
  await suggestReuse(files, { debug, excludeParentKeys, fix: values['fix'], outPath, verbose });
} else {
  await lint(files, { debug, excludeParentKeys, outPath, verbose });
}
