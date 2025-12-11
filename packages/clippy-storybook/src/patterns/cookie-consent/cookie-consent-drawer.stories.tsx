/* @license CC0-1.0 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Paragraph } from '@utrecht/component-library-react/dist/css-module';
import '@utrecht/component-library-css';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { CookieConsentDrawer } from './Drawer';
import readme from './README.md?raw';

const meta = {
  argTypes: {
    buttonAccept: {
      name: 'Button Accept',
      description: 'Label voor de accepteer knop',
      type: {
        name: 'string',
        required: false,
      },
    },
    buttonReject: {
      name: 'Button Reject',
      description: 'Label voor de weiger knop',
      type: {
        name: 'string',
        required: false,
      },
    },
    children: {
      name: 'Children',
      description: 'Custom content voor de drawer',
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
    title: {
      name: 'Title',
      description: 'Custom titel voor de drawer',
      type: {
        name: 'string',
        required: false,
      },
    },
  },
  component: CookieConsentDrawer,
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  tags: ['autodocs'],
  title: 'Patterns/Cookie Consent/Drawer',
} satisfies Meta<typeof CookieConsentDrawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ReactDrawer: Story = {
  name: 'Cookie Drawer',
  args: {
    children: (
      <Paragraph style={{ marginBlockEnd: 'var(--basis-space-block-md, 1rem)' }}>
        We willen graag aanvullende cookies plaatsen om te begrijpen hoe je deze website gebruikt, je instellingen te
        onthouden en onze diensten te verbeteren.
      </Paragraph>
    ),
    clearStorageOnMount: true,
    title: 'Cookies op deze website',
  },
};
