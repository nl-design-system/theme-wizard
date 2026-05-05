#!/usr/bin/env node
/**
 * dtcg-tools CLI
 *
 * USAGE
 *   dtcg-tools [options] <file> [files...]
 *
 * OPTIONS
 *   --merge                      Merge multiple token files (default when >1 file given)
 *   --upgrade                    Upgrade legacy tokens to DTCG spec
 *   --assign-subtypes            Annotate tokens with nl.nldesignsystem.token-subtype extension
 *   --reuse-basis                Replace hardcoded values with aliases to basis.* tokens
 *   --suggest-basis              List tokens that could be aliased to basis.* tokens (dry-run)
 *   --report-missing-tokens      List basis token slots absent from input (dry-run)
 *   --fill-basis-from <file>     Fill missing basis tokens from <file>
 *   -o, --out <file>             Write output to a file instead of stdout
 *   --compact                    Minified JSON output
 *   -h, --help                   Show this help
 *
 * EXAMPLES
 *   # Merge + upgrade in one go
 *   dtcg-tools --upgrade button.json link.json heading.json --out tokens.json
 *
 *   # Upgrade a single file
 *   dtcg-tools --upgrade tokens.json
 *
 *   # Full pipeline: merge, upgrade, replace hardcoded values with basis aliases
 *   dtcg-tools --upgrade --reuse-basis tokens.json --out out.json
 *
 *   # See which tokens could be aliased to basis (dry-run)
 *   dtcg-tools --upgrade --suggest-basis tokens.json
 *
 *   # See which basis token slots are missing
 *   dtcg-tools --report-missing-tokens tokens.json
 *
 *   # Fill missing basis tokens from another file
 *   dtcg-tools --fill-basis-from reference.json tokens.json --out out.json
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { TokenFile } from './index.ts';
import {
  findBasisTokenCandidates,
  findMissingBasisTokens,
  fillBasisTokensFrom,
  normalize,
} from './index.ts';

// ---------------------------------------------------------------------------
// Arg parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(0);
}

const inputFiles: string[] = [];
let outFile: string | null = null;
let doUpgrade = false;
let doAssignSubTypes = false;
let doReuseBasis = false;
let doSuggestBasis = false;
let doReportMissingTokens = false;
let fillBasisFromFile: string | null = null;
let compact = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  switch (arg) {
    case '--upgrade':
      doUpgrade = true;
      break;
    case '--assign-subtypes':
      doAssignSubTypes = true;
      break;
    case '--reuse-basis':
      doReuseBasis = true;
      break;
    case '--suggest-basis':
      doSuggestBasis = true;
      break;
    case '--report-missing-tokens':
      doReportMissingTokens = true;
      break;
    case '--fill-basis-from':
      fillBasisFromFile = args[++i];
      if (!fillBasisFromFile) fatal('--fill-basis-from requires a file argument');
      break;
    case '--out':
    case '-o':
      outFile = args[++i];
      if (!outFile) fatal('--out requires a file argument');
      break;
    case '--compact':
      compact = true;
      break;
    default:
      if (arg.startsWith('-')) fatal(`Unknown flag: ${arg}`);
      inputFiles.push(arg);
  }
}

if (inputFiles.length === 0) {
  fatal('No input files specified. Pass one or more JSON token files.');
}

// ---------------------------------------------------------------------------
// Read files
// ---------------------------------------------------------------------------

function readJSON(filePath: string): TokenFile {
  try {
    return JSON.parse(readFileSync(resolve(filePath), 'utf8')) as TokenFile;
  } catch (err) {
    fatal(`Could not read ${filePath}: ${(err as Error).message}`);
  }
}

const inputs = inputFiles.map(readJSON);

// ---------------------------------------------------------------------------
// Build pipeline
// ---------------------------------------------------------------------------

const result = normalize(inputs, {
  assignSubTypes: doAssignSubTypes,
  reuseBasis: doReuseBasis,
  upgrade: doUpgrade,
});

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

if (doSuggestBasis) {
  const candidates = findBasisTokenCandidates(result);
  const suggestions = candidates.map(({ path, suggestion }) => ({
    suggestion: `{${suggestion.path.join('.')}}`,
    token: path.join('.'),
  }));
  const json = compact ? JSON.stringify(suggestions) : JSON.stringify(suggestions, null, 2);
  if (outFile) {
    writeFileSync(resolve(outFile), json, 'utf8');
    log(`✓ ${candidates.length} suggestion(s) → ${outFile}`);
  } else {
    process.stdout.write(json + '\n');
  }
} else if (doReportMissingTokens) {
  const missing = findMissingBasisTokens(result);
  const report = missing.map(({ $type, path }) => ({ $type, path: path.join('.') }));
  const json = compact ? JSON.stringify(report) : JSON.stringify(report, null, 2);
  if (outFile) {
    writeFileSync(resolve(outFile), json, 'utf8');
    log(`✓ ${missing.length} missing basis token(s) → ${outFile}`);
  } else {
    process.stdout.write(json + '\n');
  }
} else {
  const final = fillBasisFromFile ? fillBasisTokensFrom(result, readJSON(fillBasisFromFile)) : result;
  const json = compact ? JSON.stringify(final) : JSON.stringify(final, null, 2);
  if (outFile) {
    writeFileSync(resolve(outFile), json, 'utf8');
    log(`✓ ${inputFiles.length} file(s) → ${outFile}`);
  } else {
    process.stdout.write(json + '\n');
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fatal(message: string): never {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function log(message: string): void {
  // Write status to stderr so it doesn't pollute stdout piping
  process.stderr.write(message + '\n');
}

function printHelp(): void {
  console.log(`
dtcg-tools – Merge, upgrade, and clean up DTCG design token files

USAGE
  dtcg-tools [options] <file> [files...]

OPTIONS
  --upgrade                  Upgrade legacy tokens to DTCG spec:
                               · value → \$value, type → \$type
                               · spacing/fontSize/… → dimension
                               · dimension strings → { value, unit } objects
                               · font-family strings → arrays
                               · comment/description → \$description
                               · strips SD metadata (filePath, isSource, …)
  --assign-subtypes          Annotate tokens with nl.nldesignsystem.token-subtype
                             based on the token's path (e.g. font-size, line-height)
  --reuse-basis              Replace hardcoded values with aliases to basis.* tokens
  --suggest-basis            List tokens that could be aliased to basis.* tokens
                             (dry-run; outputs JSON array to stdout)
  --report-missing-tokens    List basis token slots absent from input
                             (dry-run; outputs JSON array to stdout)
  --fill-basis-from <file>   Fill missing basis tokens from <file>
  -o, --out <file>           Write output to a file (default: stdout)
  --compact                  Output minified JSON
  -h, --help                 Show this help

EXAMPLES
  # Upgrade a single file, print to stdout
  dtcg-tools --upgrade tokens.json

  # Merge multiple files and upgrade
  dtcg-tools --upgrade button.json link.json heading.json --out out.json

  # Full pipeline: merge → upgrade → replace hardcoded values with basis aliases
  dtcg-tools --upgrade --reuse-basis button.json link.json --out out.json

  # Merge only, no upgrade
  dtcg-tools button.json link.json --out merged.json

  # See which tokens could be aliased to basis (dry-run)
  dtcg-tools --upgrade --suggest-basis tokens.json

  # See which basis token slots are missing
  dtcg-tools --report-missing-tokens tokens.json

  # Fill missing basis tokens from another file
  dtcg-tools --fill-basis-from reference.json tokens.json --out out.json

  # Pipe into another tool
  dtcg-tools --upgrade tokens.json | jq '.color'
`);
}
