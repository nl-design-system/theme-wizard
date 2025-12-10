/* @license CC0-1.0 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import readme from '@nl-design-system-community/theme-wizard-app/src/components/template-code/README.md?raw';
import { html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { LitTemplateWrapper } from './LitTemplateWrapper';

interface CodeStoryArgs {
  content: string;
}

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
  render: ({ content }: CodeStoryArgs) => (
    <LitTemplateWrapper template={html`<template-code>${content}</template-code>`} />
  ),
  tags: ['autodocs'],
  title: 'Web Component/Code',
} satisfies Meta<CodeStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Example code',
};
