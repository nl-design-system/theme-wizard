import { findReusableTokens, applyReusableTokens } from '@nl-design-system-community/design-tokens-schema';
import { loadAndValidate, writeOutput, type LoadOptions } from '../shared.ts';

export type SuggestReuseOptions = LoadOptions & {
  fix: boolean;
  outPath: string | undefined;
};

export async function suggestReuse(files: string[], opts: SuggestReuseOptions): Promise<void> {
  const result = await loadAndValidate(files, opts);

  if (!result.success) {
    process.stderr.write(
      `Error: JSON is invalid. Make sure \`design-tokens-lint ${files.join(' ')}\` passes before running this command.\n`,
    );
    process.exit(1);
  }

  if (opts.verbose) {
    process.stderr.write('Finding reusable candidates\n');
  }

  const candidates = findReusableTokens(result.data);

  if (opts.debug) {
    process.stderr.write(`Reusable candidates:\n${JSON.stringify(candidates, null, 2)}\n`);
  }

  if (opts.fix) {
    if (opts.verbose) {
      process.stderr.write('Applying reusable candidates\n');
    }
    await writeOutput(applyReusableTokens(result.data, candidates), opts.outPath, opts.verbose);
  } else {
    await writeOutput(candidates, opts.outPath, opts.verbose);
  }

  process.exit(0);
}
