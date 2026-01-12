import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from '@nl-design-system-candidate/heading-react';
import React from 'react';
import CookieConsentForm from './Form';
import { DataPanel, PolicyPanel, WhatAreCookiesPanel } from './Form/components';
import readme from './README.md?raw';

const meta = {
  argTypes: {
    buttonAccept: {
      name: 'Button Accept',
      description: 'Label for the "Accept all cookies" button',
      type: {
        name: 'string',
        required: false,
      },
    },
    buttonReject: {
      name: 'Button Reject',
      description: 'Label for the "Reject cookies" button',
      type: {
        name: 'string',
        required: false,
      },
    },
    buttonSave: {
      name: 'Button Save',
      description: 'Label for the "Save selection" button',
      type: {
        name: 'string',
        required: false,
      },
    },
    clearStorageOnMount: {
      name: 'Clear Storage On Mount',
      description: 'Whether to clear localStorage on mount (for testing purposes)',
      type: {
        name: 'boolean',
        required: false,
      },
    },
    cookieOptions: {
      name: 'Cookie Options',
      description: 'List of cookie options with checkboxes',
      type: {
        name: 'other',
        required: false,
        value: 'CookieOption[]',
      },
    },
    customizeLink: {
      name: 'Customize Link',
      description: 'Link to cookie settings with href and text',
      type: {
        name: 'object',
        required: false,
        value: {
          href: { name: 'string', required: true },
          text: { name: 'string', required: true },
        },
      },
    },
    infoSections: {
      name: 'Info Sections',
      description: 'Array of expandable information sections (accordion)',
      type: {
        name: 'other',
        required: false,
        value: 'InfoSection[]',
      },
    },
    showLegitimateInterest: {
      name: 'Show Legitimate Interest',
      description: 'Show legitimate interest section separately from consent section',
      type: {
        name: 'boolean',
        required: false,
      },
    },
  },
  component: CookieConsentForm,
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  tags: ['autodocs'],
  title: 'Patterns/Cookie Consent/Form',
} satisfies Meta<typeof CookieConsentForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Cookie Consent Form',
  args: {
    buttonAccept: 'Alle cookies accepteren',
    buttonReject: 'Cookies weigeren',
    buttonSave: 'Selectie opslaan',
    clearStorageOnMount: true,
    infoSections: [
      {
        body: <WhatAreCookiesPanel />,
        label: 'Wat zijn cookies?',
      },
      {
        body: (
          <PolicyPanel privacyPolicyUrl="/privacy">
            <Heading level={2}>Cookieverklaring</Heading>
          </PolicyPanel>
        ),
        label: 'Cookieverklaring',
      },
      {
        body: <DataPanel buttonResetLabel="Cookies resetten" cookieOptions={[]} selectedCookies={new Set()} />,
        label: 'Mijn gegevens',
      },
    ],
    showLegitimateInterest: true,
  },
};

export const WithoutLegitimateInterest: Story = {
  name: 'Without Legitimate Interest Section',
  args: {
    ...Default.args,
    showLegitimateInterest: false,
  },
};
