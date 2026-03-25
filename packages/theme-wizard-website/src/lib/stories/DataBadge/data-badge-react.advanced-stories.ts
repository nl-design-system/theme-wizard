import type { DataBadgeProps } from '@nl-design-system-candidate/data-badge-react';
import type { StoryObj } from '@storybook/react-vite';

type Story = StoryObj<DataBadgeProps>;

const tokenValue = (value: string) => ({ $value: value });

const createDataBadgeEditableTokens = (tokenNames: string[]) => ({
  nl: {
    'data-badge': Object.fromEntries(tokenNames.map((tokenName) => [tokenName, tokenValue('0')])),
  },
});

const createAdvancedStory = ({
  name,
  args,
  description,
  question,
  tokenNames,
}: {
  args: DataBadgeProps;
  description: string;
  name: string;
  question: string;
  tokenNames: string[];
}): Story => ({
  name,
  args,
  parameters: {
    designStory: true,
    editableTokens: createDataBadgeEditableTokens(tokenNames),
    wizard: {
      description,
      question,
      type: 'advanced',
    },
  },
});

export const AdvancedDataBadgeSize: Story = createAdvancedStory({
  name: 'Advanced: Data Badge Size',
  args: {
    children: '42',
  },
  description: 'Gebruik deze geavanceerde instellingen alleen als je de badge compacter of ruimer wilt afstellen.',
  question: 'Wil je de grootte van de Data Badge verder verfijnen?',
  tokenNames: ['min-block-size', 'min-inline-size', 'padding-block', 'padding-inline'],
});

export const AdvancedDataBadgeTypography: Story = createAdvancedStory({
  name: 'Advanced: Data Badge Typography',
  args: {
    children: '42',
  },
  description: 'Gebruik deze geavanceerde instellingen alleen als je lettertype, grootte of regelhoogte precies wilt bijsturen.',
  question: 'Wil je de typografie van de Data Badge verder verfijnen?',
  tokenNames: ['font-family', 'font-size', 'font-weight', 'line-height'],
});

export const AdvancedDataBadgeColor: Story = createAdvancedStory({
  name: 'Advanced: Data Badge Color',
  args: {
    children: '42',
  },
  description: 'Gebruik deze geavanceerde instellingen alleen als je de badgekleur of tekstkleur handmatig wilt afstemmen.',
  question: 'Wil je de kleurinstellingen van de Data Badge verder verfijnen?',
  tokenNames: ['background-color', 'color'],
});

export const AdvancedDataBadgeBorder: Story = createAdvancedStory({
  name: 'Advanced: Data Badge Border',
  args: {
    children: '42',
  },
  description: 'Gebruik deze geavanceerde instellingen alleen als je randkleur, randbreedte of afronding precies wilt instellen.',
  question: 'Wil je de rand en afronding van de Data Badge verder verfijnen?',
  tokenNames: ['border-color', 'border-radius', 'border-width'],
});
