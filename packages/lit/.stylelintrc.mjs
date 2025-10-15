export default {
  extends: ['../../.stylelintrc.json'],
  ignoreFiles: ['**/*.ts', '!**/*.css.ts'],
  overrides: [
    {
      customSyntax: 'postcss-lit',
      files: ['**/*.css.ts'],
    },
  ],
};
