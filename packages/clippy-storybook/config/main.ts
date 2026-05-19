import type { StorybookConfig } from '@storybook/web-components-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs', '@whitespace/storybook-addon-html'],
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
  docs: {
    defaultName: 'Documentatie',
  },
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  stories: ['../src/**/*stories.@(ts|tsx)', '../docs/**/*.mdx'],
  typescript: {
    // reactDocgen: 'react-docgen-typescript',
    // reactDocgenTypescriptOptions: {
    //   // Only scan component files in the patterns and templates folder
    //   include: ['../src/pattterns/**', '../src/templates/**'],
    // },
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      oxc: {
        // theme-wizard-templates extends astro/tsconfigs/base which sets jsx: "preserve".
        // Vite 8's native OXC transform reads that tsconfig, preserves JSX, and then
        // rolldown fails to parse the preserved JSX output. Setting jsx explicitly here
        // overrides the tsconfig setting for the Storybook build.
        jsx: {
          importSource: 'react',
          runtime: 'automatic',
        },
      },
    }),
};

export default config;
