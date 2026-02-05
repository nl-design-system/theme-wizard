import type { Meta, StoryObj } from '@storybook/react-vite';
import description from '@nl-design-system-candidate/link-docs/docs/description.md?raw';
import { Link as LinkComponent, type LinkProps } from '@nl-design-system-candidate/link-react';
import tokens from '@nl-design-system-candidate/link-tokens';

const meta: Meta<typeof LinkComponent> = {
  id: 'link',
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
    tokens,
  },
  title: 'React Componenten/Link',
} satisfies Meta<typeof LinkComponent>;

export default meta;

type Story = StoryObj<LinkProps>;

const RenderLinkStates = ({ ...props }: LinkProps) => (
  <>
    <LinkComponent {...props} />
    {' → :hover → '}
    <LinkComponent {...props} className="nl-link--hover" />
    {' → :active → '}
    <LinkComponent {...props} className="nl-link--active" />
  </>
);

export const DesignLinkStates: Story = {
  name: 'Design: Link States',
  args: {
    children: 'example.com',
    href: 'https://example.com/',
  },
  parameters: {
    designStory: true,
    tokens: {
      nl: {
        link: {
          active: {
            color: {
              $value: '0',
            },
          },
          color: {
            $value: '0',
          },
          hover: {
            color: {
              $value: '0',
            },
            'text-decoration-line': {
              $value: '0',
            },
            'text-decoration-thickness': {
              $value: '0',
            },
          },
          'text-decoration-color': {
            $value: '0',
          },
          'text-decoration-line': {
            $value: '0',
          },
          'text-decoration-thickness': {
            $value: '0',
          },
          'text-underline-offset': {
            $value: '0',
          },
        },
      },
    },
  },
  render: RenderLinkStates,
};
export const DesignLinkDisabled: Story = {
  name: 'Design: Disabled Link',
  args: {
    children: 'voorbeeldsite',
    disabled: true,
    href: 'https://example.com',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: 'Een disabled link',
      },
    },
    tokens: {
      nl: {
        link: {
          disabled: {
            color: {
              $value: '',
            },
            cursor: {
              $value: '',
            },
          },
        },
      },
    },
  },
};
export const DesignLinkCurrent: Story = {
  name: 'Design: Current Link',
  args: {
    children: 'voorbeeldsite',
    href: 'https://example.com',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: 'Een current link',
      },
    },
    tokens: {
      nl: {
        link: {
          current: {
            cursor: {
              $value: '',
            },
          },
        },
      },
    },
  },
};
