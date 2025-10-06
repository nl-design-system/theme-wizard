import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        branches: 85,
        functions: 60,
        lines: 36,
        statements: 36,
      },
    },
  },
});
