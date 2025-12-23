/* @license CC0-1.0 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import GemeenteVoorbeeldHome, {
  type GemeenteVoorbeeldHomeProps,
} from '@nl-design-system-community/theme-wizard-templates/src/pages/gemeentevoorbeeld/GemeenteVoorbeeldHome';
import * as React from 'react';

const meta = {
  component: GemeenteVoorbeeldHome as React.ComponentType<GemeenteVoorbeeldHomeProps>,
  decorators: [
    (Story) => {
      if (typeof globalThis !== 'undefined' && 'document' in globalThis) {
        const doc = (globalThis as typeof globalThis & { document?: Document }).document;
        const html = doc?.documentElement;
        const body = doc?.body;

        html?.classList.add('utrecht-page-layout', 'utrecht-root', 'ma-theme');
        html?.classList.remove('start-theme');
        body?.classList.add('utrecht-page-body');
      }

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        component: 'Gemeente Voorbeeld homepage op basis van Utrecht componenten.',
      },
    },
    layout: 'fullscreen',
  },
  title: 'Templates/Gemeente Voorbeeld/Home',
} satisfies Meta<GemeenteVoorbeeldHomeProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Gemeente Voorbeeld Home',
};
