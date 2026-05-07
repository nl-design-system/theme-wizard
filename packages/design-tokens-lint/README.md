# Design Tokens lint

Check your ...

Example usage:

```shell
design-tokens-lint src/tokens.json
```

When using Tokens Studio, you need to exclude the parent keys where the token sets are defined.

```shell
design-tokens-lint --exclude-parent-keys figma/figma.tokens.json
```

You can combine multiple files in one design tokens JSON tree:

```shell
design-tokens-lint --multiple src/brand.tokens.json src/common.tokens.json src/component.tokens.json
```
