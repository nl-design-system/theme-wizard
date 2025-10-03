import type { Config } from '@stencil/core';

export const config: Config = {
  globalStyle: 'src/styles/design-tokens.css',
  namespace: 'website',
  outputTargets: [
    {
      dir: 'build',
      esmLoaderPath: '../build/loader',
      type: 'dist',
    },
  ],
  tsconfig: './tsconfig.stencil.json',
};
