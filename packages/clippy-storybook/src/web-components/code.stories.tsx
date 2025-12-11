/* @license CC0-1.0 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-code';
import readme from '@nl-design-system-community/clippy-components/src/clippy-code/README.md?raw';
import { html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { LitTemplateWrapper } from '../utils/LitTemplateWrapper';
import { templateToHtml } from '../utils/templateToHtml';

interface CodeStoryArgs {
  content: string;
}

const createTemplate = (content: string) => html`<clippy-code>${content}</clippy-code>`;

const meta = {
  id: 'web-component-code',
  args: {
    content: 'Opslaan en verder',
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
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: ({ content }: CodeStoryArgs) => <LitTemplateWrapper template={createTemplate(content)} />,
  tags: ['autodocs'],
  title: 'Web Component/Code',
} satisfies Meta<CodeStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Example code',
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: { args: CodeStoryArgs }) => {
          const template = createTemplate(storyContext.args.content);
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
};
