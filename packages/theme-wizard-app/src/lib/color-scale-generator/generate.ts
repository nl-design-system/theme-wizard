import { COLOR_SPACES, type ColorValue } from '@nl-design-system-community/design-tokens-schema';
import type { ProfileName, TokenName, Mask } from './masks.js';
import type { OKLCH } from './oklch.js';
import { apcaContrastOfOklch } from './contrast.js';
import { MASKS, TOKENS } from './masks.js';
import { parseToOklch, clampChroma } from './oklch.js';

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

/** Contrast requirements from the NL Design System handbook (per set). */
interface ContrastRequirement {
  bg: TokenName;
  kind: 'text' | 'border';
  token: TokenName;
  /** Groups default/hover/active variants sharing one bump direction — see `resolveFamilyDirections`. */
  family?: 'border' | 'color';
}

const CONTRAST_REQUIREMENTS: ContrastRequirement[] = [
  { bg: 'bg-default', family: 'border', kind: 'border', token: 'border-default' },
  { bg: 'bg-hover', family: 'border', kind: 'border', token: 'border-hover' },
  { bg: 'bg-active', family: 'border', kind: 'border', token: 'border-active' },
  { bg: 'bg-default', family: 'color', kind: 'text', token: 'color-default' },
  { bg: 'bg-hover', family: 'color', kind: 'text', token: 'color-hover' },
  { bg: 'bg-active', family: 'color', kind: 'text', token: 'color-active' },
  { bg: 'bg-subtle', kind: 'text', token: 'color-subtle' },
  { bg: 'bg-subtle', kind: 'text', token: 'color-document' },
];

/** Target APCA Lc scores (0..~108, compared as magnitude). `null` disables enforcement for that kind. */
export interface ContrastTargets {
  text: number | null;
  border: number | null;
}

export interface ContrastConfig {
  /** Auto-bump failing tokens away from their background. Default true. */
  enforce?: boolean;
  /**
   * Minimum lightness headroom to keep from pure black/white (OKLCH L units).
   * If reaching the target Lc would push a token within this of L=0 or L=1,
   * it stops at the boundary and emits a warning instead. Default 0.02.
   */
  minLightnessGap?: number;
  /** Per-profile Lc overrides. Defaults: 60 text / 30 border; disabled 30 text / off border. */
  targets?: Partial<Record<ProfileName, Partial<ContrastTargets>>>;
}

const DEFAULT_TARGETS: ContrastTargets = { border: 30, text: 60 };
const PROFILE_TARGETS: Partial<Record<ProfileName, ContrastTargets>> = {
  disabled: { border: null, text: 30 },
};

/** Lower bound for `minLightnessGap`: 0 means no headroom, bumping is allowed to reach pure black/white. */
const MIN_LIGHTNESS_GAP = 0;
/**
 * Upper bound for `minLightnessGap`. The gap is used as both boundary lightnesses
 * (`gap` near black and `1 - gap` near white); at 0.5 those two boundaries would
 * meet, and past it they'd cross, leaving no room to bump into. 0.49 keeps a
 * sliver of usable lightness range regardless of how large a gap is requested.
 */
const MAX_LIGHTNESS_GAP = 0.49;
/** Default `minLightnessGap` when the caller doesn't set one. See `ContrastConfig`. */
const DEFAULT_LIGHTNESS_GAP = 0.02;

export interface GenerateOptions {
  profile: ProfileName;
  inverse?: boolean;
  chroma?: number;
  anchor?: TokenName | 'auto';
  /** APCA contrast enforcement. Omit for defaults (enforce on). Pass `false` to skip entirely. */
  contrast?: ContrastConfig | false;
}

/** The 14 output tokens, each a design-tokens-schema `ColorValue` in the `oklch` color space. */
export type ColorScale = Record<TokenName, ColorValue>;
export interface GenerateResult {
  data: ColorScale;
  warnings: string[];
}

/** Working ramp during generation: one OKLCH triple per token, not yet converted to a `ColorValue`. */
type OklchScale = Record<TokenName, OKLCH>;

