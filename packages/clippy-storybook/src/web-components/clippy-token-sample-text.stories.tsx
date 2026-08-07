import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-token-sample-text';
import React from 'react';

type TokenSampleTextStoryArgs = {
  'font-size'?: string;
  'font-family'?: string;
  color?: string;
  truncate?: boolean;
};

const meta = {
  id: 'clippy-token-sample-text',
  argTypes: {
    color: { control: 'text' },
    'font-family': { control: 'text' },
    'font-size': { control: 'text' },
    truncate: { control: 'boolean' },
  },
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

export const Family: Story = {
  name: 'Font Family',
  args: {
    'font-family': 'Arial, sans-serif',
  },
};

export const Size: Story = {
  name: 'Font Size',
  args: {
    'font-size': '32px',
  },
};

export const Color: Story = {
  name: 'Color',
  args: {
    color: 'red',
  },
};

export const Truncate: Story = {
  name: 'Truncate',
  args: {
    truncate: true,
  },
  render: (args: TokenSampleTextStoryArgs) =>
    React.createElement('div', { style: { width: '256px' } }, React.createElement('clippy-token-sample-text', args)),
};
