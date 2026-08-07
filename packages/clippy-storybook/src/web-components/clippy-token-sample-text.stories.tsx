import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-token-sample-text';
import React from 'react';

type TokenSampleTextStoryArgs = {
  borderRadius?: string;
  borderWidth?: string;
};

const meta = {
  id: 'clippy-token-sample-text',
  parameters: {
    docs: {
      description: {
        component:
          '`<clippy-token-sample-text>` is a component to illustrate text tokens and their concepts within the NL Design System.',
      },
    },
  },
  render: (args: TokenSampleTextStoryArgs) => React.createElement('clippy-token-sample-text', args),
  tags: ['autodocs'],
  title: 'Clippy/Token Sample: Text',
} satisfies Meta<TokenSampleTextStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
