import type { Meta, StoryObj } from '@storybook/react-vite';
import css from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import { DataBadge, type DataBadgeProps } from '@nl-design-system-candidate/data-badge-react';
import tokens from '@nl-design-system-candidate/data-badge-tokens';
import {
  dataBadgeWizardStepBorder,
  dataBadgeWizardStepColor,
  dataBadgeWizardStepSize,
  dataBadgeWizardStepTypography,
} from './data-badge-react.story-helpers';

const meta = {
  id: 'data-badge',
  component: DataBadge,
  parameters: {
    css: [css],
    tokens,
  },
  title: 'Data Badge',
} satisfies Meta<typeof DataBadge>;

export default meta;

type Story = StoryObj<DataBadgeProps>;

export const DataBadgeWithChildren: Story = {
  name: 'Data Badge (met chilren)',
  args: {
    children: '42',
  },
};

export const DataBadgeWithValue: Story = {
  name: 'Data Badge met "value"',
  args: {
    children: '42',
    value: '42',
  },
};

export const DataBadgeWithDateTime: Story = {
  name: 'Data Badge met "dateTime"',
  args: {
    children: 'Donderdag 1 januari 1970 om 01:00:00',
    dateTime: '1970-01-01T00:00:00+01:00',
  },
};

export const WizardPreview: Story = {
  name: 'Wizard Preview',
  args: {
    children: 'Nieuwe melding',
  },
};

export const DataBadgeKleur: Story = {
  name: 'Kleur',
  args: {
    children: '42',
  },
  parameters: {
    presets: [
      {
        name: 'Kies de kleur voor de Data Badge',
        description: 'De achtergrondkleur en tekstkleur bepalen hoe de badge opvalt in de interface.',
        options: [
          {
            name: 'Actiekleur',
            description: 'Gebruikt de primaire actiekleur, geschikt voor notificaties.',
            tokens: {
              nl: {
                'data-badge': {
                  'background-color': { $value: '{basis.color.action-1-inverse.bg-default}' },
                  color: { $value: '{basis.color.action-1-inverse.color-default}' },
                },
              },
            },
          },
          {
            name: 'Neutrale kleur',
            description: 'Gebruikt een neutrale achtergrond, minder opvallend.',
            tokens: {
              nl: {
                'data-badge': {
                  'background-color': { $value: '{basis.color.default.bg-subtle}' },
                  color: { $value: '{basis.color.default.color-default}' },
                },
              },
            },
          },
        ],
      },
    ],
  },
};

export const DataBadgeVorm: Story = {
  name: 'Vorm',
  args: {
    children: 'Nieuwe melding',
  },
  parameters: {
    presets: [
      {
        name: 'Kies de vorm van de Data Badge',
        options: [
          {
            name: 'Pill',
            description: 'Volledig afgerond, klassieke badge-vorm.',
            tokens: {
              nl: {
                'data-badge': {
                  'border-radius': { $value: '{basis.border-radius.round}' },
                },
              },
            },
          },
          {
            name: 'Afgerond',
            description: 'Subtiel afgeronde hoeken.',
            tokens: {
              nl: {
                'data-badge': {
                  'border-radius': { $value: '{basis.border-radius.md}' },
                },
              },
            },
          },
          {
            name: 'Rechthoekig',
            description: 'Geen afgeronde hoeken.',
            tokens: {
              nl: {
                'data-badge': {
                  'border-radius': { $value: '0' },
                },
              },
            },
          },
        ],
      },
    ],
  },
};

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
      description: 'De veilige keuzes zijn al gemaakt. Gebruik deze geavanceerde instellingen alleen als je de badge compacter of ruimer wilt afstellen.',
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
      description: 'De veilige keuzes zijn al gemaakt. Gebruik deze geavanceerde instellingen alleen als je lettertype, grootte of regelhoogte precies wilt bijsturen.',
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
      description: 'De veilige keuzes zijn al gemaakt. Gebruik deze geavanceerde instellingen alleen als je de badgekleur of tekstkleur handmatig wilt afstemmen.',
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
      description: 'De veilige keuzes zijn al gemaakt. Gebruik deze geavanceerde instellingen alleen als je randkleur, randbreedte of afronding precies wilt instellen.',
      question: 'Wil je de rand en afronding van de Data Badge verder verfijnen?',
    },
  },
};