const toColorValue = (oklch: OKLCH): ColorValue => {
  return { alpha: 1, colorSpace: COLOR_SPACES.OKLCH, components: [oklch.L, oklch.C, oklch.H] };
};

const toColorScale = (oklchScale: OklchScale): ColorScale => {
  const entries = TOKENS.map((token): [TokenName, ColorValue] => [token, toColorValue(oklchScale[token])]);
  return Object.fromEntries(entries) as ColorScale;
};

/**
 * Find which token index the seed should be measured against.
 * - `anchor: 'auto'` picks the token whose template lightness is closest to the seed's.
 * - `anchor: TokenName` picks that token, exactly.
 * - no anchor picks the mask's own `seedSlot` (a hue/chroma reference only — the ramp
 *   isn't pinned to it, see `isAnchored` in `buildRamp`).
 */
const resolveAnchorIndex = (mask: Mask, anchor: TokenName | 'auto' | undefined, seedLightness: number): number => {
  if (anchor === 'auto') {
    let closestIndex = 0;
    let smallestLightnessDifference = Infinity;
    for (let index = 0; index < mask.L.length; index++) {
      const lightnessDifference = Math.abs(mask.L[index] - seedLightness);
      if (lightnessDifference < smallestLightnessDifference) {
        smallestLightnessDifference = lightnessDifference;
        closestIndex = index;
      }
    }
    return closestIndex;
  }

  if (anchor !== undefined) {
    const tokenIndex = TOKENS.indexOf(anchor);
    if (tokenIndex < 0) {
      throw new Error(`Unknown token: ${anchor}`);
    }
    return tokenIndex;
  }

  return TOKENS.indexOf(mask.seedSlot);
};

/** The seed hue, offset by this token's position in the mask's hue ramp. */
const computeTokenHue = (mask: Mask, tokenIndex: number, seedHue: number, hueReference: number): number => {
  return (seedHue + (mask.H[tokenIndex] - hueReference) + 360) % 360;
};

interface RampContext {
  chromaScale: number;
  data: OklchScale;
  hueReference: number;
  mask: Mask;
  seedHue: number;
}

/**
 * Generate the base 14-token ramp from the seed and mask, before contrast
 * enforcement. Also returns the pieces enforcement needs to regenerate a
 * single token's color at a different lightness (same hue and chroma shape).
 * @param seed Any valid CSS color: hex, `rgb()`, `hsl()`, `oklch()`, a named color, ...
 */
const buildRamp = (seed: string, options: GenerateOptions): RampContext => {
  const { anchor, chroma = 1, inverse = false, profile } = options;
  const mask: Mask = MASKS[profile][inverse ? 'inverse' : 'regular'];
  const { C: seedChroma, H: seedHue, L: seedLightness } = parseToOklch(seed);

  const isAnchored = anchor !== undefined;
  const anchorIndex = resolveAnchorIndex(mask, anchor, seedLightness);

  const chromaScale = mask.C[anchorIndex] > 0 ? (seedChroma * chroma) / mask.C[anchorIndex] : 0;
  const lightnessShift = isAnchored ? seedLightness - mask.L[anchorIndex] : 0;
  const hueReference = isAnchored ? mask.H[anchorIndex] : 0;

  const data = {} as OklchScale;
  for (let tokenIndex = 0; tokenIndex < TOKENS.length; tokenIndex++) {
    // Tokens pinned to a flat extreme (no chroma, full black/white) are seed-independent
    // by design (e.g. "always white text on dark bg") — shifting them with the anchor
    // would corrupt that invariant whenever the seed sits far from the anchor's template.
    const isPinned = mask.C[tokenIndex] === 0 && (mask.L[tokenIndex] === 0 || mask.L[tokenIndex] === 1);
    const lightness = isPinned ? mask.L[tokenIndex] : clamp(mask.L[tokenIndex] + lightnessShift, 0, 1);
    const hue = computeTokenHue(mask, tokenIndex, seedHue, hueReference);
    const tokenChroma = clampChroma(lightness, mask.C[tokenIndex] * chromaScale, hue);
    data[TOKENS[tokenIndex]] = { C: tokenChroma, H: hue, L: lightness };
  }

  return { chromaScale, data, hueReference, mask, seedHue };
};

