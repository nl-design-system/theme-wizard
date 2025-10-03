import type { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'website',
  tsconfig: './tsconfig.stencil.json',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: './loader',
    },
  ],
};
