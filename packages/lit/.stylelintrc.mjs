export default {
  extends: ['../../.stylelintrc.json'],
  ignoreFiles: ['**/*', '!**/*.css.ts', '!**/styles.ts'],
  overrides: [
    {
      customSyntax: 'postcss-lit',
      files: ['**/*.css.ts', '**/styles.ts'],
    },
  ],
};
