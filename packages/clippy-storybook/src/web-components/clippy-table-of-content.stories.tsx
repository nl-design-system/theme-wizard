import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-table-of-content';
import { NavigationItems } from '@nl-design-system-community/clippy-components/src/clippy-navigation-bar/types.js';
import { simple } from '@nl-design-system-community/clippy-components/src/clippy-table-of-content/fixtures.js';
import readme from '@nl-design-system-community/clippy-components/src/clippy-table-of-content/README.md?raw';
import React from 'react';

type StoryArgs = {
  items: NavigationItems;
  label?: string;
  style?: React.CSSProperties;
};

const defaultArgs = {
  items: simple,
  label: undefined,
};

const meta = {
  id: 'clippy-table-of-content',
  args: defaultArgs,
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args: StoryArgs) => React.createElement('clippy-table-of-content', args),
  tags: ['autodocs'],
  title: 'Clippy/Table Of Content',
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};

export const Highlighted: Story = {
  name: 'Highlighted',
  args: {
    ...defaultArgs,
    style: {
      '--clippy-table-of-content-highlighted': 1,
    } as React.CSSProperties,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The table of content can be highlighted by setting the `--clippy-table-of-content-highlighted` CSS variable to `1`. Commonly used in combination with media- or container queries.',
      },
    },
  },
};
