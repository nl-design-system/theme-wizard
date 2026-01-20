import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-heading';
import readme from '@nl-design-system-community/clippy-components/src/clippy-heading/README.md?raw';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

interface HeadingStoryArgs {
  content: string;
  level: number;
}

// Docs template builds a full <clippy-heading> element for the Source block.
const createTemplate = (level: number, content: string) => html`<clippy-heading level="${level}">${content}</clippy-heading>`;

const meta = {
  id: 'web-component-heading',
  args: {
    content: 'Pagina titel',
    level: 1,
  },
  argTypes: {
    content: {
      name: 'Content',
      defaultValue: '',
      description: 'Text',
      type: {
        name: 'string',
        required: true,
      },
    },
    level: {
      name: 'Level',
      control: { max: 6, min: 1, step: 1, type: 'number' },
      defaultValue: 1,
      description: 'Heading level (1–6)',
      type: {
        name: 'number',
        required: true,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: ({ content, level }: HeadingStoryArgs) => React.createElement('clippy-heading', { level }, content),
  tags: ['autodocs'],
  title: 'Clippy/Heading',
} satisfies Meta<HeadingStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Heading',
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: { args: HeadingStoryArgs }) => {
          const template = createTemplate(storyContext.args.level, storyContext.args.content);
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
};
