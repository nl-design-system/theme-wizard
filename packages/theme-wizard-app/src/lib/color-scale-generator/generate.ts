import type { ProfileName, TokenName, Mask } from './masks.js';
import { contrastRatio } from './contrast.js';
import { MASKS, TOKENS } from './masks.js';
import { parseToOklch, clampChroma, oklchToHex } from './oklch.js';

const clamp = (x: number): number => Math.min(1, Math.max(0, x));

/** Contrast requirements from the NL Design System handbook (per set). */
interface ContrastRequirement {
  token: TokenName;
  bg: TokenName;
  kind: 'text' | 'border';
}

const REQUIREMENTS: ContrastRequirement[] = [
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

export type ColorScale = Record<TokenName, string>;
export interface GenerateResult {
  data: ColorScale;
  warnings: string[];
}

/** @param seed Any valid CSS color: hex, `rgb()`, `hsl()`, `oklch()`, a named color, ... */
const baseScale = (seed: string, opts: GenerateOptions) => {
  const { anchor, chroma = 1, inverse = false, profile } = opts;
  const mask: Mask = MASKS[profile][inverse ? 'inverse' : 'regular'];
  const { C: seedC, H: seedH, L: seedL } = parseToOklch(seed);

  const anchored = anchor !== undefined;
  let idx: number;
  if (anchor === 'auto') {
    idx = 0;
    let best = Infinity;
    for (let i = 0; i < mask.L.length; i++) {
      const d = Math.abs(mask.L[i] - seedL);
      if (d < best) {
        best = d;
        idx = i;
      }
    }
  } else if (anchored) {
    idx = TOKENS.indexOf(anchor);
    if (idx < 0) {
      throw new Error(`Unknown token: ${anchor}`);
    }
  } else {
    idx = TOKENS.indexOf(mask.seedSlot);
  }

  const scale = mask.C[idx] > 0 ? (seedC * chroma) / mask.C[idx] : 0;
  const lShift = anchored ? seedL - mask.L[idx] : 0;
  const hRef = anchored ? mask.H[idx] : 0;

  const data = {} as ColorScale;
  const lchL: Record<string, number> = {};
  for (let i = 0; i < TOKENS.length; i++) {
    const L = clamp(mask.L[i] + lShift);
    const H = (seedH + (mask.H[i] - hRef) + 360) % 360;
    const C = clampChroma(L, mask.C[i] * scale, H);
    data[TOKENS[i]] = oklchToHex({ C, H, L });
    lchL[TOKENS[i]] = L;
  }
  return { data, hRef, lShift, mask, scale, seedH };
};

/**
 * Generate a 14-token scale from a seed, then enforce NL Design System contrast
 * requirements by nudging failing tokens away from their background.
 * @param seed Any valid CSS color: hex, `rgb()`, `hsl()`, `oklch()`, a named color, ...
 */
export const generateScale = (seed: string, opts: GenerateOptions): GenerateResult => {
  const { inverse = false, profile } = opts;
  const contrast = opts.contrast;
  const { data, hRef, mask, scale, seedH } = baseScale(seed, opts);
  const warnings: string[] = [];

  if (contrast === false) return { data, warnings };

  const cfg = contrast ?? {};
  const enforce = cfg.enforce ?? true;
  const gap = Math.max(0, Math.min(0.49, cfg.minLightnessGap ?? 0.02));
  const targets: ContrastTargets = {
    ...DEFAULT_TARGETS,
    ...PROFILE_TARGETS[profile],
    ...cfg.targets?.[profile],
  };
  const setLabel = `${profile}${inverse ? '-inverse' : ''}`;

  for (let i = 0; i < TOKENS.length; i++) {
    const req = REQUIREMENTS.find((r) => r.token === TOKENS[i]);
    if (!req) continue;
    const ratio = req.kind === 'text' ? targets.text : targets.border;
    if (ratio === null) continue;

    const bgHex = data[req.bg];
    let hex = data[req.token];
    if (contrastRatio(hex, bgHex) >= ratio) continue;

    const H = (seedH + (mask.H[i] - hRef) + 360) % 360;
    const C0 = mask.C[i] * scale;
    const emit = (L: number) => oklchToHex({ C: clampChroma(L, C0, H), H, L });
    // Pick the direction that actually raises contrast: compare what each guard
    // boundary achieves. (Against a light bg only darkening helps; against a
    // dark bg only lightening helps — this resolves both, and ties.)
    const upBoundary = contrastRatio(emit(1 - gap), bgHex);
    const downBoundary = contrastRatio(emit(gap), bgHex);
    const up = upBoundary >= downBoundary;
    const limit = up ? 1 - gap : gap; // closeness guard: never past this L
    const passes = (L: number) => contrastRatio(emit(L), bgHex) >= ratio;

    if (!enforce) {
      warnings.push(`${setLabel} · ${req.token} vs ${req.bg}: ${contrastRatio(hex, bgHex).toFixed(2)}:1 < ${ratio}:1`);
      continue;
    }

    if (!passes(limit)) {
      // Target unreachable without crossing the guard: stop at the boundary and warn.
      hex = emit(limit);
      data[req.token] = hex;
      warnings.push(
        `${setLabel} · ${req.token} vs ${req.bg}: ${contrastRatio(hex, bgHex).toFixed(2)}:1 ` +
          `< ${ratio}:1 (kept ${gap} off ${up ? 'white' : 'black'})`,
      );
      continue;
    }

    // Contrast rises monotonically from startL toward limit; bisect for the
    // minimal-move lightness that just meets the ratio. lo fails, hi passes.
    let lo = parseToOklch(hex).L;
    let hi = limit;
    for (let k = 0; k < 24; k++) {
      const mid = (lo + hi) / 2;
      if (passes(mid)) hi = mid;
      else lo = mid;
    }
    data[req.token] = emit(hi); // silent successful bump
  }

  return { data, warnings };
};
