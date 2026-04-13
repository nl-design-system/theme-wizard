import type { Meta, StoryObj } from '@storybook/react-vite';
import '@nl-design-system-community/clippy-components/clippy-story-preview';
import { html } from 'lit';
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';

interface StoryPreviewStoryArgs {
  size: 'lg' | undefined;
}

const createTemplate = (size?: string) =>
  size
    ? html`<clippy-story-preview size="${size}">Example content</clippy-story-preview>`
    : html`<clippy-story-preview>Example content</clippy-story-preview>`;

const meta = {
  id: 'clippy-story-preview',
  args: {
    size: undefined,
  },
  argTypes: {
    size: {
      control: 'select',
      description: 'Size variant of the story preview',
      options: [undefined, 'lg'],
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: "'lg' | undefined" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          '`<clippy-story-preview>` renders content in a Storybook-like white, rounded rectangle with a subtle box-shadow. Use the `size="lg"` attribute for a larger variant with more padding and a stronger shadow.',
      },
    },
  },
  render: ({ size }: StoryPreviewStoryArgs) => React.createElement('clippy-story-preview', { size }, 'Example content'),
  tags: ['autodocs'],
  title: 'Clippy/Story Preview',
} satisfies Meta<StoryPreviewStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: { args: StoryPreviewStoryArgs }) => {
          const template = createTemplate(storyContext.args.size);
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
};

export const Large: Story = {
  name: 'Large',
  args: {
    size: 'lg',
  },
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        transform: () => {
          const template = createTemplate('lg');
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
};
