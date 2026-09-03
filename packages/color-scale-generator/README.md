# color-scale-generator

Generate a full 14-token color scale (`bg-document` → `color-document`) from a single seed color, using lightness / chroma / hue masks extracted from the [NL Design System Start theme](https://github.com/nl-design-system/themes/tree/main/packages/start-design-tokens) (`common.basis.color`).

## Installation

```sh
npm install @nl-design-system-community/color-scale-generator
```

## Usage

```ts
import { generateScale, oklchToHex } from '@nl-design-system-community/color-scale-generator';

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

<details>
<summary>Reference: actual Start theme values, WCAG vs APCA (why 30/60)</summary>

WCAG and APCA both measured against the real `@nl-design-system-unstable/start-design-tokens` colors, for every requirement pair above, across all 7 profile source groups (regular + inverse). The 30/60 targets sit comfortably under every row here, so the shipped theme still enforces clean with zero warnings; the spread also shows why a single WCAG ratio doesn't work — e.g. `color-default vs bg-default` needs ~Lc 75 regular but ~Lc 88 inverse to hit the same WCAG 4.5:1, a polarity asymmetry WCAG's symmetric ratio hides.

| group             | kind   | token vs bg                  | fg / bg hex       | WCAG  | APCA Lc |
| ----------------- | ------ | ---------------------------- | ----------------- | ----- | ------- |
| accent-1          | border | border-default vs bg-default | #5c89be / #ecf1f7 | 3.20  | 55.1    |
| accent-1          | border | border-hover vs bg-hover     | #4e7fb8 / #e4ecf4 | 3.48  | 56.6    |
| accent-1          | border | border-active vs bg-active   | #3f74b2 / #dde6f1 | 3.83  | 57.9    |
| accent-1          | text   | color-default vs bg-default  | #1b59a4 / #ecf1f7 | 6.14  | 75.0    |
| accent-1          | text   | color-hover vs bg-hover      | #04499a / #e4ecf4 | 7.26  | 77.1    |
| accent-1          | text   | color-active vs bg-active    | #003b81 / #dde6f1 | 8.58  | 79.0    |
| accent-1          | text   | color-subtle vs bg-subtle    | #2964aa / #f4f7fa | 5.58  | 74.6    |
| accent-1          | text   | color-document vs bg-subtle  | #001b3c / #f4f7fa | 15.98 | 98.7    |
| accent-1-inverse  | border | border-default vs bg-default | #b8cbe2 / #1b59a4 | 4.21  | -54.7   |
| accent-1-inverse  | border | border-hover vs bg-hover     | #c6d6e8 / #04499a | 5.85  | -66.3   |
| accent-1-inverse  | border | border-active vs bg-active   | #d5e1ee / #003b81 | 8.15  | -78.0   |
| accent-1-inverse  | text   | color-default vs bg-default  | #ffffff / #1b59a4 | 6.97  | -88.7   |
| accent-1-inverse  | text   | color-hover vs bg-hover      | #ffffff / #04499a | 8.66  | -93.6   |
| accent-1-inverse  | text   | color-active vs bg-active    | #ffffff / #003b81 | 10.81 | -98.3   |
| accent-1-inverse  | text   | color-subtle vs bg-subtle    | #b0c6df / #001b3c | 9.81  | -69.0   |
| accent-1-inverse  | text   | color-document vs bg-subtle  | #ffffff / #001b3c | 17.18 | -106.2  |
| default           | border | border-default vs bg-default | #868686 / #f1f1f1 | 3.22  | 55.7    |
| default           | border | border-hover vs bg-hover     | #7c7c7c / #ebebeb | 3.50  | 56.9    |
| default           | border | border-active vs bg-active   | #727272 / #e5e5e5 | 3.82  | 58.1    |
| default           | text   | color-default vs bg-default  | #595959 / #f1f1f1 | 6.20  | 76.0    |
| default           | text   | color-hover vs bg-hover      | #4b4b4b / #ebebeb | 7.32  | 78.1    |
| default           | text   | color-active vs bg-active    | #3e3e3e / #e5e5e5 | 8.49  | 79.5    |
| default           | text   | color-subtle vs bg-subtle    | #636363 / #f6f6f6 | 5.56  | 74.7    |
| default           | text   | color-document vs bg-subtle  | #1b1b1b / #f6f6f6 | 15.94 | 98.7    |
| default-inverse   | border | border-default vs bg-default | #c9c9c9 / #595959 | 4.23  | -55.2   |
| default-inverse   | border | border-hover vs bg-hover     | #d4d4d4 / #4b4b4b | 5.89  | -67.0   |
| default-inverse   | border | border-active vs bg-active   | #dfdfdf / #3e3e3e | 8.03  | -78.1   |
| default-inverse   | text   | color-default vs bg-default  | #ffffff / #595959 | 7.00  | -89.2   |
| default-inverse   | text   | color-hover vs bg-hover      | #ffffff / #4b4b4b | 8.72  | -94.4   |
| default-inverse   | text   | color-active vs bg-active    | #ffffff / #3e3e3e | 10.70 | -98.7   |
| default-inverse   | text   | color-subtle vs bg-subtle    | #c4c4c4 / #1b1b1b | 9.88  | -69.5   |
| default-inverse   | text   | color-document vs bg-subtle  | #ffffff / #1b1b1b | 17.22 | -106.4  |
| disabled          | border | border-default vs bg-default | #c4c4c4 / #f1f1f1 | 1.54  | 23.4    |
| disabled          | border | border-hover vs bg-hover     | #c4c4c4 / #f1f1f1 | 1.54  | 23.4    |
| disabled          | border | border-active vs bg-active   | #c4c4c4 / #f1f1f1 | 1.54  | 23.4    |
| disabled          | text   | color-default vs bg-default  | #636363 / #f1f1f1 | 5.32  | 71.7    |
| disabled          | text   | color-hover vs bg-hover      | #636363 / #f1f1f1 | 5.32  | 71.7    |
| disabled          | text   | color-active vs bg-active    | #636363 / #f1f1f1 | 5.32  | 71.7    |
| disabled          | text   | color-subtle vs bg-subtle    | #636363 / #f1f1f1 | 5.32  | 71.7    |
| disabled          | text   | color-document vs bg-subtle  | #636363 / #f1f1f1 | 5.32  | 71.7    |
| disabled-inverse  | border | border-default vs bg-default | #474747 / #595959 | 1.33  | 0.0     |
| disabled-inverse  | border | border-hover vs bg-hover     | #474747 / #595959 | 1.33  | 0.0     |
| disabled-inverse  | border | border-active vs bg-active   | #474747 / #595959 | 1.33  | 0.0     |
| disabled-inverse  | text   | color-default vs bg-default  | #c4c4c4 / #595959 | 4.02  | -52.3   |
| disabled-inverse  | text   | color-hover vs bg-hover      | #c4c4c4 / #595959 | 4.02  | -52.3   |
| disabled-inverse  | text   | color-active vs bg-active    | #c4c4c4 / #595959 | 4.02  | -52.3   |
| disabled-inverse  | text   | color-subtle vs bg-subtle    | #c4c4c4 / #595959 | 4.02  | -52.3   |
| disabled-inverse  | text   | color-document vs bg-subtle  | #c4c4c4 / #595959 | 4.02  | -52.3   |
| highlight         | border | border-default vs bg-default | #9e8418 / #fff1bb | 3.22  | 55.4    |
| highlight         | border | border-hover vs bg-hover     | #927a18 / #ffeb9d | 3.51  | 56.9    |
| highlight         | border | border-active vs bg-active   | #867018 / #ffe57c | 3.86  | 58.4    |
| highlight         | text   | color-default vs bg-default  | #695817 / #fff1bb | 6.17  | 75.6    |
| highlight         | text   | color-hover vs bg-hover      | #594a16 / #ffeb9d | 7.29  | 77.9    |
| highlight         | text   | color-active vs bg-active    | #483d14 / #ffe57c | 8.58  | 79.9    |
| highlight         | text   | color-subtle vs bg-subtle    | #756218 / #fff7d7 | 5.56  | 74.7    |
| highlight         | text   | color-document vs bg-subtle  | #201b0c / #fff7d7 | 15.97 | 99.0    |
| highlight-inverse | border | border-default vs bg-default | #ecc609 / #695817 | 4.20  | -55.1   |
| highlight-inverse | border | border-hover vs bg-hover     | #f9d103 / #594a16 | 5.86  | -67.0   |
| highlight-inverse | border | border-active vs bg-active   | #ffde56 / #483d14 | 8.11  | -78.6   |
| highlight-inverse | text   | color-default vs bg-default  | #ffffff / #695817 | 6.98  | -89.0   |
| highlight-inverse | text   | color-hover vs bg-hover      | #ffffff / #594a16 | 8.69  | -94.2   |
| highlight-inverse | text   | color-active vs bg-active    | #ffffff / #483d14 | 10.75 | -98.8   |
| highlight-inverse | text   | color-subtle vs bg-subtle    | #e6c10c / #201b0c | 9.81  | -69.5   |
| highlight-inverse | text   | color-document vs bg-subtle  | #ffffff / #201b0c | 17.16 | -106.4  |
| negative          | border | border-default vs bg-default | #f14848 / #feeded | 3.22  | 54.3    |
| negative          | border | border-hover vs bg-hover     | #ef2929 / #fde6e6 | 3.51  | 55.1    |
| negative          | border | border-active vs bg-active   | #e60000 / #fddede | 3.82  | 55.0    |
| negative          | text   | color-default vs bg-default  | #b70000 / #feeded | 6.16  | 72.9    |
| negative          | text   | color-hover vs bg-hover      | #9c0000 / #fde6e6 | 7.31  | 75.5    |
| negative          | text   | color-active vs bg-active    | #930000 / #fddede | 7.44  | 73.8    |
| negative          | text   | color-subtle vs bg-subtle    | #ca0000 / #fef4f4 | 5.54  | 71.7    |
| negative          | text   | color-document vs bg-subtle  | #410000 / #fef4f4 | 15.89 | 97.6    |
| negative-inverse  | border | border-default vs bg-default | #fab9b9 / #b70000 | 4.22  | -52.7   |
| negative-inverse  | border | border-hover vs bg-hover     | #fbc8c8 / #9c0000 | 5.88  | -64.7   |
| negative-inverse  | border | border-active vs bg-active   | #fcd7d7 / #820000 | 8.13  | -76.5   |
| negative-inverse  | text   | color-default vs bg-default  | #ffffff / #b70000 | 6.97  | -86.5   |
| negative-inverse  | text   | color-hover vs bg-hover      | #ffffff / #9c0000 | 8.70  | -91.9   |
| negative-inverse  | text   | color-active vs bg-active    | #ffffff / #820000 | 10.77 | -96.7   |
| negative-inverse  | text   | color-subtle vs bg-subtle    | #f9b1b1 / #410000 | 9.76  | -68.2   |
| negative-inverse  | text   | color-document vs bg-subtle  | #ffffff / #410000 | 17.15 | -105.4  |
| positive          | border | border-default vs bg-default | #009b3a / #e4f5ea | 3.23  | 54.9    |
| positive          | border | border-hover vs bg-hover     | #009036 / #d9f1e2 | 3.50  | 56.2    |
| positive          | border | border-active vs bg-active   | #008432 / #ceedd9 | 3.85  | 57.8    |
| positive          | text   | color-default vs bg-default  | #006827 / #e4f5ea | 6.16  | 75.1    |
| positive          | text   | color-hover vs bg-hover      | #005821 / #d9f1e2 | 7.29  | 77.4    |
| positive          | text   | color-active vs bg-active    | #00481b / #ceedd9 | 8.62  | 79.4    |
| positive          | text   | color-subtle vs bg-subtle    | #00732b / #eff9f3 | 5.60  | 74.4    |
| positive          | text   | color-document vs bg-subtle  | #00210c / #eff9f3 | 15.96 | 98.7    |
| positive-inverse  | border | border-default vs bg-default | #96d8ae / #006827 | 4.23  | -54.9   |
| positive-inverse  | border | border-hover vs bg-hover     | #ace0c0 / #005821 | 5.86  | -66.5   |
| positive-inverse  | border | border-active vs bg-active   | #c3e9d1 / #00481b | 8.18  | -78.5   |
| positive-inverse  | text   | color-default vs bg-default  | #ffffff / #006827 | 6.98  | -88.5   |
| positive-inverse  | text   | color-hover vs bg-hover      | #ffffff / #005821 | 8.69  | -93.8   |
| positive-inverse  | text   | color-active vs bg-active    | #ffffff / #00481b | 10.81 | -98.5   |
| positive-inverse  | text   | color-subtle vs bg-subtle    | #8ad3a6 / #00210c | 9.77  | -69.0   |
| positive-inverse  | text   | color-document vs bg-subtle  | #ffffff / #00210c | 17.17 | -106.2  |
| warning           | border | border-default vs bg-default | #c8700e / #ffeedd | 3.21  | 54.9    |
| warning           | border | border-hover vs bg-hover     | #b86810 / #ffe7d0 | 3.50  | 56.4    |
| warning           | border | border-active vs bg-active   | #a96011 / #ffe0c2 | 3.82  | 57.7    |
| warning           | text   | color-default vs bg-default  | #844c12 / #ffeedd | 6.13  | 75.1    |
| warning           | text   | color-hover vs bg-hover      | #6f4012 / #ffe7d0 | 7.28  | 77.6    |
| warning           | text   | color-active vs bg-active    | #5a3511 / #ffe0c2 | 8.55  | 79.5    |
| warning           | text   | color-subtle vs bg-subtle    | #935412 / #fff5eb | 5.55  | 74.4    |
| warning           | text   | color-document vs bg-subtle  | #27190a / #fff5eb | 15.87 | 98.8    |
| warning-inverse   | border | border-default vs bg-default | #ffbc7a / #844c12 | 4.21  | -55.1   |
| warning-inverse   | border | border-hover vs bg-hover     | #ffcb98 / #6f4012 | 5.89  | -67.1   |
| warning-inverse   | border | border-active vs bg-active   | #ffd9b4 / #5a3511 | 8.11  | -78.4   |
| warning-inverse   | text   | color-default vs bg-default  | #ffffff / #844c12 | 6.95  | -88.7   |
| warning-inverse   | text   | color-hover vs bg-hover      | #ffffff / #6f4012 | 8.68  | -94.0   |
| warning-inverse   | text   | color-active vs bg-active    | #ffffff / #5a3511 | 10.76 | -98.6   |
| warning-inverse   | text   | color-subtle vs bg-subtle    | #ffb46b / #27190a | 9.75  | -69.3   |
| warning-inverse   | text   | color-document vs bg-subtle  | #ffffff / #27190a | 17.08 | -106.3  |

30/60 aren't back-solved from this table — they're APCA's own published minimum tiers (non-text-UI / minimum-fluent-body-text). The table just confirms the real theme clears them with headroom.

</details>

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
