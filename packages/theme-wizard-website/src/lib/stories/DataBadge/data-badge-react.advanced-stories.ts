import type { DataBadgeProps } from '@nl-design-system-candidate/data-badge-react';
import type { StoryObj } from '@storybook/react-vite';
import {
  dataBadgeWizardStepBorder,
  dataBadgeWizardStepColor,
  dataBadgeWizardStepSize,
  dataBadgeWizardStepTypography,
} from './data-badge-react.story-helpers';

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
  wizardStep,
}: {
  args: DataBadgeProps;
  description: string;
  name: string;
  question: string;
  tokenNames: string[];
  wizardStep: Record<string, unknown>;
}): Story => ({
  name,
  args,
  parameters: {
    designStory: true,
    editableTokens: createDataBadgeEditableTokens(tokenNames),
    wizard: {
      ...wizardStep,
      description,
      question,
    },
  },
});

export const DesignDataBadgeSize: Story = createAdvancedStory({
  name: 'Design: Data Badge Size',
  args: {
    children: '42',
  },
  description: 'Gebruik deze geavanceerde instellingen alleen als je de badge compacter of ruimer wilt afstellen.',
  question: 'Wil je de grootte van de Data Badge verder verfijnen?',
  tokenNames: ['min-block-size', 'min-inline-size', 'padding-block', 'padding-inline'],
  wizardStep: dataBadgeWizardStepSize,
});

export const DesignDataBadgeTypography: Story = createAdvancedStory({
  name: 'Design: Data Badge Typography',
  args: {
    children: '42',
  },
  description: 'Gebruik deze geavanceerde instellingen alleen als je lettertype, grootte of regelhoogte precies wilt bijsturen.',
  question: 'Wil je de typografie van de Data Badge verder verfijnen?',
  tokenNames: ['font-family', 'font-size', 'font-weight', 'line-height'],
  wizardStep: dataBadgeWizardStepTypography,
});

export const DesignDataBadgeColor: Story = createAdvancedStory({
  name: 'Design: Data Badge Color',
  args: {
    children: '42',
  },
  description: 'Gebruik deze geavanceerde instellingen alleen als je de badgekleur of tekstkleur handmatig wilt afstemmen.',
  question: 'Wil je de kleurinstellingen van de Data Badge verder verfijnen?',
  tokenNames: ['background-color', 'color'],
  wizardStep: dataBadgeWizardStepColor,
});

export const DesignDataBadgeBorder: Story = createAdvancedStory({
  name: 'Design: Data Badge Border',
  args: {
    children: '42',
  },
  description: 'Gebruik deze geavanceerde instellingen alleen als je randkleur, randbreedte of afronding precies wilt instellen.',
  question: 'Wil je de rand en afronding van de Data Badge verder verfijnen?',
  tokenNames: ['border-color', 'border-radius', 'border-width'],
  wizardStep: dataBadgeWizardStepBorder,
});
