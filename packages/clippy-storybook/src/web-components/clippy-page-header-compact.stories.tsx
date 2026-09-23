import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-page-header-compact';
import '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import '@nl-design-system-community/clippy-components/clippy-side-navigation';
import '@nl-design-system-community/clippy-components/clippy-button';
import { simple } from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/fixtures.js';
import readme from '@nl-design-system-community/clippy-components/src/clippy-page-header-compact/README.md?raw';
import { full } from '@nl-design-system-community/clippy-components/src/clippy-side-navigation/fixtures.js';
import React from 'react';

type StoryArgs = {
  inverse: boolean;
  variant: 'default' | 'compact';
};

const meta = {
  id: 'clippy-page-header-compact',
  args: {
    inverse: false,
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
    layout: 'fullscreen',
  },
  render: (args: StoryArgs) =>
    React.createElement('clippy-page-header-compact', args, [
      React.createElement('span', { slot: 'logo' }, '🎉 Logo'),
      React.createElement('clippy-navigation-bar', { items: simple, slot: 'navigation-bar' }),
      React.createElement('clippy-side-navigation', { items: full, slot: 'navigation-drawer' }),
      React.createElement(
        'clippy-button',
        { purpose: args.variant === 'default' ? 'subtle' : 'subtle-inverse', slot: 'end' },
        'Nederlands',
      ),
    ]),
  tags: ['autodocs'],
  title: 'Clippy/Page Header/Compact',
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Variant: Default',
};

export const Compact: Story = {
  name: 'Variant: Compact',
  args: {
    variant: 'compact',
  },
};

export const Inverse: Story = {
  name: 'Inverse',
  args: {
    inverse: true,
  },
};
