import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-token-sample-spacing';
import { Concepts } from '@nl-design-system-community/clippy-components/src/clippy-token-sample-spacing/types.js';
import React from 'react';

type TableColorStoryArgs = {
  concept?: Concepts;
};

const meta = {
  id: 'clippy-token-sample-spacing',
  parameters: {
    docs: {
      description: {
        component: '`<clippy-token-sample-spacing>` is een component om concepten rond spacing-tokens te illustreren.',
      },
    },
  },
  render: () => React.createElement('clippy-token-sample-spacing', { concept: 'inline' }),
  tags: ['autodocs'],
  title: 'Clippy/Token Sample Spacing',
} satisfies Meta<TableColorStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Basis token sample spacing',
};
