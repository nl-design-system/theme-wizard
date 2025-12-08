import type { StorybookConfig } from '@storybook/web-components-vite';

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
};

export default config;
