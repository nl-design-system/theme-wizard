import type { ClippyTokenComboboxOption } from '@nl-design-system-community/clippy-components/clippy-token-combobox';
import '@nl-design-system-community/clippy-components/clippy-token-combobox';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

const OPTIONS: ClippyTokenComboboxOption[] = [
  {
    label: 'test.token.1',
    value: { type: 'color', value: '#000000' },
  },
  {
    label: 'test.token.2',
    value: { type: 'color', value: '#ff0000' },
  },
];

interface TokenComboboxStoryArgs {
  options: typeof OPTIONS;
}

const createTemplate = (options: TokenComboboxStoryArgs['options']) =>
  html`<clippy-token-combobox options=${JSON.stringify(options, null, 2)}></clippy-token-combobox>`;

const meta = {
  id: 'clippy-token-combobox',
  args: {
    options: OPTIONS,
  },
  parameters: {
    docs: {
      description: {
        component: '`<clippy-token-combobox>`',
      },
    },
  },
  render: ({ options }: TokenComboboxStoryArgs) =>
    React.createElement('clippy-token-combobox', {
      options,
    }),
  tags: ['autodocs'],
  title: 'Clippy/Combobox/token Combobox',
} satisfies Meta<TokenComboboxStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Example combobox',
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: { args: TokenComboboxStoryArgs }) => {
          const template = createTemplate(storyContext.args.options);
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
};
