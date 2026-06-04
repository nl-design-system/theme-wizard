import { styleText } from 'node:util';
import { loadAndValidate, writeJsonToFile, type LoadOptions } from '../shared.ts';

export type LintOptions = LoadOptions & {
  outPath: string | undefined;
};

export async function lint(files: string[], opts: LintOptions): Promise<void> {
  const result = await loadAndValidate(files, opts);

  if (opts.outPath) {
    await writeJsonToFile(opts.outPath, result, opts.verbose);
  }

  if (result.success) {
    process.stdout.write(styleText('green', '✓'));
    process.stdout.write(' No issues found\n');
    process.exit(0);
  }

  const issueWord = result.issues.length === 1 ? 'issue' : 'issues';
  process.stderr.write(styleText('red', '✗'));
  process.stderr.write(` ${result.issues.length} ${issueWord} found:\n`);

  for (const issue of result.issues) {
    const prefix = issue.path.length ? issue.path.join('.') + ': ' : '';
    process.stderr.write(`• ${prefix}${issue.message}\n`);
  }

  process.exit(1);
}
