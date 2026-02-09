import type { StoryObj, Meta } from '@storybook/react-vite';
import css from '@nl-design-system-candidate/skip-link-css/skip-link.css?inline';
import { type SkipLinkProps, SkipLink } from '@nl-design-system-candidate/skip-link-react';
import tokens from '@nl-design-system-candidate/skip-link-tokens';

const meta = {
  id: 'skip-link',
  component: SkipLink,
  parameters: {
    css: [css],
    tokens,
  },
  title: 'Skip Link',
} satisfies Meta<typeof SkipLink>;

export default meta;

type Story = StoryObj<SkipLinkProps>;

export const SkipLinkStory: Story = {
  name: 'Skip Link',
  args: {
    children: 'Naar de inhoud',
    href: '#inhoud',
  },
};

export const DesignSkipLinkTypography: Story = {
  name: 'Design: Skip Link Typography',
  args: {
    children: 'Naar de inhoud',
    className: 'nl-skip-link--visible',
    href: '#inhoud',
    style: {
      position: 'static',
    },
  },
  parameters: {
    designStory: true,
    editableTokens: {
      nl: {
        'skip-link': {
          'font-size': {
            $value: '',
          },
          'line-height': {
            $value: '',
          },
          'text-decoration-thickness': {
            $value: '',
          },
          'text-underline-offset': {
            $value: '',
          },
        },
      },
    },
  },
};

export const DesignSkipLinkSize: Story = {
  name: 'Design: Skip Link Size',
  args: {
    children: 'Naar de inhoud',
    className: 'nl-skip-link--visible',
    href: '#inhoud',
    style: {
      position: 'static',
    },
  },
  parameters: {
    designStory: true,
    editableTokens: {
      nl: {
        'skip-link': {
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

export const DesignSkipLinkFocus: Story = {
  name: 'Design: Skip Link Focus',
  args: {
    children: 'Naar de inhoud',
    className: 'nl-skip-link--visible',
    href: '#inhoud',
    style: {
      position: 'static',
    },
  },
  parameters: {
    designStory: true,
    editableTokens: {
      nl: {
        'skip-link': {
          'background-color': {
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