const resolveContrastTargets = (profile: ProfileName, config: ContrastConfig): ContrastTargets => {
  return {
    ...DEFAULT_TARGETS,
    ...PROFILE_TARGETS[profile],
    ...config.targets?.[profile],
  };
};

interface TokenLightnessFns {
  apcaAtLightness: (lightness: number) => number;
  oklchAtLightness: (lightness: number) => OKLCH;
}

/** Hue/chroma-locked color and |APCA Lc| at a given lightness, for one requirement's token. */
const buildTokenLightnessFns = (
  ramp: RampContext,
  requirement: ContrastRequirement,
  tokenIndex: number,
): TokenLightnessFns => {
  const { data, mask } = ramp;
  const background = data[requirement.bg];
  const hue = computeTokenHue(mask, tokenIndex, ramp.seedHue, ramp.hueReference);
  const unclampedChroma = mask.C[tokenIndex] * ramp.chromaScale;

  const oklchAtLightness = (lightness: number): OKLCH => {
    const chroma = clampChroma(lightness, unclampedChroma, hue);
    return { C: chroma, H: hue, L: lightness };
  };
  const apcaAtLightness = (lightness: number): number => {
    return Math.abs(apcaContrastOfOklch(background, oklchAtLightness(lightness)));
  };

  return { apcaAtLightness, oklchAtLightness };
};

/** Which direction (black or white) scores higher |Lc| against the background. */
const pickShouldLighten = (apcaAtLightness: (lightness: number) => number, gap: number): boolean => {
  return apcaAtLightness(1 - gap) >= apcaAtLightness(gap);
};

/** One bump direction per family, from the `-default` member, so hover/active don't flip independently. */
const resolveFamilyDirections = (ramp: RampContext, gap: number, targets: ContrastTargets): Map<string, boolean> => {
  const { data } = ramp;
  const directions = new Map<string, boolean>();
  for (const requirement of CONTRAST_REQUIREMENTS) {
    if (!requirement.family || directions.has(requirement.family) || !requirement.token.endsWith('-default')) {
      continue;
    }
    const ratio = requirement.kind === 'text' ? targets.text : targets.border;
    const backgroundOklch = data[requirement.bg];
    const foregroundOklch = data[requirement.token];
    const currentApca = Math.abs(apcaContrastOfOklch(backgroundOklch, foregroundOklch));

    let shouldLighten: boolean;
    if (ratio === null || currentApca >= ratio) {
      shouldLighten = foregroundOklch.L > backgroundOklch.L;
    } else {
      const tokenIndex = TOKENS.indexOf(requirement.token);
      const { apcaAtLightness } = buildTokenLightnessFns(ramp, requirement, tokenIndex);
      shouldLighten = pickShouldLighten(apcaAtLightness, gap);
    }
    directions.set(requirement.family, shouldLighten);
  }
  return directions;
};

/**
 * |Lc| rises monotonically from `startLightness` toward `boundaryLightness`;
 * bisect for the minimal-move lightness that just meets the target.
 * `startLightness` must fail `meetsRatio` and `boundaryLightness` must pass it.
 */
const bisectForLightness = (
  meetsRatio: (lightness: number) => boolean,
  startLightness: number,
  boundaryLightness: number,
): number => {
  let lowLightness = startLightness;
  let highLightness = boundaryLightness;
  const BISECTION_ITERATIONS = 24;
  for (let iteration = 0; iteration < BISECTION_ITERATIONS; iteration++) {
    const midLightness = (lowLightness + highLightness) / 2;
    if (meetsRatio(midLightness)) {
      highLightness = midLightness;
    } else {
      lowLightness = midLightness;
    }
  }
  return highLightness;
};

interface EnforceRequirementParams {
  enforce: boolean;
  gap: number;
  profileLabel: string;
  ramp: RampContext;
  ratio: number;
  requirement: ContrastRequirement;
  /** Family-decided direction, if any; per-token choice otherwise. */
  shouldLighten?: boolean;
  tokenIndex: number;
}

interface EnforceRequirementResult {
  warning?: string;
}

