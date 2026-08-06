import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-token-sample-border';
import React from 'react';

type TokenSampleBorderStoryArgs = {};

const meta = {
  id: 'clippy-token-sample-border',
  parameters: {
    docs: {
      description: {
        component:
          '`<clippy-token-sample-border>` is a component to illustrate border tokens and their concepts within the NL Design System.',
      },
    },
  },
  render: (args: TokenSampleBorderStoryArgs) => React.createElement('clippy-token-sample-border', args),
  tags: ['autodocs'],
  title: 'Clippy/Token Sample: Border',
} satisfies Meta<TokenSampleBorderStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
