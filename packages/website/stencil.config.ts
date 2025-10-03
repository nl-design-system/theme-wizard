import type { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'website',
  tsconfig: './tsconfig.stencil.json',
  globalStyle: 'src/styles/design-tokens.css',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: './loader',
    },
  ],
};
