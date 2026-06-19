import type { Meta, StoryObj } from '@storybook/react-vite';
import css from '@nl-design-system-candidate/link-css/link.css?inline';
import description from '@nl-design-system-candidate/link-docs/docs/description.md?raw';
import { Link as LinkComponent, type LinkProps } from '@nl-design-system-candidate/link-react';
import tokens from '@nl-design-system-candidate/link-tokens';
import { WizardPreviewLayout, WizardPreviewSection } from '../story-helpers';

const meta: Meta<typeof LinkComponent> = {
  id: 'link',
  component: LinkComponent,
  parameters: {
    css: [css],
    docs: {
      description: {
        component: description,
      },
    },
    tokens,
  },
  title: 'Link',
} satisfies Meta<typeof LinkComponent>;

export default meta;

export * from './link-react.preset.stories';
export * from './link-react.advanced-stories';

type Story = StoryObj<LinkProps>;

export const Link: Story = {
  name: 'Link',
  args: {
    children: 'example.com',
    href: 'https://example.com/',
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
    <WizardPreviewLayout
      css={css}
      states={{
        'link-active': ['hover', 'active'],
        'link-hover': ['hover'],
      }}
    >
      <WizardPreviewSection label="Normaal">
        <LinkComponent href="https://example.com/">example.com</LinkComponent>
      </WizardPreviewSection>

      <WizardPreviewSection label="Hover">
        <LinkComponent href="https://example.com/" id="link-hover">
          example.com
        </LinkComponent>
      </WizardPreviewSection>

      <WizardPreviewSection label="Active">
        <LinkComponent href="https://example.com/" id="link-active">
          example.com
        </LinkComponent>
      </WizardPreviewSection>
    </WizardPreviewLayout>
  ),
};

export const WizardPreviewCurrent: Story = {
  name: 'Wizard Preview Current',
  parameters: {
    wizard: {
      preview: true,
    },
  },
  render: () => (
    <WizardPreviewLayout>
      <WizardPreviewSection label="Current">
        <LinkComponent className="nl-link--current" href="https://example.com/">
          example.com
        </LinkComponent>
      </WizardPreviewSection>
    </WizardPreviewLayout>
  ),
};

export const WizardPreviewDisabled: Story = {
  name: 'Wizard Preview Disabled',
  parameters: {
    wizard: {
      preview: true,
    },
  },
  render: () => (
    <WizardPreviewLayout>
      <WizardPreviewSection label="Disabled">
        <LinkComponent disabled href="https://example.com/">
          example.com
        </LinkComponent>
      </WizardPreviewSection>
    </WizardPreviewLayout>
  ),
};
