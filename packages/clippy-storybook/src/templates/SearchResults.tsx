import type { Meta, StoryObj } from '@storybook/react-vite';
import SearchResults, {
  type SearchResultsProps,
} from '@nl-design-system-community/theme-wizard-templates/src/pages/search/SearchResults';
import * as React from 'react';
import '@utrecht/component-library-css';
import documentation from '../docs/templates/gemeente-voorbeeld-documentatie.md?raw';

const meta = {
  component: SearchResults as React.ComponentType<SearchResultsProps>,
  parameters: {
    docs: {
      description: {
        component: documentation,
      },
    },
    layout: 'fullscreen',
  },
  title: 'Templates/Zoekresultaten',
} satisfies Meta<SearchResultsProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Zoekresultaten',
};
