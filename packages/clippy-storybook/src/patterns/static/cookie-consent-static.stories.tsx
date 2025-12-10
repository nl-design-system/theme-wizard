/* @license CC0-1.0 */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import {
  cookieDrawer,
  cookieForm,
  cookieModal,
  cookiesPage,
  readme,
} from '@nl-design-system-community/clippy-components/patterns/cookie-consent';
import { html, unsafeStatic } from 'lit/static-html.js';

const meta = {
  id: 'cookie-consent',
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  tags: ['autodocs'],
  title: 'Patterns/Cookie Consent/Static',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Modal: Story = {
  name: 'Cookie Modal',
  parameters: {
    docs: {
      description: {
        story: 'Een blokkerende cookie consent modal die verschijnt bij het eerste bezoek aan de website.',
      },
    },
  },
  render: () => {
    // Clear localStorage to ensure modal shows
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      globalThis.localStorage.removeItem('cookie-consent-preferences');
    }

    return html`${unsafeStatic(cookieModal)}
      <script type="module">
        // Clear localStorage on story load
        if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
          globalThis.localStorage.removeItem('cookie-consent-preferences');
        }
      </script>`;
  },
};

export const Drawer: Story = {
  name: 'Cookie Drawer',
  parameters: {
    docs: {
      description: {
        story: 'Een non-blocking cookie banner die bovenaan de pagina verschijnt.',
      },
    },
  },
  render: () => {
    // Clear localStorage to ensure drawer shows
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      globalThis.localStorage.removeItem('cookie-consent-preferences');
    }

    return html`${unsafeStatic(cookieDrawer)}
      <style>
        /* Reset to show drawer for demo */
        clippy-cookie-consent-drawer {
          display: block !important;
        }
      </style>
      <script type="module">
        // Clear localStorage on story load
        if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
          globalThis.localStorage.removeItem('cookie-consent-preferences');
        }
      </script>`;
  },
};

export const Form: Story = {
  name: 'Cookie Form',
  parameters: {
    docs: {
      description: {
        story: 'Het herbruikbare cookie preferences formulier met radio buttons.',
      },
    },
  },
  render: () => {
    return html`${unsafeStatic(cookieForm)}`;
  },
};

export const SettingsPage: Story = {
  name: 'Cookie Settings Page',
  parameters: {
    docs: {
      description: {
        story: 'Een volledige cookie instellingen pagina waar gebruikers hun voorkeuren kunnen beheren.',
      },
    },
  },
  render: () => {
    // Inject both the form and the page
    const pageWithForm = cookiesPage.replace('<clippy-cookie-form></clippy-cookie-form>', cookieForm);

    return html`${unsafeStatic(pageWithForm)}`;
  },
};
