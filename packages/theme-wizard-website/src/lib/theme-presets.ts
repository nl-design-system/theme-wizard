import type { StoryPreset } from '@nl-design-system-community/theme-wizard-app';
import { BASIS_COLOR_NAMES, COLOR_KEYS } from '@nl-design-system-community/design-tokens-schema';

// Basis color groups that have an `-inverse` counterpart, e.g. `accent-1` and `accent-1-inverse`
const INVERTIBLE_COLOR_NAMES = BASIS_COLOR_NAMES.filter((name) =>
  (BASIS_COLOR_NAMES as readonly string[]).includes(`${name}-inverse`),
);

const inverseColorTokens = Object.fromEntries(
  INVERTIBLE_COLOR_NAMES.map((name) => [
    name,
    Object.fromEntries(COLOR_KEYS.map((key) => [key, { $value: `{basis.color.${name}-inverse.${key}}` }])),
  ]),
);

export const THEME_PRESETS: StoryPreset[] = [
  { label: 'Standaard', tokens: {}, value: 'default' },
  { label: 'Inverse', tokens: { basis: { color: inverseColorTokens } }, value: 'inverse' },
];
