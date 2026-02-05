import type { StoryObj, Meta } from '@storybook/react-vite';
import { type NumberBadgeProps, NumberBadge } from '@nl-design-system-candidate/number-badge-react';

const meta = {
  id: 'number-badge',
  component: NumberBadge,
  title: 'Number Badge',
} satisfies Meta<typeof NumberBadge>;

export default meta;

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

export const DesignNumberBadgeColor: Story = {
  name: 'Design: Number Badge Color',
  args: {
    children: '42',
    label: '42 ongelezen berichten',
  },
  parameters: {
    designStory: true,
    tokens: {
      nl: {
        'number-badge': {
          'background-color': {
            $value: '',
          },
          'border-color': {
            $value: '',
          },
          color: {
            $value: '',
          },
        },
      },
    },
  },
};

export const DesignNumberBadgeBorder: Story = {
  name: 'Design: Number Badge Border',
  args: {
    children: '42',
    label: '42 ongelezen berichten',
  },
  parameters: {
    designStory: true,
    tokens: {
      nl: {
        'number-badge': {
          'border-radius': {
            $value: '',
          },
          'border-width': {
            $value: '',
          },
        },
      },
    },
  },
};

export const DesignNumberBadgeSize: Story = {
  name: 'Design: Number Badge Size',
  args: {
    children: '42',
    label: '42 ongelezen berichten',
  },
  parameters: {
    designStory: true,
    tokens: {
      nl: {
        'number-badge': {
          'min-block-size': {
            $value: '',
          },
          'min-inline-size': {
            $value: '',
          },
          'padding-block': {
            $value: '',
          },
          'padding-inline': {
            $value: '',
          },
        },
      },
    },
  },
};

export const DesignNumberBadgeTypography: Story = {
  name: 'Design: Number Badge Typography',
  args: {
    children: '42',
    label: '42 ongelezen berichten',
  },
  parameters: {
    designStory: true,
    tokens: {
      nl: {
        'number-badge': {
          'font-family': {
            $value: '',
          },
          'font-size': {
            $value: '',
          },
          'font-weight': {
            $value: '',
          },
        },
      },
    },
  },
};
