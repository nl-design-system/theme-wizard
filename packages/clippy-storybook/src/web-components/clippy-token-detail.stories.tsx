import type { Meta, StoryObj } from '@storybook/react-vite';
import readme from '@nl-design-system-community/clippy-components/src/clippy-token-detail/README.md?raw';
import '@nl-design-system-community/clippy-components/clippy-token-detail';
import React from 'react';

interface TokenDetailStoryArgs {}

const meta = {
  id: 'clippy-token-detail',
  // argTypes: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args: TokenDetailStoryArgs) => React.createElement('clippy-token-detail', args),
  tags: ['autodocs'],
  title: 'clippy/Token Detail',
} satisfies Meta<TokenDetailStoryArgs>;

export default meta;
type Story = StoryObj<TokenDetailStoryArgs>;

export const Default: Story = {};
