/* @license CC0-1.0 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-lang-combobox';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

const OPTIONS = [
  'bg',
  'cs',
  'da',
  'de',
  'el',
  'en',
  'es',
  'et',
  'fi',
  'fr',
  'ga',
  'hr',
  'hu',
  'it',
  'lt',
  'lv',
  'mt',
  'nl',
  'pl',
  'pt',
  'ro',
  'sk',
  'sl',
  'sv',
];

interface LangComboboxStoryArgs {
  options: typeof OPTIONS;
  lang?: string;
  format: 'autonym' | 'exonym' | 'autonym-exonym' | 'exonym-autonym';
}

const createTemplate = ({ lang, options }: LangComboboxStoryArgs) =>
  lang
    ? html`<clippy-lang-combobox lang="${lang}" options="${JSON.stringify(options, null, 2)}"></clippy-lang-combobox>`
    : html`<clippy-lang-combobox options="${JSON.stringify(options, null, 2)}"></clippy-lang-combobox>`;

const meta = {
  id: 'clippy-lang-combobox',
  args: {
    format: 'autonym',
    lang: undefined,
    options: OPTIONS,
  },
  argTypes: {
    format: {
      control: { type: 'select' },
      description:
        'Show languages in their own language (autonym), translated into current language (exonym), or both.',
      options: ['autonym', 'exonym', 'autonym-exonym', 'exonym-autonym'],
    },
    lang: {
      name: 'lang',
      defaultValue: '',
      description: 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/lang',
      type: 'string',
    },
  },
  parameters: {
    docs: {
      description: {
        component: '`<clippy-lang-combobox>`',
      },
      source: {
        transform: (_code: string, storyContext: { args: LangComboboxStoryArgs }) => {
          const template = createTemplate(storyContext.args);
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
  render: ({ format, lang, options }: LangComboboxStoryArgs) =>
    React.createElement('clippy-lang-combobox', {
      format,
      lang,
      options: JSON.stringify(options, null, 2),
    }),
  tags: ['autodocs'],
  title: 'Clippy/Combobox/Language Combobox',
} satisfies Meta<LangComboboxStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
};

export const Autonym: Story = {
  name: 'Show autonym',
  args: {
    format: 'autonym',
  },
};

export const Exonym: Story = {
  name: 'Show exonym',
  args: {
    format: 'exonym',
  },
};

export const AutonymAndExonym: Story = {
  name: 'Show both autonym and exonym',
  args: {
    format: 'autonym-exonym',
  },
};

export const TranslatedNonLatin: Story = {
  name: 'Translated in script other than latin',
  args: {
    lang: 'el',
  },
};

export const RTLLanguages: Story = {
  name: 'Including right-to-left languages',
  args: {
    options: ['ar', 'dv', 'fa', 'he', 'ps', 'ug', 'ur', 'yi', ...OPTIONS],
  },
};
