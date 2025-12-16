import type { Preview } from '@storybook/web-components-vite';
// import { StoryRootDecorator } from '@nl-design-system-candidate/storybook-shared/src/StoryRootDecorator';
import { formatHtml } from '@rijkshuisstijl-community/storybook-tooling/formatHtml';
// import { DocsPage } from '../src/DocsPage';
import '@nl-design-system-community/ma-design-tokens/dist/theme.css';

const preview: Preview = {
  // decorators: [StoryRootDecorator],
  initialGlobals: {
    storyRootClassname: 'ma-theme',
  },
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
      root: '[data-story-root]',
      transform: formatHtml,
    },
  },
  tags: [
    // 'autodocs', // enable automatic docs generation for all stories
  ],
};

export default preview;
