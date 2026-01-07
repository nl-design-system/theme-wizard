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
  name: 'Cookie Formulier - Standaard',
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

export const CustomOptions: Story = {
  name: 'Cookie Formulier - Aangepaste opties',
  args: {
    buttonAccept: 'Alle cookies accepteren',
    buttonReject: 'Alleen noodzakelijke cookies',
    buttonSave: 'Mijn keuze opslaan',
    children: (
      <>
        <Paragraph style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
          Wij gebruiken cookies om je de beste ervaring te bieden op onze website. Je kunt hieronder kiezen welke
          cookies je wilt accepteren. Noodzakelijke cookies zijn altijd actief en kunnen niet worden uitgeschakeld,
          omdat ze essentieel zijn voor de werking van de website.
        </Paragraph>
        <Paragraph style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
          Analytische cookies helpen ons te begrijpen hoe bezoekers onze website gebruiken door informatie te verzamelen
          en te rapporteren. Voorkeurscookies slaan je instellingen op, zoals je taalvoorkeur, zodat je deze niet bij
          elk bezoek opnieuw hoeft in te stellen.
        </Paragraph>
      </>
    ),
    clearStorageOnMount: true,
    cookieOptions: [
      {
        id: 'functional',
        description:
          'Deze cookies zijn noodzakelijk voor het functioneren van de website en kunnen niet worden uitgeschakeld. Ze worden meestal alleen ingesteld als reactie op acties die je uitvoert, zoals het instellen van je privacyvoorkeuren, inloggen of het invullen van formulieren.',
        label: 'Strict noodzakelijke cookies',
        required: true,
      },
      {
        id: 'analytics',
        description:
          "Deze cookies stellen ons in staat om het aantal bezoekers en de bronnen van het verkeer te tellen, zodat we de prestaties van onze site kunnen meten en verbeteren. Ze helpen ons te weten welke pagina's het meest en het minst populair zijn en hoe bezoekers zich door de site bewegen.",
        label: 'Statistiek cookies',
        required: false,
      },
      {
        id: 'preferences',
        description:
          'Deze cookies maken het mogelijk om functionaliteiten te bieden en persoonlijke voorkeuren op te slaan, zoals je taal, regio of gebruikersnaam. Ze kunnen ook worden gebruikt om diensten te leveren die je hebt aangevraagd, zoals het bekijken van een video of het plaatsen van een reactie op een blog.',
        label: 'Functionele cookies',
        required: false,
      },
    ],
    showLogo: true,
    title: 'Cookie-instellingen',
  },
};
