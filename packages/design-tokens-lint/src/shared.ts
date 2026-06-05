import { mergeTokens, walkTokens, SKIP } from '@nl-design-system-community/design-tokens-schema';
import { readFile, writeFile } from 'node:fs/promises';
import { validateTokens, type ValidateResult } from './validate.ts';

export type LoadOptions = {
  debug: boolean;
  excludeParentKeys: boolean;
  verbose: boolean;
};

export async function loadAndValidate(files: string[], opts: LoadOptions): Promise<ValidateResult> {
  const tokenGroups: Record<string, unknown>[] = [];
  for (const filePath of files) {
    if (opts.verbose) {
      process.stderr.write(`Loading ${filePath}\n`);
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

  if (opts.debug) {
    process.stderr.write(`Parsed JSON:\n${JSON.stringify(tokens, null, 2)}\n`);
  }

  if (opts.excludeParentKeys && opts.verbose) {
    process.stderr.write('Excluding parent keys\n');
  }

  if (opts.verbose) {
    let numTokens = 0;
    walkTokens(tokens, () => {
      numTokens += 1;
      // do not recurse into nested tokens inside $extensions
      return SKIP;
    });
    process.stderr.write(`Found ${numTokens} tokens\n`);
    process.stderr.write('Validating tokens\n');
  }

  const result = validateTokens(tokens, { excludeParentKeys: opts.excludeParentKeys });

  if (opts.debug) {
    process.stderr.write(`Validation result:\n${JSON.stringify(result, null, 2)}\n`);
  }

  return result;
}

export async function writeJsonToFile(path: string, data: unknown, verbose: boolean): Promise<void> {
  if (verbose) {
    process.stderr.write(`Writing output: ${path}\n`);
  }
  try {
    await writeFile(path, JSON.stringify(data, null, 2), 'utf8');
  } catch {
    process.stderr.write(`Error: could not write output file: ${path}\n`);
    process.exit(1);
  }
}

export async function writeOutput(data: unknown, outPath: string | undefined, verbose: boolean): Promise<void> {
  if (outPath) {
    await writeJsonToFile(outPath, data, verbose);
  } else {
    process.stdout.write(JSON.stringify(data, null, 2) + '\n');
  }
}
