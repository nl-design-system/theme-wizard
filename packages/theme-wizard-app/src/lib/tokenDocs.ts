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
