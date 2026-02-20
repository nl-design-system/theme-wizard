import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        // Temporary workaround to fix coverage reporting for this file,
        // there's a bug in coverage reporting and we value type-safety more than 100% coverage
        'src/remove-non-token-properties.ts',
        'src/resolve-refs.ts',
        'src/upgrade-legacy-tokens.ts',
      ],
      provider: 'v8',
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  },
});
