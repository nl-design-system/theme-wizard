import type { DataBadgeProps } from '@nl-design-system-candidate/data-badge-react';
import type { StoryObj } from '@storybook/react-vite';
import {
  dataBadgeWizardStepBorder,
  dataBadgeWizardStepColor,
  dataBadgeWizardStepSize,
  dataBadgeWizardStepTypography,
} from './data-badge-react.story-helpers';

type Story = StoryObj<DataBadgeProps>;

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
    wizard: {
      ...dataBadgeWizardStepSize,
      description:
        'De veilige keuzes zijn al gemaakt. Gebruik deze geavanceerde instellingen alleen als je de badge compacter of ruimer wilt afstellen.',
      question: 'Wil je de grootte van de Data Badge verder verfijnen?',
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
    wizard: {
      ...dataBadgeWizardStepTypography,
      description:
        'De veilige keuzes zijn al gemaakt. Gebruik deze geavanceerde instellingen alleen als je lettertype, grootte of regelhoogte precies wilt bijsturen.',
      question: 'Wil je de typografie van de Data Badge verder verfijnen?',
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
    wizard: {
      ...dataBadgeWizardStepColor,
      description:
        'De veilige keuzes zijn al gemaakt. Gebruik deze geavanceerde instellingen alleen als je de badgekleur of tekstkleur handmatig wilt afstemmen.',
      question: 'Wil je de kleurinstellingen van de Data Badge verder verfijnen?',
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
    wizard: {
      ...dataBadgeWizardStepBorder,
      description:
        'De veilige keuzes zijn al gemaakt. Gebruik deze geavanceerde instellingen alleen als je randkleur, randbreedte of afronding precies wilt instellen.',
      question: 'Wil je de rand en afronding van de Data Badge verder verfijnen?',
    },
  },
};
