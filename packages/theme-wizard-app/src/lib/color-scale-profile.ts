import type { ProfileName } from './color-scale-generator';

// The color scale generator works off a structural profile (masks extracted from the
// NL Design System theme), not the group name — several group names in BASIS_COLOR_NAMES
// alias to the same 'accent' shape, per the generator's README.
const PROFILE_BY_COLOR_KEY: Record<string, ProfileName> = {
  'accent-1': 'accent',
  'accent-2': 'accent',
  'accent-3': 'accent',
  'action-1': 'accent',
  'action-2': 'accent',
  default: 'neutral',
  disabled: 'disabled',
  highlight: 'highlight',
  info: 'accent',
  negative: 'negative',
  positive: 'positive',
  selected: 'accent',
  warning: 'warning',
};

/**
 * Resolves a basis color group name (e.g. `accent-1`, `default`, or a full token
 * path ending in one) to its structural profile. Falls back to `accent` for
 * unrecognised names.
 */
export const profileForName = (name: string): ProfileName => {
  const colorKey = name.split('.').at(-1) ?? '';
  return PROFILE_BY_COLOR_KEY[colorKey] ?? 'accent';
};
