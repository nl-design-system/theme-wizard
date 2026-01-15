export default {
  extends: ['../../.stylelintrc.json'],
  ignoreFiles: ['**/*', '!**/*.ts'],
  rules: {
    'custom-property-pattern': '^_?(ams|basis|nl|clippy|denhaag|utrecht|todo)-[a-z0-9-]+$',
    'keyframes-name-pattern': '^(ams|basis|nl|clippy|denhaag|utrecht|todo)-[a-z0-9-]+$',
    'scss/dollar-variable-pattern': '^(ams|basis|nl|clippy|denhaag|utrecht|todo)-[a-z0-9-]+$',
    'scss/percent-placeholder-pattern': '^(ams|basis|nl|clippy|denhaag|utrecht|todo)-[a-z0-9-]+$',
    'selector-class-pattern': '^(ams|basis|nl|clippy|denhaag|utrecht|todo|wizard)-[a-z0-9_-]+$',
  },
  overrides: [
    {
      customSyntax: 'postcss-lit',
      files: ['**/*.ts'],
    },
  ],
};
