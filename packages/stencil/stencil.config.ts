import type { Config } from '@stencil/core';

export const config: Config = {
  globalStyle: 'src/styles/theme.css',
  namespace: 'theme-wizard-website',
  outputTargets: [
    {
      esmLoaderPath: '../loader',
      type: 'dist',
    },
    {
      dir: '../theme-wizard-website/public',
      serviceWorker: null,
      type: 'www',
    },
  ],
  srcDir: 'src/',
};
