import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchResults, type SearchResultsProps } from '@nl-design-system-community/theme-wizard-templates/react';
import * as React from 'react';
import '@utrecht/component-library-css';
import documentation from './docs/Results.md?raw';

const CombinedResults = SearchResults as React.ComponentType<SearchResultsProps>;

const meta = {
  component: CombinedResults,
  parameters: {
    docs: {
      description: {
        component: documentation,
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  title: 'Templates/Zoeken/Resultaten',
} satisfies Meta<SearchResultsProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Zoekresultaten',
  args: {
    currentPath: '/search-results',
    initialQuery: 'afval',
  },
};

export const NoResults: Story = {
  name: 'Geen resultaten',
  args: {
    currentPath: '/search-results',
    initialQuery: 'onbekendwoord',
  },
};
