/* @license CC0-1.0 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { CookieConsentDrawer } from './CookieConsentDrawer';
import '@utrecht/component-library-css';

const meta = {
  component: CookieConsentDrawer,
  parameters: {
    docs: {
      description: {
        component: 'Een non-blocking cookie consent drawer die bovenaan de pagina verschijnt.',
      },
    },
  },
  tags: ['autodocs'],
  title: 'Patterns/Cookie Consent/React/Drawer',
} satisfies Meta<typeof CookieConsentDrawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ReactDrawer: Story = {
  name: 'Cookie Drawer',
  args: {
    clearStorageOnMount: true,
  },
};
