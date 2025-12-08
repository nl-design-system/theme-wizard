/* @license CC0-1.0 */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import readme from '@nl-design-system-community/theme-wizard-app/src/components/template-code/README.md?raw';
import { html } from 'lit';

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
  render: ({ content }) => html`<template-code>${content}</template-code>`,
  tags: ['autodocs'],
  title: 'Web Component/Code',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Example code',
};
