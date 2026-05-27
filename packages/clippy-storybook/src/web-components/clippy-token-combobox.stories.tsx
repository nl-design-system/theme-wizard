import type { Option, Types } from '@nl-design-system-community/clippy-components/clippy-token-combobox';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  type ColorToken,
  walkColors,
  isRef,
  TokenReference,
  EXTENSION_RESOLVED_AS,
  extractRef,
  StrictThemeSchema,
  SKIP,
} from '@nl-design-system-community/design-tokens-schema';
import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens.json';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';
import '@nl-design-system-community/clippy-components/clippy-token-combobox';

// Flatten start tokens
const parsedTokens = StrictThemeSchema.parse(startTokens);

const colorTokens: Array<{ token: ColorToken; path: string[] }> = [];
walkColors(parsedTokens, (token, path) => {
  colorTokens.push({
    path,
    token,
  });
  return SKIP;
});

const options = colorTokens.map(({ path, token }) => {
  // Find the resolved value for color tokens to show in the combobox options.
  // Since tokens can reference other tokens, we check if the token is a reference and use the resolved value if so.
  const resolved = isRef(token.$value) ? token['$extensions']?.[EXTENSION_RESOLVED_AS] : token.$value;
  const $value = `{${path.join('.')}}` satisfies TokenReference;
  const $extensions = {
    ...token['$extensions'],
    [EXTENSION_RESOLVED_AS]: structuredClone(resolved),
  };
  return {
    label: extractRef($value),
    value: {
      $extensions,
      $type: token.$type,
      $value,
    },
  };
});

interface TokenComboboxStoryArgs {
  options: Option[];
  type: Types;
}

const createTemplate = (args: TokenComboboxStoryArgs) =>
  html`<clippy-token-combobox type=${args.type} .options=${options}></clippy-token-combobox>`;

const meta = {
  id: 'clippy-token-combobox',
  args: {
    options: options.slice(0, 50),
    type: 'color',
  },
  parameters: {
    docs: {
      description: {
        component: '`<clippy-token-combobox>`',
      },
    },
  },
  render: ({ options, type }: TokenComboboxStoryArgs) =>
    React.createElement('clippy-token-combobox', {
      options,
      type,
    }),
  tags: ['autodocs'],
  title: 'Clippy/Combobox/Token Combobox',
} satisfies Meta<TokenComboboxStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Example token combobox',
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: { args: TokenComboboxStoryArgs }) => {
          const template = createTemplate(storyContext.args);
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
};
