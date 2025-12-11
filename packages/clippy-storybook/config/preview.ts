import type { Preview } from '@storybook/web-components-vite';
// import { StoryRootDecorator } from '@nl-design-system-candidate/storybook-shared/src/StoryRootDecorator';
import { formatHtml } from '@rijkshuisstijl-community/storybook-tooling/formatHtml';
// import { DocsPage } from '../src/DocsPage';
import '@nl-design-system-community/theme-wizard-app/theme.css';
import '@nl-design-system-community/ma-design-tokens/dist/theme.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: false },
    docs: {
      canvas: {
        sourceState: 'shown',
      },
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
