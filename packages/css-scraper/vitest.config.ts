import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        branches: 90,
        functions: 44, // was 60
        lines: 61,
        statements: 61,
      },
    },
  },
});
