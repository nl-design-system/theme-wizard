import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@nl-design-system-community/clippy-components/clippy-combobox';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

const OPTIONS = [
  {
    label: 'Bert',
    value: 'bert',
  },
  {
    label: 'Ernie',
    value: 'ernie',
  },
];

interface ComboboxStoryArgs {
  options: typeof OPTIONS;
}

const createTemplate = (options: ComboboxStoryArgs['options']) =>
  html`<clippy-combobox options=${JSON.stringify(options, null, 2)}></clippy-combobox>`;

const meta = {
  id: 'clippy-combobox',
  args: {
    options: OPTIONS,
  },
  parameters: {
    docs: {
      description: {
        component: '`<clippy-combobox>`',
      },
    },
  },
  render: ({ options }: ComboboxStoryArgs) =>
    React.createElement('clippy-combobox', {
      options: JSON.stringify(options, null, 2),
    }) as unknown as string,
  tags: ['autodocs'],
  title: 'Clippy/Combobox',
} satisfies Meta<ComboboxStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Example combobox',
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: { args: ComboboxStoryArgs }) => {
          const template = createTemplate(storyContext.args.options);
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
};
