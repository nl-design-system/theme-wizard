import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-token-sample-typography';
import React from 'react';

type TokenSampleTypographyStoryArgs = {
  borderRadius?: string;
  borderWidth?: string;
};

const meta = {
  id: 'clippy-token-sample-typography',
  parameters: {
    docs: {
      description: {
        component:
          '`<clippy-token-sample-typography>` is a component to illustrate typography tokens and their concepts within the NL Design System.',
      },
    },
  },
  render: (args: TokenSampleTypographyStoryArgs) => React.createElement('clippy-token-sample-typography', args),
  tags: ['autodocs'],
  title: 'Clippy/Token Sample: Typography',
} satisfies Meta<TokenSampleTypographyStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
