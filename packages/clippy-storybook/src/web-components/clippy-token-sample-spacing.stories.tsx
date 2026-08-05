import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-token-sample-spacing';
import {
  type Concepts,
  concepts,
} from '@nl-design-system-community/clippy-components/src/clippy-token-sample-spacing/types.js';
import React from 'react';

type TableColorStoryArgs = {
  concept?: Concepts;
  size?: string;
};

const meta = {
  id: 'clippy-token-sample-spacing',
  argTypes: {
    concept: {
      control: { type: 'select' },
      options: concepts,
    },
  },
  parameters: {
    docs: {
      description: {
        component: '`<clippy-token-sample-spacing>` is een component om concepten rond spacing-tokens te illustreren.',
      },
    },
  },
  render: (args: TableColorStoryArgs) => React.createElement('clippy-token-sample-spacing', args),
  tags: ['autodocs'],
  title: 'Clippy/Token Sample Spacing',
} satisfies Meta<TableColorStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Basis token sample spacing',
  args: {
    concept: 'inline',
    size: '2rem',
  },
};
