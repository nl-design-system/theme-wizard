import type { Meta, StoryObj } from '@storybook/react-vite';
import css from '@nl-design-system-candidate/number-badge-css/number-badge.css?inline';
import { NumberBadge, type NumberBadgeProps } from '@nl-design-system-candidate/number-badge-react';
import tokens from '@nl-design-system-candidate/number-badge-tokens';

const meta = {
  id: 'number-badge',
  component: NumberBadge,
  parameters: {
    css: [css],
    tokens,
  },
  title: 'Number Badge',
} satisfies Meta<typeof NumberBadge>;

export default meta;

export * from './number-badge-react.preset.stories';
export * from './number-badge-react.advanced-stories';

type Story = StoryObj<NumberBadgeProps>;

export const NumberBadgeStory: Story = {
  name: 'Number Badge',
  args: {
    children: '42',
  },
};

export const NumberBadgeMetValue: Story = {
  name: 'Number Badge met "value"',
  args: {
    children: '42',
    value: 42,
  },
};

export const NumberBadgeMetLabel: Story = {
  name: 'Number Badge met "label"',
  args: {
    children: '42',
    label: '42 ongelezen berichten',
    value: 42,
  },
};

export const WizardPreview: Story = {
  name: 'Wizard Preview',
  parameters: {
    wizard: {
      preview: true,
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <NumberBadge>3</NumberBadge>
      <NumberBadge value={42}>42</NumberBadge>
      <NumberBadge label="99 ongelezen berichten" value={99}>
        99
      </NumberBadge>
    </div>
  ),
};
