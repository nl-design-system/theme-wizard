# color-scale-generator

Generate a full 14-token color scale (`bg-document` → `color-document`) from a single seed color, using lightness / chroma / hue masks extracted from the [NL Design System Start theme](https://github.com/nl-design-system/themes/tree/main/packages/start-design-tokens) (`common.basis.color`).

## Why masks

Analysis of the Start theme showed the tokens decompose cleanly along three axes:

- **Lightness** is a _fixed template_, seed-independent. Nearly every chromatic group shares the same L ramp (within ~0.005). `bg-document` is ~0.99 no matter the seed, so by default lightness is never scaled by the seed — only the template is applied.
- **Chroma** follows a normalised _shape_ per profile, scaled by the seed's own chroma. The peak location differs by role: accents peak at the foreground text, status colors peak at the borders, highlight peaks at the background fills.
- **Hue** is the seed hue plus a small per-token offset (real ramps rotate ~10° across the scale; storing that offset makes reconstruction exact).

Reconstructing the original theme tokens from these masks is accurate to within **1/255** per channel (rounding).

## Usage

This lives inside `theme-wizard-app`, not as its own published package — import it by relative path from `src/lib/color-scale-generator` (see `wizard-colorscale-input` for a real consumer):

```ts
import { generateScale, oklchToHex } from '../../lib/color-scale-generator';

const { data, warnings } = generateScale('#7C3AED', { profile: 'accent' });
// data: { 'bg-document': { colorSpace: 'oklch', components: [L, C, H], alpha: 1 }, … }
// warnings: string[]  (contrast it couldn't fix)

// The seed accepts any valid CSS color, not just hex:
generateScale('rgb(124 58 237)', { profile: 'accent' });
generateScale('hsl(262 84% 58%)', { profile: 'accent' });
generateScale('oklch(0.54 0.25 293)', { profile: 'accent' });
generateScale('rebeccapurple', { profile: 'accent' });
// Output tokens are always a design-tokens-schema `ColorValue` in the oklch color
// space, regardless of the seed's format — convert with `stringifyColor()` /
// `colorTokenValueToColorJS()` from `@nl-design-system-community/design-tokens-schema`,
// or use this package's own `oklchToHex({ L, C, H })` for a plain hex string.

const accentDark = generateScale('#7C3AED', {
  profile: 'accent',
  inverse: true,
}).data;
const danger = generateScale('#D64545', { profile: 'negative' }).data;
const muted = generateScale('#7C3AED', { profile: 'accent', chroma: 0.5 }).data;

// Seed returns in the scale, at the slot it naturally belongs in:
const anchored = generateScale('#7C3AED', {
  profile: 'accent',
  anchor: 'auto',
}).data;
// the seed's exact L, C and H appear verbatim at whichever token anchor: 'auto' picks

// ...or pin it to a specific token yourself:
const pinned = generateScale('#7C3AED', {
  profile: 'accent',
  anchor: 'color-hover',
}).data;
// oklchToHex(pinned['color-hover']) === '#7C3AED'

// Tinted neutrals / disabled (see below):
const tintedGray = generateScale('#7C3AED', {
  profile: 'neutral',
  chroma: 0.3,
}).data;
const tintedDisabled = generateScale('#7C3AED', {
  profile: 'disabled',
  chroma: 0.4,
}).data;
```

### Options

| option     | type                                                                            | default | notes                                                                 |
| ---------- | ------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------- |
| `profile`  | `neutral \| accent \| negative \| positive \| warning \| highlight \| disabled` | —       | Structural template. See below.                                       |
| `inverse`  | `boolean`                                                                       | `false` | Dark-mode template (foreground → white, chroma in the fills).         |
| `chroma`   | `number`                                                                        | `1`     | Multiplier on top of the seed's chroma. `<1` mutes, `>1` pushes.      |
| `anchor`   | `TokenName \| 'auto'`                                                           | —       | Pin the seed into the scale. `'auto'` picks the best slot. See below. |
| `contrast` | `ContrastConfig \| false`                                                       | on      | APCA contrast enforcement. `false` skips it. See below.               |

## Anchoring (making the seed return in the scale)

By default the seed donates only **hue and chroma**; lightness comes from the fixed template, so `bg-document` stays ~white whatever you seed. The seed color itself won't appear verbatim in the output.

Pass `anchor` to pin the seed into the ramp. The output at the anchor token equals the seed exactly (L, C and H); the rest is derived around it: the lightness template is shifted so the anchor lands on the seed's lightness, hue offsets are re-referenced to the anchor, and chroma is scaled so the anchor matches the seed's chroma.

`anchor: 'auto'` picks the token whose template lightness is closest to the seed's, so the seed lands in the slot it naturally belongs in and the rest of the ramp barely moves. In practice this means mid-lightness brand colors land near the border/text tokens, pastels near the backgrounds — matching what people expect:

```ts
generateScale('#7C3AED', { profile: 'accent', anchor: 'auto' }); // mid-lightness seed lands near the middle of the ramp (border tokens)
generateScale('#FACC15', { profile: 'accent', anchor: 'auto' }); // light seed lands near the light end (bg/border-subtle tokens)
generateScale('#991B1B', { profile: 'accent', anchor: 'auto' }); // dark seed lands near the dark end (color tokens)
```

You can also name the token explicitly:

```ts
oklchToHex(generateScale('#7C3AED', { profile: 'accent', anchor: 'border-default' }).data['border-default']);
// === '#7C3AED'
```

## Return value

```ts
interface GenerateResult {
  data: Record<TokenName, ColorValue>; // the 14 tokens, each an oklch ColorValue
  warnings: string[]; // contrast rules that couldn't be satisfied
}
```

`warnings` is empty when every enforced token meets its target. Entries look like `accent · color-subtle vs bg-subtle: Lc 58.2 < Lc 60 (kept 0.02 off white)` — the token, the background it's checked against, the |Lc| it reached, and why (it hit the lightness guard).

## Contrast enforcement

After generating the ramp, the generator checks each foreground/border token against its reference background and, if it falls short, nudges that token's **lightness away from the background** (darker in the regular set, lighter in the inverse set) until it passes — hue fixed, chroma re-clamped to gamut at the new lightness. The metric is APCA `Lc` (compared as magnitude, since APCA's sign just encodes polarity). Default/hover/active variants of the same token share one bump direction, decided from the `-default` member, so a family never ends up mixing black and white.

