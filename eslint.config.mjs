import eslint from '@eslint/js';
import json from '@eslint/json';
import nlDesignSystemConfig from '@nl-design-system/eslint-config/configs/nl-design-system.config.mjs';
import vitest from '@vitest/eslint-plugin';
import prettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import react from 'eslint-plugin-react';
import eslintPluginZodX from 'eslint-plugin-zod-x';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // use the built-in globalIgnores utility to globally ignore files in the project
  globalIgnores(['**/dist/', '**/build/', '**/coverage/', '**/.astro/', '**/.vercel/']),
  {
    // Use the Perfectionist recommended/natural configuration for all possible JavaScript, TypeScript and JSX files
    name: 'perfectionist/recommended/natural',
    files: ['**/*.{js,cjs,mjs,jsx,ts,tsx}'],
    plugins: { perfectionist },
    ...perfectionist.configs['recommended/natural'],
    rules: {
      // Sort import declarations
      'perfectionist/sort-imports': [
        'error',
        {
          ignoreCase: false,
          newlinesBetween: 0,
        },
      ],
      // Sort objects sensibly, allow `id` and `name` properties to go first and `overrides` to go last
      'perfectionist/sort-objects': [
        'error',
        {
          customGroups: [
            {
              elementNamePattern: '^(?:id|name)$',
              groupName: 'first',
              selector: 'property',
            },
            {
              elementNamePattern: '^(?:overrides)$',
              groupName: 'last',
              selector: 'property',
            },
          ],
          groups: ['first', 'unknown', 'last'],
        },
      ],
    },
  },
  {
    // Use the @eslint/js recommended configuration to lint JavaScript, TypeScript, JSX and TSX files
    name: 'eslint/js/recommended',
    files: ['**/*.{js,cjs,mjs,jsx,ts,tsx}'],
    ...eslint.configs.recommended,
  },
  {
    // Use the typescript-eslint recommended configuration to lint TypeScript and TSX files
    name: 'typescript-eslint/recommended',
    extends: [tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
  },
  {
    // Use the @eslint/json recommended configuration to lint JSON files
    name: 'eslint/json/recommended',
    files: ['**/*.json'],
    language: 'json/json',
    ...json.configs.recommended,
  },
  {
    name: 'eslint-plugin-react',
    files: ['**/*.{js,cjs,mjs,jsx,ts,tsx}'],
    plugins: { react },
    ...react.configs.flat.recommended,
    ...react.configs.flat['jsx-runtime'],
  },
  {
    // NL Design System specific rules
    extends: [nlDesignSystemConfig],
    files: ['**/*.{js,cjs,mjs,jsx,ts,tsx}'],
  },
  {
    name: 'eslint-config-prettier',
    ...prettier,
  },
  {
    name: 'eslint-plugin-zod-x',
    ...eslintPluginZodX.configs.recommended,
  },
  {
    name: '@vitest',
    files: ['**/*.test.ts'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/consistent-test-filename': 'error',
      'vitest/consistent-test-it': [
        'error',
        {
          fn: 'it',
          withinDescribe: 'it',
        },
      ],
      'vitest/consistent-vitest-vi': 'error', // error when calling `vitest.mock()` instead of `vi.mock()`
      'vitest/no-focused-tests': ['warn', { fixable: false }], // Warn when using it.only(), do not auto-fix
      'vitest/prefer-each': 'error', // prefer it.each([a, b])('test %s', (thing) => {})
      'vitest/prefer-todo': 'warn', // warn when test has empty or no body
      'vitest/valid-title': ['error', { allowArguments: true }],
      'vitest/warn-todo': ['warn'],
    },
  },
]);
