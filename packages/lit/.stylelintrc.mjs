export default {
  extends: ['../../.stylelintrc.json'],
  overrides: [
    {
      customSyntax: 'postcss-lit',
      files: ['**/*.css.ts'],
    },
  ],
};
