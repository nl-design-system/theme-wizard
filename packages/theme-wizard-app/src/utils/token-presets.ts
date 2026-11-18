import { extractRef, isRef, isValueObject, isValueToken } from '@nl-design-system-community/design-tokens-schema';

export type TokenPreset = {
  // Label in the select, e.g. `accent-1-inverse`
  name: string;
  tokens: Record<string, unknown>;
};

export type TokenPresetFolder = {
  // Preset module filename, e.g. `nl.link`; stories opt in with `parameters.presets`
  folder: string;
  presets: TokenPreset[];
};

const collator = new Intl.Collator();

const PRESET_FILE_PATTERN = /\/presets\/([^/]+)\.ts$/;

const presetModules = import.meta.glob<TokenPreset[]>('../../presets/*.ts', {
  eager: true,
  import: 'default',
});

export const TOKEN_PRESET_FOLDERS: TokenPresetFolder[] = Object.entries(presetModules).flatMap(
  ([filePath, presets]) => {
    const [, folder] = PRESET_FILE_PATTERN.exec(filePath) ?? [];
    if (!folder) {
      return [];
    }
    return [{ folder, presets: presets.toSorted((a, b) => collator.compare(a.name, b.name)) }];
  },
);

const isAtOrUnder = (candidate: string, path: string) => candidate === path || candidate.startsWith(`${path}.`);

// Yields `[tokenPath, $value]` for every token leaf (a plain object with `$value`)
function* walkPresetTokens(group: unknown, path: string[] = []): Generator<[string, unknown]> {
  if (!isValueObject(group)) {
    return;
  }
  if (isValueToken(group)) {
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