Requirements, per set ([from the NL Design System handbook](https://nldesignsystem.nl/handboek/huisstijl/basis-tokens/#as-2-toepassing), targets re-expressed in APCA Lc):

| Token                                               | Target Lc | Against          |
| --------------------------------------------------- | --------- | ---------------- |
| `border-default` / `border-hover` / `border-active` | 30        | matching `bg-*`  |
| `color-default` / `color-hover` / `color-active`    | 60        | matching `bg-*`  |
| `color-subtle` / `color-document`                   | 60        | `bg-subtle`      |
| `border-subtle`, all `bg-*`                         | —         | (no requirement) |

`disabled` uses a looser target — Lc 30 for text, borders unenforced. Note the handbook does not publish exact numbers for disabled (it defers to [WCAG 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum), which formally exempts inactive components); these are pragmatic defaults and are configurable.

```ts
interface ContrastConfig {
  enforce?: boolean; // default true; false = report failures in warnings, don't bump
  minLightnessGap?: number; // default 0.02; headroom kept from pure black/white
  targets?: Partial<Record<ProfileName, { text?: number | null; border?: number | null }>>;
}
```

**The lightness guard (`minLightnessGap`).** A token is never pushed within this much OKLCH lightness of pure black or white just to force a pass. If the target can only be met past that boundary — or the background sits in a luminance dead-zone where it's unreachable from either side — the token stops at the boundary (its best achievable Lc) and a warning is emitted instead of producing a near-black/near-white color. Set a `null` target to disable a check.

```ts
generateScale(seed, { profile: 'accent', contrast: false }); // skip entirely
generateScale(seed, { profile: 'accent', contrast: { enforce: false } }); // report only
generateScale(seed, { profile: 'accent', contrast: { minLightnessGap: 0.05 } }); // wider guard
generateScale(seed, {
  profile: 'accent',
  contrast: { targets: { accent: { text: 75 } } },
});
```

## Choosing a profile

The seed **cannot** tell you the profile: a red seed could be a `negative` status or an `accent`. Pass the intent explicitly.

- `neutral` — near-gray. Tints toward the seed hue when the seed has chroma; a gray seed (or `chroma: 0`) yields the exact original gray ramp. Use a small `chroma` (e.g. 0.2–0.4) for a subtle tinted-gray palette.
- `accent` — chroma rises toward the foreground text tokens. Also the shape used by action / info / selected in the source theme (all aliased to accent).
- `negative` / `positive` / `warning` — status colors; chroma peaks at the borders.
- `highlight` — chroma peaks at the background fills.
- `disabled` — flattened bands: bg / border / color each collapse to a single lightness (no hover/active progression, by design). Tints toward the seed hue like `neutral`.

> `neutral` and `disabled` are pure gray in the source theme, so their chroma shape (flat) and hue offset (zero) are **synthetic defaults** for optional tinting, not extracted values. Everything else is extracted from the theme.
