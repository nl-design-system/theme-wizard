import type { Meta, StoryObj } from '@storybook/react-vite';
import css from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import { DataBadge, type DataBadgeProps } from '@nl-design-system-candidate/data-badge-react';

const meta = {
  id: 'data-badge',
  component: DataBadge,
  parameters: {
    css: [css],
  },
  title: 'Data Badge',
} satisfies Meta<typeof DataBadge>;

export default meta;

type Story = StoryObj<DataBadgeProps>;

export const DataBadgeStory: Story = {
  name: 'Data Badge (met chilren)',
  args: {
    children: '42',
  },
};

export const DataBadgeMetValue: Story = {
  name: 'Data Badge met "value"',
  args: {
    children: '42',
    value: '42',
  },
};

export const DataBadgeMetDateTime: Story = {
  name: 'Data Badge met "dateTime"',
  args: {
    children: 'Donderdag 1 januari 1970 om 01:00:00',
    dateTime: '1970-01-01T00:00:00+01:00',
  },
};

export const DesignDataBadgeSize: Story = {
  name: 'Design: Data Badge Size',
  args: {
    children: '42',
  },
  parameters: {
    designStory: true,
    editableTokens: {
      nl: {
        'data-badge': {
          'min-block-size': {
            $value: '0',
          },
          'min-inline-size': {
            $value: '0',
          },
          'padding-block': {
            $value: '0',
          },
          'padding-inline': {
            $value: '0',
          },
        },
      },
    },
  },
};

export const DesignDataBadgeTypography: Story = {
  name: 'Design: Data Badge Typography',
  args: {
    children: '42',
  },
  parameters: {
    designStory: true,
    editableTokens: {
      nl: {
        'data-badge': {
          'font-family': {
            $value: '0',
          },
          'font-size': {
            $value: '0',
          },
          'font-weight': {
            $value: '0',
          },
          'line-height': {
            $value: '0',
          },
        },
      },
    },
  },
};

export const DesignDataBadgeColor: Story = {
  name: 'Design: Data Badge Color',
  args: {
    children: '42',
  },
  parameters: {
    designStory: true,
    editableTokens: {
      nl: {
        'data-badge': {
          'background-color': {
            $value: '0',
          },
          color: {
            $value: '0',
          },
        },
      },
    },
  },
};

export const DesignDataBadgeBorder: Story = {
  name: 'Design: Data Badge Border',
  args: {
    children: '42',
  },
  parameters: {
    designStory: true,
    editableTokens: {
      nl: {
        'data-badge': {
          'border-color': {
            $value: '0',
          },
          'border-radius': {
            $value: '0',
          },
          'border-width': {
            $value: '0',
          },
        },
      },
    },
  },
};
