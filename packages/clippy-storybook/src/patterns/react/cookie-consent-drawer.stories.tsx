/* @license CC0-1.0 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { CookieConsentDrawer } from '@nl-design-system-community/clippy-components';
import readme from '@nl-design-system-community/clippy-components/patterns/cookie-consent/react/README.md?raw';
import '@utrecht/component-library-css';

const meta = {
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
    clearStorageOnMount: true,
  },
};
