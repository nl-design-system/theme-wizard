import type { Meta, StoryObj } from '@storybook/react-vite';
import codeMeta from '@nl-design-system-candidate/code-docs/stories/code.react.meta';
import * as Stories from '@nl-design-system-candidate/code-docs/stories/code.stories';
// import packageJSON from '../../components-react/code-react/package.json';
import { Code as CodeComponent, type CodeProps } from '@nl-design-system-candidate/code-react';
// import { getExternalLinks } from '../src/helpers/external-links';
import tokens from '@nl-design-system-candidate/code-tokens';

// const externalLinks = getExternalLinks(
//   'https://nldesignsystem.nl/button',
//   packageJSON.homepage,
//   'https://www.npmjs.com/package/@nl-design-system-candidate/button-react',
// );

const meta = {
  ...codeMeta,
  id: 'code',
  parameters: { tokens },
  // ...externalLinks,
  title: 'React Componenten/Code',
} satisfies Meta<typeof CodeComponent>;

export default meta;

type Story = StoryObj<CodeProps>;
export const Code: Story = Stories.Code;

// copied from https://github.com/frameless/candidate/blob/main/packages/docs/code-docs/stories/code.stories.tsx
export const DesignCodeTypography: Story = {
  name: 'Design: Code Typography',
  args: {
    children: `import { Code } from '@nl-design-system-candidate/code-react';`,
  },
  parameters: {
    designStory: true,
    tokens: {
      nl: {
        code: {
          'font-family': {
            $value: '',
          },
          'font-size': {
            $value: '',
          },
        },
      },
    },
  },
};

export const DesignCodeColor: Story = {
  name: 'Design: Code Color',
  args: {
    children: `import { Code } from '@nl-design-system-candidate/code-react';`,
  },
  parameters: {
    designStory: true,
    tokens: {
      nl: {
        code: {
          'background-color': {
            $value: '',
          },
          color: {
            $value: '',
          },
        },
      },
    },
  },
};
