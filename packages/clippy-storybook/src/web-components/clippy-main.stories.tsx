import type { Meta, StoryObj } from '@storybook/react-vite';
import readme from '@nl-design-system-community/clippy-components/src/clippy-main/README.md?raw';
import { purposes, type Purpose } from '@nl-design-system-community/clippy-components/src/clippy-main/types.js';
import '@nl-design-system-community/clippy-components/clippy-main';
import '@nl-design-system-community/clippy-components/clippy-heading';
import '@nl-design-system-community/clippy-components/clippy-layout';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';
import '@nl-design-system-candidate/paragraph-css/paragraph.css';

interface StoryArgs {
  purpose: Purpose;
}

const defaultArgs: StoryArgs = {
  purpose: 'default',
};

const createTemplate = (args: StoryArgs = defaultArgs) => {
  const defaultTemplate = html`
    <clippy-main purpose=${args.purpose}>
      <clippy-heading level="2" slot="header">De titel van een artikel</clippy-heading>
      <p class="nl-paragraph" slot="aside">Geschreven door: Piet Pietersen</p>
      <p class="nl-paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.</p>
    </clippy-main>
  `;
  return args.purpose === 'detail'
    ? html`<clippy-layout purpose="detail"> ${templateToHtml(defaultTemplate)} </clippy-layout>`
    : defaultTemplate;
};

const meta = {
  id: 'clippy-main',
  args: defaultArgs,
  argTypes: {
    purpose: {
      control: 'select',
      options: purposes,
    },
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
      source: {
        transform: () => templateToHtml(createTemplate(defaultArgs)),
        type: 'code',
      },
    },
    layout: 'fullscreen',
  },
  render: (args) =>
    React.createElement('div', {
      dangerouslySetInnerHTML: { __html: templateToHtml(createTemplate(args)) },
    }),
  tags: ['autodocs'],
  title: 'Clippy/Main',
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  name: 'Purpose: default',
};

export const Detail: Story = {
  name: 'Purpose: detail',
  args: {
    purpose: 'detail',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Set `purpose="detail"` when the main is inside a `clippy-layout[purpose="detail"]` to align with the grid structure in that layout.',
      },
      source: {
        transform: () => templateToHtml(createTemplate({ purpose: 'detail' })),
        type: 'code',
      },
    },
  },
};
