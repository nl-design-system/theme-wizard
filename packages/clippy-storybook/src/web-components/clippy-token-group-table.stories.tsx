import type { TokenGroup } from '@nl-design-system-community/design-tokens-schema';
import '@nl-design-system-community/clippy-components/clippy-token-group-table';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { themeFixture } from '@nl-design-system-community/clippy-components/src/clippy-token-group-table/fixtures.js';
import readme from '@nl-design-system-community/clippy-components/src/clippy-token-group-table/README.md?raw';
import React from 'react';

type TokenGroupTableStoryArgs = {
  'actions-label'?: string;
  caption?: string;
  'copy-label'?: string;
  'example-label'?: string;
  'name-label'?: string;
  path: string;
  theme: TokenGroup;
  'value-label'?: string;
};

const meta = {
  id: 'clippy-token-group-table',
  args: {
    path: 'basis.text.font-size',
    theme: themeFixture,
  },
  argTypes: {
    'actions-label': {
      control: 'text',
      description: 'Label for the actions header',
    },
    caption: {
      control: 'text',
      description: 'Table caption, overrides `path` as caption',
    },
    'copy-label': {
      control: 'text',
      description: 'Prefix for the copy button label and toggletip',
    },
    'example-label': {
      control: 'text',
      description: 'Label for the example header',
    },
    'name-label': {
      control: 'text',
      description: 'Label for the name header',
    },
    path: {
      control: 'text',
      description: 'Dot-separated path to the token group to render',
    },
    theme: {
      control: false,
      description: 'The full token tree',
    },
    'value-label': {
      control: 'text',
      description: 'Label for the value header',
    },
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
      source: {
        // Omit the theme object from the code snippet, it's too large to be readable
        transform: (_code: string, storyContext: { args: TokenGroupTableStoryArgs }) => {
          const attributeString = Object.entries(storyContext.args)
            .filter(([name, value]) => name !== 'theme' && value !== undefined)
            .map(([name, value]) => `${name}="${value}"`)
            .join(' ');
          return `<clippy-token-group-table ${attributeString}></clippy-token-group-table>`;
        },
        type: 'code',
      },
    },
  },
  render: (args: TokenGroupTableStoryArgs) => React.createElement('clippy-token-group-table', args),
  tags: ['autodocs'],
  title: 'Clippy/Design Tokens/Token Group Table',
} satisfies Meta<TokenGroupTableStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DirectChildren: Story = {
  name: 'Group with only direct children',
  args: {
    path: 'basis.text.font-size',
  },
};

export const NestedGroups: Story = {
  name: 'Group with nested groups',
  args: {
    path: 'basis.space',
  },
};

export const HardValues: Story = {
  name: 'Hard values',
  args: {
    path: 'brand.color',
  },
};

export const RefValues: Story = {
  name: 'Ref values',
  args: {
    path: 'basis.color.accent-1',
  },
};
