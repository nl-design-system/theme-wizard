import type { Meta, StoryObj } from '@storybook/react-vite';
import css from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { Paragraph, type ParagraphProps } from '@nl-design-system-candidate/paragraph-react';
import tokens from '@nl-design-system-candidate/paragraph-tokens';
import { storySampleText } from '../story-helpers';

const meta = {
  id: 'paragraph',
  component: Paragraph,
  parameters: {
    css: [css],
    tokens,
  },
  title: 'Paragraph',
} satisfies Meta<typeof Paragraph>;

export default meta;

export { ParagraphFontSize, LeadParagraphFontSize, LeadParagraphColor } from './paragraph-react.preset.stories';
export { AdvancedParagraphShared, AdvancedParagraph, AdvancedLead } from './paragraph-react.advanced-stories';

type Story = StoryObj<ParagraphProps>;

export const ParagraphStory: Story = {
  name: 'Paragraph',
  args: {
    children: storySampleText,
    purpose: undefined,
  },
};

export const LeadParagraphStory: Story = {
  name: 'Lead Paragraph',
  args: {
    children: storySampleText,
    purpose: 'lead',
  },
};
