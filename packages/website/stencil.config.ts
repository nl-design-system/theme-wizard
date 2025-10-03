import type { Config } from '@stencil/core';

export const config: Config = {
  globalStyle: 'src/styles/design-tokens.css',
  srcDir: 'src/',
  namespace: 'website',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'www',
      dir: '../website/public',
      serviceWorker: null,
    },
  ],
  tsconfig: './tsconfig.stencil.json',
};
