const DOC_KEY_PATTERN = /_basis-(.+)-intro\.md$/;

const docModules = import.meta.glob(
  '../../node_modules/@nl-design-system-unstable/documentation/handboek/huisstijl-vastleggen/basis-tokens/_basis-*-intro.md',
  { eager: true, exhaustive: true, import: 'default', query: '?raw' },
);

/** Every basis-token intro doc, keyed by its full dash-joined path (e.g. `color-accent-1`, `space-block`, `border-radius`, `focus`). */
export const tokenDocs: Record<string, string> = Object.fromEntries(
  Object.entries(docModules).map(([path, content]) => {
    const key = DOC_KEY_PATTERN.exec(path)?.[1] ?? path;
    return [key, content as string];
  }),
);

/**
 * Scopes `tokenDocs` to one domain prefix and strips it, e.g. `getTokenDocs('color')` turns
 * `color-accent-1` into `accent-1`. Pass `''` (default) to get the full map unprefixed.
 */
export function getTokenDocs(prefix = ''): Record<string, string> {
  const withDash = prefix ? `${prefix}-` : '';
  return Object.fromEntries(
    Object.entries(tokenDocs)
      .filter(([key]) => key.startsWith(withDash))
      .map(([key, docs]) => [key.slice(withDash.length), docs]),
  );
}
