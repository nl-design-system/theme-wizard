import { extractRef, isRef } from '@nl-design-system-community/design-tokens-schema';

type TokenPreset = {
  // Filename without extension, e.g. `accent-1-inverse`
  name: string;
  tokens: Record<string, unknown>;
};

export type TokenPresetFolder = {
  // Folder name, e.g. `ams.page-header`; stories opt in with `parameters.presets`
  folder: string;
  presets: TokenPreset[];
};

const PRESET_FILE_PATTERN = /\/presets\/([^/]+)\/([^/]+)\.json$/;

const presetModules = import.meta.glob<Record<string, unknown>>('../../presets/*/*.json', {
  eager: true,
  import: 'default',
});

export const TOKEN_PRESET_FOLDERS: TokenPresetFolder[] = Object.entries(presetModules)
  .reduce<TokenPresetFolder[]>((folders, [filePath, tokens]) => {
    const [, folder, name] = PRESET_FILE_PATTERN.exec(filePath) ?? [];
    if (!folder || !name) {
      return folders;
    }
    let presetFolder = folders.find((candidate) => candidate.folder === folder);
    if (!presetFolder) {
      presetFolder = { folder, presets: [] };
      folders.push(presetFolder);
    }
    presetFolder.presets.push({ name, tokens });
    return folders;
  }, [])
  .map(({ folder, presets }) => ({ folder, presets: presets.toSorted((a, b) => a.name.localeCompare(b.name)) }));

const isAtOrUnder = (candidate: string, path: string) => candidate === path || candidate.startsWith(`${path}.`);

// Yields `[tokenPath, $value]` for every token leaf (a plain object with `$value`)
function* walkPresetTokens(group: unknown, path: string[] = []): Generator<[string, unknown]> {
  if (typeof group !== 'object' || group === null) {
    return;
  }
  if (Object.hasOwn(group, '$value')) {
    yield [path.join('.'), (group as { $value: unknown }).$value];
    return;
  }
  for (const [key, value] of Object.entries(group)) {
    yield* walkPresetTokens(value, [...path, key]);
  }
}

// A preset matches when it sets a token at/under `path`, or one of its values references a token at/under `path`
export const presetMatchesPath = (tokens: Record<string, unknown>, path: string): boolean => {
  for (const [tokenPath, value] of walkPresetTokens(tokens)) {
    if (isAtOrUnder(tokenPath, path)) {
      return true;
    }
    if (isRef(value) && isAtOrUnder(extractRef(value), path)) {
      return true;
    }
  }
  return false;
};

export const getRelevantPresetFolders = (
  path: string,
  folders: TokenPresetFolder[] = TOKEN_PRESET_FOLDERS,
): TokenPresetFolder[] =>
  folders.filter(({ presets }) => presets.some(({ tokens }) => presetMatchesPath(tokens, path)));
