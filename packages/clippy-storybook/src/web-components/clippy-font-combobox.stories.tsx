import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-font-combobox';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

type FontComboboxStoryArgs = Record<string, never>;

const createTemplate = () => html`<clippy-font-combobox></clippy-font-combobox>`;

const meta = {
  id: 'clippy-font-combobox',
  parameters: {
    docs: {
      description: {
        component: '`<clippy-font-combobox>`',
      },
    },
  },
  render: () => React.createElement('clippy-font-combobox', null),
  tags: ['autodocs'],
  title: 'Clippy/Combobox/Font Combobox',
} satisfies Meta<FontComboboxStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Example font combobox',
  parameters: {
    docs: {
      source: {
        transform: () => {
          const template = createTemplate();
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
};
