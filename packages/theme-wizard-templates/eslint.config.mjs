import { defineConfig } from 'eslint/config';
import rootConfig from '../../eslint.config.mjs';

export default defineConfig([
  ...rootConfig,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'react/jsx-uses-react': 'error',
    },
  },
]);
