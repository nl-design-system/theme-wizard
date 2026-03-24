import type { Meta, StoryObj } from '@storybook/react-vite';
import css from '@nl-design-system-candidate/heading-css/heading.css?inline';
import { Heading, type HeadingProps } from '@nl-design-system-candidate/heading-react';
import tokens from '@nl-design-system-candidate/heading-tokens';
import { HeadingAllLevels } from './heading-react.story-components';

const meta = {
  id: 'heading',
  component: Heading,
  parameters: {
    css: [css],
    tokens,
  },
  title: 'Heading',
} satisfies Meta<typeof Heading>;

export default meta;

export * from './heading-react.preset.stories';
export * from './heading-react.advanced-stories';

type Story = StoryObj<HeadingProps>;

export const WizardPreview: Story = {
  name: 'Wizard Preview',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
    level: 1,
  },
  render: (args) => <HeadingAllLevels {...args} />,
};

export const Heading1Preview: Story = {
  name: 'Heading 1 Preview',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
    level: 1,
  },
  render: (args) => <HeadingAllLevels {...args} />,
};

export const Heading2Preview: Story = {
  name: 'Heading 2 Preview',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
    level: 2,
  },
  render: (args) => <HeadingAllLevels {...args} />,
};

export const Heading3Preview: Story = {
  name: 'Heading 3 Preview',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
    level: 3,
  },
  render: (args) => <HeadingAllLevels {...args} />,
};

export const Heading4Preview: Story = {
  name: 'Heading 4 Preview',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
    level: 4,
  },
  render: (args) => <HeadingAllLevels {...args} />,
};

export const Heading5Preview: Story = {
  name: 'Heading 5 Preview',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
    level: 5,
  },
  render: (args) => <HeadingAllLevels {...args} />,
};

export const Heading6Preview: Story = {
  name: 'Heading 6 Preview',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
    level: 6,
  },
  render: (args) => <HeadingAllLevels {...args} />,
};

export const AllHeadingsPreview: Story = {
  name: 'All Headings Preview',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
  },
  render: (args) => <HeadingAllLevels {...args} />,
};
