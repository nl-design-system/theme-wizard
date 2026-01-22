import type { Meta, StoryObj } from '@storybook/react-vite';
import { GemeenteVoorbeeldHome, type GemeenteVoorbeeldHomeProps } from '@nl-design-system-community/theme-wizard-templates/react';
import * as React from 'react';
import '@utrecht/component-library-css';
import documentation from '../docs/templates/gemeente-voorbeeld-documentatie.md?raw';

const meta = {
  component: GemeenteVoorbeeldHome as React.ComponentType<GemeenteVoorbeeldHomeProps>,
  parameters: {
    docs: {
      description: {
        component: documentation,
      },
    },
    layout: 'fullscreen',
  },
  title: 'Templates/Gemeente Voorbeeld',
} satisfies Meta<GemeenteVoorbeeldHomeProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Gemeente Voorbeeld',
};
