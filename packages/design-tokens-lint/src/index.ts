#!/usr/bin/env node
import { type Theme, StrictThemeSchema } from '@nl-design-system-community/design-tokens-schema';
import { merge } from 'es-toolkit/compat';
import { readFile, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    debug: {
      type: 'boolean',
    },
    'exclude-parent-keys': {
      type: 'boolean',
    },
    /* Merge multiple JSON files into one */
    multiple: {
      type: 'boolean',
    },
    strict: {
      type: 'boolean',
    },
    verbose: {
      type: 'boolean',
    },
  },
});

let jsons: object[] = await Promise.all(
  positionals.map(async (path) => {
    console.log(`Loading: ${path}`);
    return JSON.parse(await readFile(path, 'utf8'));
  }),
);

const verbose = values['verbose'];
const debug = values['debug'];

const excludeParentKeys = values['exclude-parent-keys'];

if (values['multiple']) {
  jsons = [merge({}, ...jsons)];
}

jsons.forEach(async (json) => {
  let tokens = json;
  if (verbose) {
    console.log('Checking JSON');
  }

  if (excludeParentKeys) {
    tokens = merge(
      {},
      ...Object.entries(json as object)
        .filter(([key]) => !key.startsWith('$'))
        .map(([, value]) => value),
    );

    await writeFile('./tmp.json', JSON.stringify(tokens, null, 2));
  }

  const strictConfig = StrictThemeSchema.safeParse(tokens) satisfies Theme;

  if (debug) {
    console.log(strictConfig);
  }

  if (!strictConfig.success) {
    const error = JSON.parse(strictConfig.error.message);
    if (Array.isArray(error)) {
      error.forEach((e) => {
        process.stderr.write(e.message);
        process.stderr.write('\n');
      });
    }
    process.exit(1);
  }
});

process.stderr.write('Everything is valid!\n');
