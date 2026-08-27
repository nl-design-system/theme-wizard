import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-token-sample';
import readme from '@nl-design-system-community/clippy-components/src/clippy-token-sample/README.md?raw';
import React from 'react';

type TokenSampleStoryArgs = {};

const meta = {
  id: 'clippy-token-sample',
  args: {
    borderRadius: '',
    borderWidth: '1px',
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args: TokenSampleStoryArgs) => React.createElement('clippy-token-sample', args),
  tags: ['autodocs'],
  title: 'Clippy/Token Sample',
} satisfies Meta<TokenSampleStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
