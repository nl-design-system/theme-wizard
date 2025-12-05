/* @license CC0-1.0 */

import type { Meta, StoryObj } from '@storybook/react';
import readme from '@nl-design-system-community/theme-wizard-app/src/components/template-code/README.md?raw';
import { PropsWithChildren } from 'react';

const Code = ({ children }: PropsWithChildren) => <template-code>{children}</template-code>;

const meta = {
  id: 'web-component-code',
  args: {
    children: 'Opslaan en verder',
  },
  argTypes: {
    children: {
      name: 'Content',
      defaultValue: '',
      description: 'Code',
      type: {
        name: 'string',
        required: true,
      },
    },
  },
  component: Code,
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  tags: ['autodocs'],
  title: 'Web Component/Code',
} satisfies Meta<typeof Code>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Example code',
};
