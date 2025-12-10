/* @license CC0-1.0 */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { readme } from '@nl-design-system-community/clippy-components/patterns/cookie-consent';
import React from 'react';
import { createRoot } from 'react-dom/client';
import type { CookieConsentModalProps } from './CookieConsentModal';
import { formatHTML } from '../../utils/formatHTML';
import { CookieConsentModal } from './CookieConsentModal';
import '@utrecht/component-library-css';

let lastRenderedHTML = '';

const meta = {
  argTypes: {
    clearStorageOnMount: {
      control: 'boolean',
      description: 'Clear localStorage on mount to force modal to show',
    },
    organization: {
      control: 'text',
      description: 'Organization name to personalize the modal',
    },
  },
  parameters: {
    docs: {
      description: {
        component: readme,
      },
      source: {
        language: 'html',
        transform: () => {
          return lastRenderedHTML ? formatHTML(lastRenderedHTML) : '<!-- HTML wordt geladen... -->';
        },
      },
    },
  },
  render: (args: CookieConsentModalProps) => {
    const container = document.createElement('div');

    // Mount React component
    setTimeout(() => {
      const root = createRoot(container);
      root.render(React.createElement(CookieConsentModal, args));

      // Capture rendered HTML after another delay to ensure React has rendered
      setTimeout(() => {
        lastRenderedHTML = container.innerHTML;
      }, 200);
    }, 0);

    return container;
  },
  tags: ['autodocs'],
  title: 'Patterns/Cookie Consent/React',
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const ReactModal: Story = {
  name: 'Cookie Modal (Utrecht Components)',
  args: {
    clearStorageOnMount: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Een blokkerende cookie consent modal die verschijnt bij het eerste bezoek aan de website. Deze is gebouwd met Utrecht React componenten zoals Button, Heading, Paragraph en ButtonGroup.',
      },
    },
  },
};

export const ReactModalWithOrganization: Story = {
  name: 'Cookie Modal with Organization (Utrecht Components)',
  args: {
    clearStorageOnMount: true,
    organization: 'ICTU',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Cookie modal met een organisatienaam die de tekst personaliseert. Gebouwd met Utrecht React componenten.',
      },
    },
  },
};
