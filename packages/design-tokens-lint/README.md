# Design Tokens lint

Lint your Design Tokens JSON files for the NL Design System community.

## Installation

```sh
pnpm add @nl-design-system-community/design-tokens-lint
```

## Usage

```shell
design-tokens-lint [options] <file>
```

### Validate a tokens file

```shell
design-tokens-lint src/tokens.json
```

### Tokens Studio

When using Tokens Studio, exclude the parent keys where the token sets are defined:

```shell
design-tokens-lint --exclude-parent-keys figma/figma.tokens.json
```

### Write output to file

Write output to file instead of stderr/stdout. This works for both successful and failed validations. In case of success the entire tokens tree is written, including additional NL Design System extensions and upgraded tokens that match [the Design Tokens JSON format](https://www.designtokens.org/tr/2025.10/format/). In case of failure the issues are written to file as JSON.

```shell
design-tokens-lint --out result.json src/tokens.json
```

## Options

| Option                  | Description                         |
| ----------------------- | ----------------------------------- |
| `--exclude-parent-keys` | Exclude parent keys from validation |
| `--out`, `-o <file>`    | Write output JSON to file           |
| `--verbose`             | Print step-by-step progress         |
| `--debug`               | Print intermediate JSON output      |
| `--help`, `-h`          | Show help                           |

## License

EUPL-1.2