/**
 * Check one token/background pair against its target |Lc| and, if it fails,
 * nudge the token's lightness away from the background until it passes (or
 * warn if the lightness guard is hit first). Mutates `ramp.data` in place.
 */
const enforceRequirement = (params: EnforceRequirementParams): EnforceRequirementResult => {
  const { enforce, gap, profileLabel, ramp, ratio, requirement, tokenIndex } = params;
  const { data } = ramp;

  const backgroundOklch = data[requirement.bg];
  const foregroundOklch = data[requirement.token];
  const currentApca = Math.abs(apcaContrastOfOklch(backgroundOklch, foregroundOklch));

  // A passing token can still be on the wrong side of its family's direction.
  const onFamilySide =
    params.shouldLighten === undefined ? true : params.shouldLighten === foregroundOklch.L > backgroundOklch.L;

  if (currentApca >= ratio && onFamilySide) {
    return {};
  }

  const requirementLabel = `${profileLabel} · ${requirement.token} vs ${requirement.bg}`;

  if (!enforce) {
    return { warning: `${requirementLabel}: Lc ${currentApca.toFixed(1)} < Lc ${ratio}` };
  }

  const { apcaAtLightness, oklchAtLightness } = buildTokenLightnessFns(ramp, requirement, tokenIndex);
  const shouldLighten = params.shouldLighten ?? pickShouldLighten(apcaAtLightness, gap);
  const boundaryLightness = shouldLighten ? 1 - gap : gap;
  const apcaAtBoundary = apcaAtLightness(boundaryLightness);

  if (apcaAtBoundary < ratio) {
    // Target unreachable without crossing the guard: stop at the boundary and warn.
    data[requirement.token] = oklchAtLightness(boundaryLightness);
    const boundaryName = shouldLighten ? 'white' : 'black';
    return {
      warning: `${requirementLabel}: Lc ${apcaAtBoundary.toFixed(1)} < Lc ${ratio} (kept ${gap} off ${boundaryName})`,
    };
  }

  // Bisection needs a same-side start; off-side falls back to the background's own lightness.
  const bisectStart = onFamilySide ? foregroundOklch.L : backgroundOklch.L;
  const bumpedLightness = bisectForLightness(
    (lightness) => apcaAtLightness(lightness) >= ratio,
    bisectStart,
    boundaryLightness,
  );
  data[requirement.token] = oklchAtLightness(bumpedLightness); // silent successful bump

  return {};
};

/**
 * Generate a 14-token scale from a seed, then enforce NL Design System contrast
 * requirements by nudging failing tokens away from their background.
 * @param seed Any valid CSS color: hex, `rgb()`, `hsl()`, `oklch()`, a named color, ...
 */
export const generateScale = (seed: string, options: GenerateOptions): GenerateResult => {
  const { inverse = false, profile } = options;
  const ramp = buildRamp(seed, options);
  const warnings: string[] = [];

  if (options.contrast === false) {
    return { data: toColorScale(ramp.data), warnings };
  }

  const contrastConfig = options.contrast ?? {};
  const enforce = contrastConfig.enforce ?? true;
  const requestedGap = contrastConfig.minLightnessGap ?? DEFAULT_LIGHTNESS_GAP;
  const gap = clamp(requestedGap, MIN_LIGHTNESS_GAP, MAX_LIGHTNESS_GAP);
  const targets = resolveContrastTargets(profile, contrastConfig);
  const profileLabel = `${profile}${inverse ? '-inverse' : ''}`;
  const familyDirections = resolveFamilyDirections(ramp, gap, targets);

  for (const requirement of CONTRAST_REQUIREMENTS) {
    const ratio = requirement.kind === 'text' ? targets.text : targets.border;
    if (ratio === null) {
      continue;
    }

    const tokenIndex = TOKENS.indexOf(requirement.token);
    const shouldLighten = requirement.family ? familyDirections.get(requirement.family) : undefined;
    const { warning } = enforceRequirement({
      enforce,
      gap,
      profileLabel,
      ramp,
      ratio,
      requirement,
      shouldLighten,
      tokenIndex,
    });
    if (warning) {
      warnings.push(warning);
    }
  }

  return { data: toColorScale(ramp.data), warnings };
};
