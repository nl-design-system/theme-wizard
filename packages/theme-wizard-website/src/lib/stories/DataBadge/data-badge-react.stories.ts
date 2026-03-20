import type { Meta, StoryObj } from '@storybook/react-vite';
import css from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import { DataBadge, type DataBadgeProps } from '@nl-design-system-candidate/data-badge-react';
import tokens from '@nl-design-system-candidate/data-badge-tokens';

const meta = {
  id: 'data-badge',
  component: DataBadge,
  parameters: {
    css: [css],
    tokens,
  },
  title: 'Data Badge',
} satisfies Meta<typeof DataBadge>;

export default meta;

export * from './data-badge-react.preset.stories';

type Story = StoryObj<DataBadgeProps>;

export const DataBadgeWithChildren: Story = {
  name: 'Data Badge (met chilren)',
  args: {
    children: '42',
  },
};

export const DataBadgeWithValue: Story = {
  name: 'Data Badge met "value"',
  args: {
    children: '42',
    value: '42',
  },
};

export const DataBadgeWithDateTime: Story = {
  name: 'Data Badge met "dateTime"',
  args: {
    children: 'Donderdag 1 januari 1970 om 01:00:00',
    dateTime: '1970-01-01T00:00:00+01:00',
  },
};

export const WizardPreview: Story = {
  name: 'Wizard Preview',
  args: {
    children: 'Nieuwe melding',
  },
};
