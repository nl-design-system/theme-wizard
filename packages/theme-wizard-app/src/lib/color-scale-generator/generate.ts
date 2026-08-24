import { COLOR_SPACES, type ColorValue } from '@nl-design-system-community/design-tokens-schema';
import type { ProfileName, TokenName, Mask } from './masks.js';
import type { OKLCH } from './oklch.js';
import { contrastRatio } from './contrast.js';
import { MASKS, TOKENS } from './masks.js';
import { parseToOklch, clampChroma, oklchToHex } from './oklch.js';

const clampToUnitRange = (value: number): number => {
  return Math.min(1, Math.max(0, value));
};

/** Contrast requirements from the NL Design System handbook (per set). */
interface ContrastRequirement {
  bg: TokenName;
  kind: 'text' | 'border';
  token: TokenName;
}

const CONTRAST_REQUIREMENTS: ContrastRequirement[] = [
  { bg: 'bg-default', kind: 'border', token: 'border-default' },
  { bg: 'bg-hover', kind: 'border', token: 'border-hover' },
  { bg: 'bg-active', kind: 'border', token: 'border-active' },
  { bg: 'bg-default', kind: 'text', token: 'color-default' },
  { bg: 'bg-hover', kind: 'text', token: 'color-hover' },
  { bg: 'bg-active', kind: 'text', token: 'color-active' },
  { bg: 'bg-subtle', kind: 'text', token: 'color-subtle' },
  { bg: 'bg-subtle', kind: 'text', token: 'color-document' },
];

/** Target ratios. `null` disables enforcement for that kind. */
export interface ContrastTargets {
  text: number | null;
  border: number | null;
}

export interface ContrastConfig {
  /** Auto-bump failing tokens away from their background. Default true. */
  enforce?: boolean;
  /**
   * Minimum lightness headroom to keep from pure black/white (OKLCH L units).
   * If reaching the target ratio would push a token within this of L=0 or L=1,
   * it stops at the boundary and emits a warning instead. Default 0.02.
   */
  minLightnessGap?: number;
  /** Per-profile ratio overrides. Defaults: 4.5 text / 3 border; disabled 3 text / off border. */
  targets?: Partial<Record<ProfileName, Partial<ContrastTargets>>>;
}

const DEFAULT_TARGETS: ContrastTargets = { border: 3, text: 4.5 };
const PROFILE_TARGETS: Partial<Record<ProfileName, ContrastTargets>> = {
  disabled: { border: null, text: 3 },
};

export interface GenerateOptions {
  profile: ProfileName;
  inverse?: boolean;
  chroma?: number;
  anchor?: TokenName | 'auto';
  /** WCAG contrast enforcement. Omit for defaults (enforce on). Pass `false` to skip entirely. */
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
    const lightness = clampToUnitRange(mask.L[tokenIndex] + lightnessShift);
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

interface BumpDirection {
  boundaryLightness: number;
  shouldLighten: boolean;
}

/**
 * Decide which direction (toward black or white) actually raises contrast
 * against the background, and how far it's allowed to go (the lightness guard).
 * Against a light background only darkening helps; against a dark background
 * only lightening helps — comparing both boundaries resolves both cases, and ties.
 */
const pickBumpDirection = (contrastAtLightness: (lightness: number) => number, gap: number): BumpDirection => {
  const contrastNearWhite = contrastAtLightness(1 - gap);
  const contrastNearBlack = contrastAtLightness(gap);
  const shouldLighten = contrastNearWhite >= contrastNearBlack;
  return { boundaryLightness: shouldLighten ? 1 - gap : gap, shouldLighten };
};

/**
 * Contrast rises monotonically from `startLightness` toward `boundaryLightness`;
 * bisect for the minimal-move lightness that just meets the ratio.
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
  tokenIndex: number;
}

interface EnforceRequirementResult {
  warning?: string;
}

/**
 * Check one token/background pair against its target ratio and, if it fails,
 * nudge the token's lightness away from the background until it passes (or
 * warn if the lightness guard is hit first). Mutates `ramp.data` in place.
 */
const enforceRequirement = (params: EnforceRequirementParams): EnforceRequirementResult => {
  const { enforce, gap, profileLabel, ramp, ratio, requirement, tokenIndex } = params;
  const { data, mask } = ramp;

  const backgroundHex = oklchToHex(data[requirement.bg]);
  const foregroundOklch = data[requirement.token];
  const foregroundHex = oklchToHex(foregroundOklch);
  const currentRatio = contrastRatio(foregroundHex, backgroundHex);

  if (currentRatio >= ratio) {
    return {};
  }

  const requirementLabel = `${profileLabel} · ${requirement.token} vs ${requirement.bg}`;

  if (!enforce) {
    return { warning: `${requirementLabel}: ${currentRatio.toFixed(2)}:1 < ${ratio}:1` };
  }

  const hue = computeTokenHue(mask, tokenIndex, ramp.seedHue, ramp.hueReference);
  const unclampedChroma = mask.C[tokenIndex] * ramp.chromaScale;

  const oklchAtLightness = (lightness: number): OKLCH => {
    const chroma = clampChroma(lightness, unclampedChroma, hue);
    return { C: chroma, H: hue, L: lightness };
  };
  const contrastAtLightness = (lightness: number): number => {
    return contrastRatio(oklchToHex(oklchAtLightness(lightness)), backgroundHex);
  };

  const { boundaryLightness, shouldLighten } = pickBumpDirection(contrastAtLightness, gap);

  if (contrastAtLightness(boundaryLightness) < ratio) {
    // Target unreachable without crossing the guard: stop at the boundary and warn.
    const boundaryOklch = oklchAtLightness(boundaryLightness);
    data[requirement.token] = boundaryOklch;
    const boundaryRatio = contrastRatio(oklchToHex(boundaryOklch), backgroundHex);
    const boundaryName = shouldLighten ? 'white' : 'black';
    return {
      warning: `${requirementLabel}: ${boundaryRatio.toFixed(2)}:1 < ${ratio}:1 (kept ${gap} off ${boundaryName})`,
    };
  }

  const bumpedLightness = bisectForLightness(
    (lightness) => contrastAtLightness(lightness) >= ratio,
    foregroundOklch.L,
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
  const gap = Math.max(0, Math.min(0.49, contrastConfig.minLightnessGap ?? 0.02));
  const targets = resolveContrastTargets(profile, contrastConfig);
  const profileLabel = `${profile}${inverse ? '-inverse' : ''}`;

  for (const requirement of CONTRAST_REQUIREMENTS) {
    const ratio = requirement.kind === 'text' ? targets.text : targets.border;
    if (ratio === null) {
      continue;
    }

    const tokenIndex = TOKENS.indexOf(requirement.token);
    const { warning } = enforceRequirement({ enforce, gap, profileLabel, ramp, ratio, requirement, tokenIndex });
    if (warning) {
      warnings.push(warning);
    }
  }

  return { data: toColorScale(ramp.data), warnings };
};
