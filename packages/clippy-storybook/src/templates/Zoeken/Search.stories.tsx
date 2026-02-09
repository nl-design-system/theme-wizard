import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search, type SearchProps } from '@nl-design-system-community/theme-wizard-templates/react';
import * as React from 'react';
import '@utrecht/component-library-css';
import documentation from './docs/Search.md?raw';

const CombinedSearch = Search as React.ComponentType<SearchProps>;

const meta = {
  component: CombinedSearch,
  parameters: {
    docs: {
      description: {
        component: documentation,
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  title: 'Templates/Zoeken/Start',
} satisfies Meta<SearchProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Zoeken',
  args: {
    currentPath: '/search',
  },
};
