import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-page-layout';
import '@nl-design-system-community/clippy-components/clippy-page-header';
import { simple } from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/fixtures.js';
import readme from '@nl-design-system-community/clippy-components/src/clippy-page-layout/README.md?raw';
import { full } from '@nl-design-system-community/clippy-components/src/clippy-side-navigation/fixtures.js';
import React from 'react';

const meta = {
  id: 'clippy-page-layout',
  args: {},
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
    layout: 'fullscreen',
  },
  render: (args) =>
    React.createElement('clippy-page-layout', args, [
      React.createElement(
        'clippy-page-header',
        {
          slot: 'header',
          variant: 'default',
        },
        [
          React.createElement('span', { slot: 'logo' }, '🎉 Logo'),
          React.createElement('clippy-navigation-bar', { items: simple, slot: 'navigation-bar' }),
          React.createElement('clippy-side-navigation', { items: full, slot: 'navigation-drawer' }),
          React.createElement('clippy-button', { purpose: 'subtle', slot: 'end' }, 'Nederlands'),
        ],
      ),
      React.createElement(
        'mark',
        {
          slot: 'footer',
        },
        'footer',
      ),
      React.createElement('mark', {}, 'content'),
    ]),
  tags: ['autodocs'],
  title: 'Clippy/Layout/Page Layout',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};
