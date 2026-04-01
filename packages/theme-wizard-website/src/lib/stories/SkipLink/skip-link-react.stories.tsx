import type { Meta, StoryObj } from '@storybook/react-vite';
import css from '@nl-design-system-candidate/skip-link-css/skip-link.css?inline';
import { SkipLink, type SkipLinkProps } from '@nl-design-system-candidate/skip-link-react';
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

export * from './skip-link-react.preset.stories';
export * from './skip-link-react.advanced-stories';

type Story = StoryObj<SkipLinkProps>;

export const SkipLinkStory: Story = {
  name: 'Skip Link',
  args: {
    children: 'Naar de inhoud',
    href: '#inhoud',
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
    <SkipLink className="nl-skip-link--visible" href="#inhoud" style={{ position: 'static' }}>
      Naar de inhoud
    </SkipLink>
  ),
};
