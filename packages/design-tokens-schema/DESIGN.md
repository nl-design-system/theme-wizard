# design-tokens-schema — API & Folder Design

## Primary Use Case

Developer has old `tokens.json`. Wants three things:

1. **Upgrade** — bring tokens to current DTCG / NL Design System format
2. **Complete** — fill gaps: missing basis slots, missing token subtypes
3. **Validate** — check compliance with NL Design System rules

Primary path:

```
old tokens.json  →  normalize  →  complete  →  validate  →  compliant tokens.json
```

---

## Mental Model

| Concern       | Input → Output                   | Public API? |
| ------------- | -------------------------------- | ----------- |
| **normalize** | tokens → tokens (canonical form) | Yes         |
| **complete**  | tokens → tokens (gaps filled)    | Yes         |
| **validate**  | tokens → issues[]                | Yes         |
| suggest       | tokens → recommendations[]       | Internal    |

Rules:
- `normalize` = mechanical transforms: merge files, upgrade legacy format, strip junk. No semantic analysis.
- `complete` = fill what is absent: missing basis token slots, missing subtype annotations. Input should already be normalized.
- `validate` = pure assertion, returns issues[], never throws. Safe at any stage.
- `suggest` — built, not yet exported. Promoted when there is a real consumer.

---

## Folder Structure

```
src/
├── tokens/                     # Token type schemas (Zod) — unchanged
│   ├── base-token.ts
│   ├── color-token.ts
│   ├── dimension-token.ts
│   ├── fontfamily-token.ts
│   ├── number-token.ts
│   └── token-reference.ts
│
├── normalize/                  # PUBLIC — merge, upgrade, strip
│   ├── index.ts                # normalize(), NormalizeOptions + individual exports
│   ├── merge.ts                # mergeTokens()
│   ├── upgrade.ts              # upgradeTokens(), UpgradeOptions
│   ├── strip.ts                # removeNonTokenProperties()
│   ├── pipe.ts                 # pipe() — internal
│   └── types.ts                # DTCGType, Token, Group, TokenFile, isToken, isGroup, walkTokens
│
├── complete/                   # PUBLIC — fill gaps in token set
│   ├── index.ts                # completeTokens(), CompleteOptions
│   ├── sub-types.ts            # assignSubTypes()
│   └── fill-basis.ts           # fillBasisTokensFrom(), applyMissingBasisTokens()
│
├── validate/                   # PUBLIC — schema + rule validation
│   ├── index.ts
│   ├── schemas.ts              # ThemeSchema, StrictThemeSchema, BasisTokensSchema
│   ├── refs.ts                 # validateRefs()
│   ├── rules.ts                # validateFontSize(), validateMinLineHeight()
│   └── issues.ts               # InvalidRefIssue, MinFontSizeIssue, LineHeightUnitIssue
│
├── suggest/                    # INTERNAL — not exported yet
│   ├── index.ts                # suggestBasisReuse()
│   └── reuse-basis.ts          # findBasisTokenCandidates(), applySuggestions(), reUseBasisTokens()
│
├── utils/                      # INTERNAL — never exported
│   ├── walker.ts               # walkObject(), walkColors(), walkDimensions()
│   ├── extensions.ts           # setExtension()
│   └── resolve-refs.ts         # resolveRef(), resolveRefs()
│
└── index.ts                    # Re-exports normalize + complete + validate
```

---

## Package Exports (package.json)

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./normalize": {
      "import": "./dist/normalize/index.js",
      "types": "./dist/normalize/index.d.ts"
    },
    "./complete": {
      "import": "./dist/complete/index.js",
      "types": "./dist/complete/index.d.ts"
    },
    "./validate": {
      "import": "./dist/validate/index.js",
      "types": "./dist/validate/index.d.ts"
    }
  }
}
```

`suggest` has no sub-path export. Code lives in `src/` for internal CLI use. Promoted when a consumer needs it.

---

## Public API

### `design-tokens-schema` (main entry)

```ts
export * from './tokens/base-token';
export * from './tokens/color-token';
export * from './tokens/dimension-token';
export * from './tokens/fontfamily-token';
export * from './tokens/number-token';
export * from './tokens/token-reference';
export * from './normalize';
export * from './complete';
export * from './validate';
// NOT re-exported: suggest, utils
```

### `design-tokens-schema/normalize`

```ts
export type { DTCGType, Token, Group, TokenFile };
export { isToken, isGroup, walkTokens };

// Orchestrator — merge + optional transforms
export function normalize(inputs: TokenFile[], options?: NormalizeOptions): TokenFile;
export interface NormalizeOptions {
  upgrade?: boolean | UpgradeOptions;
  strip?: boolean;
}

// Composable individual transforms
export function mergeTokens(...inputs: TokenFile[]): TokenFile;
export function upgradeTokens(tokens: TokenFile, options?: UpgradeOptions): TokenFile;
export function removeNonTokenProperties(tokens: TokenFile): TokenFile;
export type { UpgradeOptions };
```

### `design-tokens-schema/complete`

```ts
// Orchestrator — fill all gaps in one call
export function completeTokens(tokens: TokenFile, options?: CompleteOptions): TokenFile;
export interface CompleteOptions {
  subtypes?: boolean;             // add nl.nldesignsystem.token-subtype extensions
  fillBasis?: { source: TokenFile }; // fill missing basis slots from a reference file
}

// Composable individual fills
export function assignSubTypes(tokens: TokenFile): TokenFile;
export function fillBasisTokensFrom(tokens: TokenFile, source: TokenFile): TokenFile;
export function applyMissingBasisTokens(tokens: TokenFile, missing: MissingBasisToken[]): TokenFile;
export function findMissingBasisTokens(tokens: TokenFile): MissingBasisToken[];

