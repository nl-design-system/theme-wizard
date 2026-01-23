import type { Preview } from '@storybook/web-components-vite';
// import { StoryRootDecorator } from '@nl-design-system-candidate/storybook-shared/src/StoryRootDecorator';
import { formatHtml } from '@rijkshuisstijl-community/storybook-tooling/formatHtml';
// import { DocsPage } from '../src/DocsPage';
import '@nl-design-system-community/theme-wizard-app/theme.css';
import { addThemeClasses } from './decorators';
import { THEMES } from './themes/theme-data';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      if (typeof document !== 'undefined') {
        const root = document.getElementById('storybook-root');
        if (root) {
          addThemeClasses(root, context);
        }
        const docs = document.getElementById('storybook-docs');
        if (docs) {
          addThemeClasses(docs, context);
        }
      }
      return Story();
    },
  ],
  globalTypes: {
    theme: {
      name: 'Thema',
      defaultValue: 'ma-theme',
      description: 'Kies een NL Design System thema',
      toolbar: {
        icon: 'paintbrush',
        items: THEMES.map(({ className, title }) => ({ title, value: className })),
        showName: true,
      },
    },
  },
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
