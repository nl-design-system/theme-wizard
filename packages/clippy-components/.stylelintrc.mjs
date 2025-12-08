export default {
  extends: ['../../.stylelintrc.json'],
  ignoreFiles: ['**/*', '!**/*.ts'],
  overrides: [
    {
      customSyntax: 'postcss-lit',
      files: ['**/*.ts'],
    },
  ],
};
