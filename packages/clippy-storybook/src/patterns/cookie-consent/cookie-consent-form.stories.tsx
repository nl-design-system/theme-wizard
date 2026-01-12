import type { Meta, StoryObj } from '@storybook/react-vite';
import { Paragraph } from '@utrecht/component-library-react/dist/css-module';
import React from 'react';
import CookieConsentForm from './Form';
import readme from './README.md?raw';

const meta = {
  argTypes: {
    buttonAccept: {
      name: 'Button Accept',
      description: 'Label voor de "Alle cookies accepteren" knop',
      type: {
        name: 'string',
        required: false,
      },
    },
    buttonReject: {
      name: 'Button Reject',
      description: 'Label voor de "Geen cookies" knop',
      type: {
        name: 'string',
        required: false,
      },
    },
    buttonSave: {
      name: 'Button Save',
      description: 'Label voor de "Selectie opslaan" knop',
      type: {
        name: 'string',
        required: false,
      },
    },
    children: {
      name: 'Children',
      description: 'Custom content voor de formulier',
      type: {
        name: 'other',
        required: false,
        value: 'ReactNode',
      },
    },
    clearStorageOnMount: {
      name: 'Clear Storage On Mount',
      description: 'Of de localStorage moet worden gewist bij mount (voor testen)',
      type: {
        name: 'boolean',
        required: false,
      },
    },
    cookieOptions: {
      name: 'Cookie Options',
      description: 'Lijst van cookie opties met checkboxes',
      type: {
        name: 'other',
        required: false,
        value: 'CookieOption[]',
      },
    },
    customizeLink: {
      name: 'Customize Link',
      description: 'Link naar cookie-instellingen met href en text',
      type: {
        name: 'object',
        required: false,
        value: {
          href: { name: 'string', required: true },
          text: { name: 'string', required: true },
        },
      },
    },
    showLogo: {
      name: 'Logo',
      description: 'Show the logo in the cookie consent banner',
      type: {
        name: 'boolean',
        required: false,
      },
    },
    title: {
      name: 'Title',
      description: 'Custom titel voor de formulier',
      type: {
        name: 'string',
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
  name: 'Cookie Formulier',
  args: {
    buttonAccept: 'Alle cookies accepteren',
    buttonReject: 'Geen cookies',
    buttonSave: 'Selectie opslaan',
    children: (
      <>
        <Paragraph style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
          Wij gebruiken cookies om de website te laten werken en deze te verbeteren. Noodzakelijke cookies zijn altijd
          actief omdat ze essentieel zijn voor de werking van de website. Zonder deze cookies kunnen bepaalde
          functionaliteiten niet worden gebruikt.
        </Paragraph>
        <Paragraph style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
          Naast noodzakelijke cookies gebruiken wij ook analytische cookies. Deze cookies helpen ons te begrijpen hoe
          bezoekers de website gebruiken door anoniem informatie te verzamelen en te rapporteren. Je kunt hieronder
          aangeven welke cookies je wilt accepteren.
        </Paragraph>
      </>
    ),
    clearStorageOnMount: true,
    showLogo: true,
    title: 'Cookievoorkeuren',
  },
};
