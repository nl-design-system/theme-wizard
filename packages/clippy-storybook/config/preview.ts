import type { Preview } from '@storybook/web-components-vite';
// import { StoryRootDecorator } from '@nl-design-system-candidate/storybook-shared/src/StoryRootDecorator';
import { formatHtml } from '@rijkshuisstijl-community/storybook-tooling/formatHtml';
// import { DocsPage } from '../src/DocsPage';
import '@nl-design-system-community/theme-wizard-app';
import '@nl-design-system-community/theme-wizard-templates/theme.css';
import '@nl-design-system-community/ma-design-tokens/dist/theme.css';
import '@utrecht/component-library-css';
import { html } from 'lit';

const preview: Preview = {
  parameters: {
    controls: { expanded: false },
    docs: {
      canvas: {
        sourceState: 'shown',
      },
      codePanel: true,
    },
    // @whitespace/storybook-addon-html
    html: {
      root: '#storybook-root',
      transform: formatHtml,
    },
  },
  tags: [
    // 'autodocs', // enable automatic docs generation for all stories
  ],
};

export default preview;
