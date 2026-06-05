import type { Option } from '@nl-design-system-community/clippy-components/clippy-font-combobox';
import '@nl-design-system-community/clippy-components/clippy-font-combobox';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

type FontComboboxStoryArgs = {
  options: Option[];
};

const OPTIONS = [
  {
    label: 'Arial',
    value: ['Arial', 'sans-serif'],
  },
  {
    label: 'Courier New',
    value: ['Courier New', 'monospace'],
  },
  {
    label: 'Zapf Dingbats',
    value: ['Zapf Dingbats'],
  },
] satisfies Option[];

const createTemplate = () => html`<clippy-font-combobox options=${OPTIONS}></clippy-font-combobox>`;

const meta = {
  id: 'clippy-font-combobox',
  args: {
    options: OPTIONS,
  },
  parameters: {
    docs: {
      description: {
        component: '`<clippy-font-combobox>`',
      },
    },
  },
  render: ({ options }: FontComboboxStoryArgs) =>
    React.createElement('clippy-font-combobox', {
      options,
    }),
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
