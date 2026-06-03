import type { Option, Types } from '@nl-design-system-community/clippy-components/clippy-token-combobox';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  type ColorToken,
  isRef,
  TokenReference,
  EXTENSION_RESOLVED_AS,
  extractRef,
  StrictThemeSchema,
  SKIP,
  DimensionToken,
  EXTENSION_TOKEN_SUBTYPE,
  walkTokens,
  BaseDesignToken,
} from '@nl-design-system-community/design-tokens-schema';
import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens.json';
import { html } from 'lit';
import React from 'react';
import '@nl-design-system-community/clippy-components/clippy-token-combobox';
import { templateToHtml } from '../utils/templateToHtml';
import '@nl-design-system-community/clippy-components/clippy-token-combobox';

const resolveRefs = (tokens: Array<{ token: ColorToken | DimensionToken | BaseDesignToken; path: string[] }>) =>
  tokens.map(({ path, token }) => {
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

// Flatten start tokens
const parsedTokens = StrictThemeSchema.parse(startTokens);
const designTokens: Array<{ token: BaseDesignToken; path: string[] }> = [];
walkTokens(parsedTokens, (token, path) => {
  designTokens.push({
    path,
    token,
  });
  return SKIP;
});

const colorTokens = designTokens.filter(({ token }) => token.$type === 'color');
const fontFamilyTokens = designTokens.filter(({ token }) => token.$type === 'fontFamily');
const borderWidthTokens = designTokens.filter(
  ({ token }) => token.$extensions?.[EXTENSION_TOKEN_SUBTYPE] === 'border-width',
);
const lineHeightTokens = designTokens.filter(
  ({ token }) => token.$extensions?.[EXTENSION_TOKEN_SUBTYPE] === 'line-height',
);

const colorOptions = resolveRefs(colorTokens);
const fontFamilyOptions = resolveRefs(fontFamilyTokens);
const borderWidthOptions = resolveRefs(borderWidthTokens);
const lineHeightOptions = resolveRefs(lineHeightTokens);

interface TokenComboboxStoryArgs {
  options: Option[];
  type: Types;
}

const createTemplate = (args: TokenComboboxStoryArgs) =>
  html`<clippy-token-combobox type=${args.type} .options=${args.options}></clippy-token-combobox>`;

const meta = {
  id: 'clippy-token-combobox',
  args: {
    options: colorOptions.slice(0, 50),
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
  name: 'Color token combobox',
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

export const DimensionValue: Story = {
  name: 'Dimension token combobox',
  args: {
    options: borderWidthOptions.slice(0, 50),
    type: 'dimension',
  },
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

export const FontFamilyValue: Story = {
  name: 'Font family token combobox',
  args: {
    options: fontFamilyOptions.slice(0, 50),
    type: 'fontFamily',
  },
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

export const NumberValue: Story = {
  name: 'Number token combobox',
  args: {
    options: lineHeightOptions.slice(0, 50),
    type: 'number',
  },
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
