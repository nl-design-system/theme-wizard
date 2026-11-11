import { profileForName, TOKENS, type TokenName } from '@nl-design-system-community/color-scale-generator';

export const INVERSE_SUFFIX = '-inverse';

export interface ColorScaleParams {
  /** e.g. `basis.color.accent-1` */
  regularGroupPath: string;
  /** e.g. `basis.color.accent-1-inverse` */
  inverseGroupPath: string;
  profile: ReturnType<typeof profileForName>;
  /** Anchor for generating the regular scale. */
  regularAnchor: TokenName | undefined;
  /** Anchor for generating the inverse scale. */
  inverseAnchor: TokenName | undefined;
}

/** Qualifies only when path's last segment is one of the 14 canonical slot names. */
export const getColorScaleParams = (path: string): ColorScaleParams | undefined => {
  const segments = path.split('.');
  const slot = segments.at(-1);
  const group = segments.at(-2);

  if (!slot || !group || !TOKENS.includes(slot as TokenName)) {
    return undefined;
  }

  const prefix = segments.slice(0, -2);
  const isInverse = group.endsWith(INVERSE_SUFFIX);
  const groupBase = isInverse ? group.slice(0, -INVERSE_SUFFIX.length) : group;
  const profile = profileForName(groupBase);

  // Anchor both scales to the picked slot so the seed reproduces exactly there.
  // Exception: picking the inverse group's bg-default (a vivid fill) shouldn't force
  // that color onto regular's bg-default (a pale background) — leave regular
  // unanchored there instead. Neutral's template can't anchor at all.
  let regularAnchor: TokenName | undefined;
  if (profile !== 'neutral') {
    regularAnchor = isInverse && slot === 'bg-default' ? undefined : (slot as TokenName);
  }
  const inverseAnchor = profile === 'neutral' ? undefined : (slot as TokenName);

  return {
    inverseAnchor,
    inverseGroupPath: [...prefix, `${groupBase}${INVERSE_SUFFIX}`].join('.'),
    profile,
    regularAnchor,
    regularGroupPath: [...prefix, groupBase].join('.'),
  };
};
