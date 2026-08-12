import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-stack';
import readme from '@nl-design-system-community/clippy-components/src/clippy-stack/README.md?raw';
import { type Sizes, sizes } from '@nl-design-system-community/clippy-components/src/clippy-stack/types.js';
import React from 'react';
import '@nl-design-system-candidate/paragraph-css/paragraph.css';

type StackStoryArgs = {
  size?: Sizes;
};

const meta = {
  id: 'clippy-stack',
  args: {
    size: 'md',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: sizes,
    },
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args: StackStoryArgs) =>
    React.createElement(
      'clippy-stack',
      args,
      ['The quick brown fox jumps over the lazy dog.', 'The quick brown fox jumps over the lazy dog.'].map((text) =>
        React.createElement('p', { className: 'nl-paragraph' }, text),
      ),
    ),
  tags: ['autodocs'],
  title: 'Clippy/Stack',
} satisfies Meta<StackStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
