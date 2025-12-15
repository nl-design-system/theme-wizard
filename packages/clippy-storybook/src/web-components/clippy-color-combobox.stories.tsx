/* @license CC0-1.0 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-color-combobox';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

const OPTIONS = [
  {
    label: '#ff6600',
    value: '#ff6600',
  },
  {
    label: '#00ff66',
    value: '#00ff66',
  },
  {
    label: '#6600ff',
    value: '#6600ff',
  },
  {
    label: '#ff0066',
    value: '#ff0066',
  },
  {
    label: '#66ff00',
    value: '#66ff00',
  },
  {
    label: '#0066ff',
    value: '#0066ff',
  },
  {
    label: '#00ff66',
    value: '#00ff66',
  },
];

interface ColorComboboxStoryArgs {
  options: typeof OPTIONS;
  lang?: string;
}

const createTemplate = ({ lang, options }: ColorComboboxStoryArgs) =>
  lang
    ? html`<clippy-color-combobox lang="${lang}" options='${JSON.stringify(options, null, 2)}'></clippy-color-combobox>`
    : html`<clippy-color-combobox options='${JSON.stringify(options, null, 2)}'></clippy-color-combobox>`;

const meta = {
  id: 'clippy-color-combobox',
  args: {
    lang: undefined,
    options: OPTIONS,
  },
  argTypes: {
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
        component: '`<clippy-color-combobox>`',
      },
      source: {
        transform: (_code: string, storyContext: { args: ColorComboboxStoryArgs }) => {
          const template = createTemplate(storyContext.args);
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
  render: ({ lang, options }: ColorComboboxStoryArgs) =>
    React.createElement('clippy-color-combobox', {
      lang,
      options: JSON.stringify(options, null, 2),
    }),
  tags: ['autodocs'],
  title: 'Clippy/Combobox/Color Combobox',
} satisfies Meta<ColorComboboxStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: { args: ColorComboboxStoryArgs }) => {
          const template = createTemplate(storyContext.args);
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
};

export const Translated = {
  name: 'Translated named colors',
  args: {
    lang: 'nl',
  },
};
