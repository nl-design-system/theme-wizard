import type { ClippyTokenComboboxOption } from '@nl-design-system-community/clippy-components/clippy-token-combobox';
import '@nl-design-system-community/clippy-components/clippy-token-combobox';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ColorToken, walkColors, isRef, resolveRef } from '@nl-design-system-community/design-tokens-schema';
import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens.json';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

const colorTokens: Array<{ token: ColorToken; path: string[] }> = [];

walkColors(startTokens, (token, path) => {
  colorTokens.push({
    path,
    token,
  });
});

const colorOptions = colorTokens.slice(0, 20).map(({ path, token }) => ({
  label: path.join('.'),
  value: isRef(token.$value) ? (resolveRef(startTokens, token.$value) as ColorToken) : token.$value,
}));

console.log('colorOptions', colorOptions);

interface TokenComboboxStoryArgs {
  options: ClippyTokenComboboxOption[];
}

const createTemplate = (options: TokenComboboxStoryArgs['options']) =>
  html`<clippy-token-combobox type="color" options=${JSON.stringify(options, null, 2)}></clippy-token-combobox>`;

const meta = {
  id: 'clippy-token-combobox',
  args: {
    options: colorOptions,
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
