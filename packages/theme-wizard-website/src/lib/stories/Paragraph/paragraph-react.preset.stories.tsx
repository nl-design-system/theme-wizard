import type { ParagraphProps } from '@nl-design-system-candidate/paragraph-react';
import type { StoryObj } from '@storybook/react-vite';

type Story = StoryObj<ParagraphProps>;

export const ParagraphFontSize: Story = {
  name: 'Paragraph font-size',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
  },
  parameters: {
    presets: [
      {
        name: 'Kies de grootte van de paragraph',
        description: 'Bepaal of de gewone paragraph compacter of juist ruimtelijker leest.',
        options: [
          {
            name: 'Aanbevolen',
            description: 'Gebruik de standaard uit het startthema.',
            tokens: {
              nl: {
                paragraph: {
                  'font-size': { $value: '{basis.text.font-size.md}' },
                },
              },
            },
          },
          {
            name: 'Ruim',
            description: 'Maak de paragraph iets groter dan de standaard.',
            tokens: {
              nl: {
                paragraph: {
                  'font-size': { $value: '{basis.text.font-size.lg}' },
                },
              },
            },
          },
          {
            name: 'Extra ruim',
            description: 'Gebruik een extra grote paragraph uit het startthema.',
            tokens: {
              nl: {
                paragraph: {
                  'font-size': { $value: '{basis.text.font-size.xl}' },
                },
              },
            },
          },
        ],
      },
    ],
    wizard: {
      previewStoryIds: ['ParagraphStory'],
    },
  },
};

export const LeadParagraphFontSize: Story = {
  name: 'Lead font-size',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
    purpose: 'lead',
  },
  parameters: {
    presets: [
      {
        name: 'Kies de grootte van de lead paragraph',
        description: 'Bepaal of de lead paragraph de startthema-grootte houdt of extra nadruk krijgt.',
        options: [
          {
            name: 'Aanbevolen',
            description: 'Gebruik de standaard uit het startthema.',
            tokens: {
              nl: {
                paragraph: {
                  lead: {
                    'font-size': { $value: '{basis.text.font-size.lg}' },
                  },
                },
              },
            },
          },
          {
            name: 'Extra ruim',
            description: 'Maak de lead paragraph groter voor extra nadruk.',
            tokens: {
              nl: {
                paragraph: {
                  lead: {
                    'font-size': { $value: '{basis.text.font-size.xl}' },
                  },
                },
              },
            },
          },
        ],
      },
    ],
    wizard: {
      previewStoryIds: ['LeadParagraphStory'],
    },
  },
};

export const LeadParagraphColor: Story = {
  name: 'Lead color',
  args: {
    children: 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.',
    purpose: 'lead',
  },
  parameters: {
    presets: [
      {
        name: 'Kies de kleur van de lead paragraph',
        description: 'Laat de lead paragraph het startthema volgen of geef hem een accentkleur.',
        options: [
          {
            name: 'Aanbevolen',
            description: 'Gebruik de standaard uit het startthema.',
            tokens: {
              nl: {
                paragraph: {
                  color: { $value: '{basis.color.default.color-document}' },
                },
              },
            },
          },
          {
            name: 'Accentkleur 1',
            description: 'Overschrijf de lead paragraph met een accentkleur.',
            tokens: {
              nl: {
                paragraph: {
                  color: { $value: '{basis.color.accent-1.color-document}' },
                },
              },
            },
          },
          {
            name: 'Accentkleur 2',
            description: 'Overschrijf de lead paragraph met een accentkleur.',
            tokens: {
              nl: {
                paragraph: {
                  color: { $value: '{basis.color.accent-2.color-document}' },
                },
              },
            },
          },
          {
            name: 'Accentkleur 3',
            description: 'Overschrijf de lead paragraph met een accentkleur.',
            tokens: {
              nl: {
                paragraph: {
                  color: { $value: '{basis.color.accent-3.color-document}' },
                },
              },
            },
          },
        ],
      },
    ],
    wizard: {
      previewStoryIds: ['LeadParagraphStory'],
    },
  },
};
