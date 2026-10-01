import type { Meta, StoryObj } from '@storybook/react-vite';
import readme from '@nl-design-system-community/clippy-components/src/clippy-main/README.md?raw';
import { variants, type Variant } from '@nl-design-system-community/clippy-components/src/clippy-main/types.js';
import '@nl-design-system-community/clippy-components/clippy-main';
import '@nl-design-system-community/clippy-components/clippy-heading';
import '@nl-design-system-community/clippy-components/clippy-layout-detail';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';
import '@nl-design-system-candidate/paragraph-css/paragraph.css';

interface StoryArgs {
  variant: Variant;
}

const defaultArgs: StoryArgs = {
  variant: 'default',
};

const createTemplate = (args: StoryArgs = defaultArgs) => {
  const defaultTemplate = html`
    <clippy-main variant=${args.variant}>
      <clippy-heading level="2" slot="header">De titel van een artikel</clippy-heading>
      <p class="nl-paragraph" slot="aside">Geschreven door: Piet Pietersen</p>
      <p class="nl-paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.</p>
    </clippy-main>
  `;
  return args.variant === 'detail'
    ? html`<clippy-layout-detail> ${templateToHtml(defaultTemplate)} </clippy-layout-detail>`
    : defaultTemplate;
};

const meta = {
  id: 'clippy-main',
  args: defaultArgs,
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
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
  name: 'Variant: default',
};

export const Detail: Story = {
  name: 'Variant: detail',
  args: {
    variant: 'detail',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When used inside a `clippy-layout-detail` component you can set the `variant` to `detail`. This ensures the clippy-main component places its children on the parent grid.',
      },
      source: {
        transform: () => templateToHtml(createTemplate({ variant: 'detail' })),
        type: 'code',
      },
    },
  },
};