// Types
export type { SubType, MissingBasisToken };
export { EXTENSION_TOKEN_SUBTYPE };
```

`findMissingBasisTokens` lives here (not in suggest) because it answers "what's missing from my set" — a prerequisite to filling, not a suggestion.

### `design-tokens-schema/validate`

```ts
// Zod schemas — parse + validate in one call
export { ThemeSchema, StrictThemeSchema, BasisTokensSchema };

// Functional validators — return issues[], never throw
export function validateRefs(tokens: TokenFile): InvalidRefIssue[];
export function validateFontSize(tokens: TokenFile): MinFontSizeIssue[];
export function validateLineHeight(tokens: TokenFile): LineHeightUnitIssue[];

// Issue types
export type { InvalidRefIssue, MinFontSizeIssue, LineHeightUnitIssue };
```

---

## CLI

Binary: `dtcg`. Three primary subcommands matching the three public concerns.

```
dtcg <command> [options] <file> [files...]

Commands:
  normalize   Merge, upgrade, and strip tokens to canonical form
  complete    Fill gaps: missing basis slots, missing token subtypes
  validate    Check tokens for schema/ref/rule compliance

Global options:
  -o, --out <file>   Write output to file (default: stdout)
  --compact          Minified JSON output
  -h, --help         Show help
```

### `dtcg normalize`

```sh
# Upgrade single file
dtcg normalize --upgrade tokens.json

# Merge multiple files + upgrade
dtcg normalize --upgrade button.json link.json heading.json -o out.json

# Strip Style Dictionary metadata
dtcg normalize --strip tokens.json

# Full normalize: merge + upgrade + strip
dtcg normalize --upgrade --strip button.json link.json -o out.json

# Preview what upgrade changes (dry-run, no output written)
dtcg normalize --upgrade --dry-run tokens.json
```

Upgrade transforms:
- `value` → `$value`, `type` → `$type`
- `spacing` / `fontSize` / `lineHeight` → `dimension`
- dimension strings (`"12px"`) → `{ value: 12, unit: "px" }`
- font-family strings → arrays
- `comment` / `description` → `$description`
- strips Style Dictionary metadata (`filePath`, `isSource`, etc.)

### `dtcg complete`

```sh
# Annotate tokens with token-subtype extension
dtcg complete --subtypes tokens.json

# Fill missing basis token slots from a reference file
dtcg complete --fill-basis-from basis-reference.json tokens.json

# Both at once
dtcg complete --subtypes --fill-basis-from basis-reference.json tokens.json -o out.json

# Report which basis slots are absent (no output file — inspection only)
dtcg complete --report-missing tokens.json
```

`--report-missing` output:
```
✦  2 missing basis token(s)

  basis.border-radius.sm   (dimension)
  basis.color.neutral-50   (color)
```

`--report-missing --json`:
```json
[
  { "path": "basis.border-radius.sm", "$type": "dimension" },
  { "path": "basis.color.neutral-50", "$type": "color" }
]
```

### `dtcg validate`

Exits 0 = no issues, 1 = issues found. Issues always to stderr.

```sh
# Full validation (refs + font-size + line-height)
dtcg validate tokens.json

# Strict: all rules including contrast
dtcg validate --strict tokens.json

# Machine-readable output
dtcg validate --json tokens.json
```

Default output:
```
✖  2 issues found

  [invalid-ref]    button.color.background → {basis.color.brand-500}: not found
  [min-font-size]  nl-heading.font-size: 10px is below minimum (12px)
```

### Common workflows

```sh
# Full path: upgrade → complete → validate
dtcg normalize --upgrade tokens.json \
  | dtcg complete --subtypes \
  | dtcg validate

# Write intermediate files
dtcg normalize --upgrade tokens.json -o normalized.json
dtcg complete --subtypes --fill-basis-from basis.json normalized.json -o complete.json
dtcg validate complete.json
```

Status/progress to stderr; JSON/TokenFile to stdout. Pipe-safe.

---

## What Changes From Current State

| Current | New |
|---------|-----|
| `src/normalize/basis.ts` (fill half) | → `src/complete/fill-basis.ts` |
| `src/normalize/basis.ts` (suggest half) | → `src/suggest/reuse-basis.ts` (internal) |
| `src/normalize/sub-types.ts` | → `src/complete/sub-types.ts` |
| `NormalizeOptions.reuseBasis` | Removed from public options; internal only |
| `NormalizeOptions.assignSubTypes` | Removed from public options; moved to `completeTokens()` |
| `src/theme.ts` | Split: schemas → `validate/schemas.ts`, utils → `utils/` |
| `src/walker.ts`, `src/extensions.ts`, `src/resolve-refs.ts` | → `utils/` (never exported) |
| `src/validation-issue.ts`, `src/validations.ts` | → `validate/` |
| `dtcg-tools` (flat flags) | `dtcg` with `normalize` / `complete` / `validate` subcommands |

Backward compat: main entry consumers keep working — `normalize`, `upgradeTokens`, `mergeTokens`, `ThemeSchema`, token types all still exported. `reuseBasis` / `assignSubTypes` options on `normalize()` removed (were opt-in, not defaults).

---

## Future: Promoting suggest

When a real consumer appears:
1. Add `./suggest` to `package.json` exports
2. Re-export from `src/index.ts`
3. Add `dtcg suggest` subcommand (or `--experimental` flag first)

No structural work needed — code already in `src/suggest/`.
