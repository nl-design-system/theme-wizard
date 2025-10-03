import type { Config } from '@stencil/core';

export const config: Config = {
  globalStyle: 'src/styles/design-tokens.css',
  namespace: 'website',
  outputTargets: [
    {
      esmLoaderPath: '../build/loader',
      type: 'dist',
      dir: 'build',
    },
  ],
  tsconfig: './tsconfig.stencil.json',
};
