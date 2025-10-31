export default {
  extends: ['../../.stylelintrc.json'],
  ignoreFiles: ['**/*', '!**/*.ts'],
  rules: {
    'custom-property-pattern': '^_?(basis|theme|denhaag|utrecht|todo)-[a-z0-9-]+$',
    'keyframes-name-pattern': '^(basis|theme|utrecht|todo)-[a-z0-9-]+$',
    'scss/dollar-variable-pattern': '^(basis|theme|utrecht|todo)-[a-z0-9-]+$',
    'scss/percent-placeholder-pattern': '^(basis|theme|utrecht|todo)-[a-z0-9-]+$',
    'selector-class-pattern': '^(basis|theme|denhaag|utrecht|todo)-[a-z0-9_-]+$',
  },
  overrides: [
    {
      customSyntax: 'postcss-lit',
      files: ['**/*.ts'],
    },
  ],
};
