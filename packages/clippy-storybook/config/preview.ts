import type { Preview } from '@storybook/web-components-vite';
import type { StorybookHelpersOptions } from '@wc-toolkit/storybook-helpers';
import customElementsManifest from '@nl-design-system-community/clippy-components/custom-elements.json' with { type: 'json' };
// import { DocsPage } from '../src/DocsPage';
import '@nl-design-system-community/theme-wizard-app/theme.css';
// import { StoryRootDecorator } from '@nl-design-system-candidate/storybook-shared/src/StoryRootDecorator';
import { formatHtml } from '@rijkshuisstijl-community/storybook-tooling/formatHtml';
import { setCustomElementsManifest } from '@storybook/web-components-vite';
import { setStorybookHelpersConfig } from '@wc-toolkit/storybook-helpers';
import { addThemeClasses } from './decorators';
import { THEMES } from './themes/theme-data';

setCustomElementsManifest(customElementsManifest);

const wcToolkitStorybookHelpersOptions: StorybookHelpersOptions = {};
setStorybookHelpersConfig(wcToolkitStorybookHelpersOptions);

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
    controls: { expanded: true },
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
