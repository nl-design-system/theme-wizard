/* @license CC0-1.0 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import readme from '@nl-design-system-community/theme-wizard-app/src/components/template-code/README.md?raw';
import { html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';
import { LitTemplateWrapper } from './LitTemplateWrapper';

interface CodeStoryArgs {
  content: string;
}

// Helper function to generate the template - used for both rendering and source code
const createTemplate = (content: string) => html`<template-code>${content}</template-code>`;

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
