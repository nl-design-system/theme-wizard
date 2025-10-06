import type { Config } from '@stencil/core';

export const config: Config = {
  globalStyle: 'src/styles/theme.css',
  namespace: 'website',
  outputTargets: [
    {
      esmLoaderPath: '../loader',
      type: 'dist',
    },
    {
      dir: '../website/public',
      serviceWorker: null,
      type: 'www',
    },
  ],
  srcDir: 'src/',
};
