/* @license CC0-1.0 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import readme from '@nl-design-system-community/clippy-components/src/clippy-modal/README.md?raw';
import { html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { templateToHtml } from '../utils/templateToHtml';
import { LitTemplateWrapper } from './LitTemplateWrapper';

interface ModalStoryArgs {
  title: string;
  content: string;
  standardOpen: boolean;
  actions: 'none' | 'cancel' | 'confirm' | 'both';
  confirmLabel: string;
  cancelLabel: string;
}

// Helper function to generate the template - used for both rendering and source code
const createTemplate = ({ actions, cancelLabel, confirmLabel, content, standardOpen, title }: ModalStoryArgs) =>
  html`<clippy-modal
    actions=${actions}
    cancelLabel=${cancelLabel}
    confirmLabel=${confirmLabel}
    standardOpen=${standardOpen}
    title=${title}
  >
    ${content}
  </clippy-modal>`;

const meta = {
  id: 'web-component-modal',
  args: {
    actions: 'both' as const,
    cancelLabel: 'Annuleren',
    confirmLabel: 'Bevestigen',
    content: 'Dit is de inhoud van de modal.',
    standardOpen: true,
    title: 'Modal titel',
  },
  argTypes: {
    actions: {
      name: 'Actions',
      control: {
        type: 'select',
      },
      description: 'Welke footer acties worden getoond',
      options: ['none', 'cancel', 'confirm', 'both'],
      type: {
        name: 'string',
        required: false,
      },
    },
    cancelLabel: {
      name: 'Cancel Label',
      description: 'Label voor de annuleer knop',
      type: {
        name: 'string',
        required: false,
      },
    },
    confirmLabel: {
      name: 'Confirm Label',
      description: 'Label voor de bevestig knop',
      type: {
        name: 'string',
        required: false,
      },
    },
    content: {
      name: 'Content',
      description: 'De inhoud van de modal',
      type: {
        name: 'string',
        required: true,
      },
    },
    standardOpen: {
      name: 'Standard Open',
      description: 'Of de modal standaard open is',
      type: {
        name: 'boolean',
        required: false,
      },
    },
    title: {
      name: 'Title',
      description: 'De titel van de modal',
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
  render: (args: ModalStoryArgs) => <LitTemplateWrapper template={createTemplate(args)} />,
  tags: ['autodocs'],
  title: 'Web Component/Modal',
} satisfies Meta<ModalStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Example modal',
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: { args: ModalStoryArgs }) => {
          const template = createTemplate(storyContext.args);
          return templateToHtml(template);
        },
        type: 'code',
      },
    },
  },
};
