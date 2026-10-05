import minorConfig from './.ncurc.minor.mjs';

export default {
  ...minorConfig,
  reject: [
    ...minorConfig.reject,
    // @types/node is kept in line with the node version in .nvmrc and package.json#engines.node
    '@types/node',
    '@types/react',
    '@types/react-dom',
    'react',
    'react-dom',
    'style-dictionary',
    'storybook',
    '@storybook/*',
    '@etchteam/storybook-addon-status',
    '@whitespace/storybook-addon-html',
    'vite',
    // Many community packages are not ready for TS 7 yet
    'typescript',
  ],
  target: 'latest',
};
