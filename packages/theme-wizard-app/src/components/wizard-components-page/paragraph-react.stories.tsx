import type { StoryObj, Meta } from '@storybook/react-vite';
import { Paragraph, type ParagraphProps } from '@nl-design-system-candidate/paragraph-react';

const meta = {
  id: 'paragraph',
  argTypes: {
    children: { table: { category: 'API' } },
    purpose: {
      control: { labels: { undefined: '(undefined)' }, type: 'select' },
      options: [undefined, 'lead'],
      table: { category: 'API' },
    },
  },
  component: Paragraph,
  title: 'Paragraph',
} satisfies Meta<typeof Paragraph>;

export default meta;

type Story = StoryObj<ParagraphProps>;

export const DesignParagraphShared: Story = {
  name: 'Design: Paragraph en Lead Paragraph',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
    purpose: undefined,
  },
  parameters: {
    designStory: true,
    tokens: {
      nl: {
        paragraph: {
          color: { $value: '' },
          'font-family': { $value: '' },
        },
      },
    },
  },
  render: ({ children }) => (
    <>
      <Paragraph purpose="lead">{children}</Paragraph>
      <Paragraph>{children}</Paragraph>
    </>
  ),
};
export const DesignParagraph: Story = {
  name: 'Design: Paragraph',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
    purpose: undefined,
  },
  parameters: {
    designStory: true,
    tokens: {
      nl: {
        paragraph: {
          'font-size': { $value: '' },
          'font-weight': { $value: '' },
          'line-height': { $value: '' },
          'margin-block-end': { $value: '' },
          'margin-block-start': { $value: '' },
        },
      },
    },
  },
};

export const DesignLead: Story = {
  name: 'Design: Paragraph Lead',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
    purpose: 'lead',
  },
  parameters: {
    designStory: true,
    tokens: {
      nl: {
        paragraph: {
          lead: {
            'font-size': { $value: '' },
            'font-weight': { $value: '' },
            'line-height': { $value: '' },
            'margin-block-end': { $value: '' },
            'margin-block-start': { $value: '' },
          },
        },
      },
    },
  },
};
