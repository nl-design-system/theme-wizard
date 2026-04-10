import type { Meta, StoryObj } from '@storybook/react-vite';
import css from '@nl-design-system-candidate/heading-css/heading.css?inline';
import { Heading, type HeadingProps } from '@nl-design-system-candidate/heading-react';
import tokens from '@nl-design-system-candidate/heading-tokens';
import { Paragraph } from '@nl-design-system-candidate/paragraph-react';
import { createHeadingPreview, headingSampleText, renderHeadingLevelsPreview } from './heading-react.story-helpers';

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

export const Heading1MetMeerdereRegelsTekst: Story = {
  name: 'Heading 1 met meerdere regels tekst',
  args: {
    children: (
      <>
        When the pawn hits the conflicts he thinks like a king
        <br />
        What he knows throws the blows when he goes to the fight
        <br />
        And he'll win the whole thing 'fore he enters the ring
        <br />
        There's no body to batter when your mind is your might
        <br />
        So when you go solo, you hold your own hand
        <br />
        And remember that depth is the greatest of heights
        <br />
        And if you know where you stand, then you know where to land
        <br />
        And if you fall it won't matter, cuz you'll know that you're right
      </>
    ),
    level: 1,
  },
  decorators: (Story) => (
    <>
      {Story()}
      <Paragraph>
        "When the Pawn..." is the second studio album by the American singer-songwriter Fiona Apple. Released by Epic
        Records in the United States on November 9, 1999, When the Pawn... was wholly written by Apple, with production
        by Jon Brion.
      </Paragraph>
      <Paragraph>
        Upon its release, "When the Pawn..." broke the record for longest album title at 444 characters (previously held
        by a volume in "The Best... Album in the World...Ever!"), though this record was subsequently broken.
      </Paragraph>
    </>
  ),
  globals: {
    dir: 'ltr',
    lang: 'en',
    title: 'When the Pawn...',
  },
  parameters: {
    docs: {
      description: {
        story: `Een Heading (level 1) met een tekst die met line breaks over meerder regels is verdeeld.

Bron: [When the Pawn... - Wikipedia](https://en.wikipedia.org/wiki/When_the_Pawn...)

Dit is een voorbeeld van een Heading met \`<br/>\` elementen, een situatie die soms voorkomt in de praktijk.

Dit voorbeeld voldoet niet aan de best practices van NL Design System om de tekst van de Heading niet te lang te maken.`,
      },
    },
    status: { type: [] },
  },
};

export const WizardPreview: Story = {
  name: 'Wizard Preview',
  args: {
    children: headingSampleText,
    level: 1,
  },
  render: (args) => renderHeadingLevelsPreview(args),
};

export const Heading1Preview: Story = createHeadingPreview('Heading 1 Preview', 1);
export const Heading2Preview: Story = createHeadingPreview('Heading 2 Preview', 2);
export const Heading3Preview: Story = createHeadingPreview('Heading 3 Preview', 3);
export const Heading4Preview: Story = createHeadingPreview('Heading 4 Preview', 4);
export const Heading5Preview: Story = createHeadingPreview('Heading 5 Preview', 5);
export const Heading6Preview: Story = createHeadingPreview('Heading 6 Preview', 6);
export const Heading1CardPreview: Story = createHeadingPreview('Heading 1 Card Preview', 1, 'Theme wizard');
export const Heading2CardPreview: Story = createHeadingPreview('Heading 2 Card Preview', 2, 'Theme wizard');
export const Heading3CardPreview: Story = createHeadingPreview('Heading 3 Card Preview', 3, 'Theme wizard');
export const Heading4CardPreview: Story = createHeadingPreview('Heading 4 Card Preview', 4, 'Theme wizard');
export const Heading5CardPreview: Story = createHeadingPreview('Heading 5 Card Preview', 5, 'Theme wizard');
export const Heading6CardPreview: Story = createHeadingPreview('Heading 6 Card Preview', 6, 'Theme wizard');
export const AllHeadingsPreview: Story = createHeadingPreview('All Headings Preview');

export const AdvancedHeadingSizes: Story = {
  name: 'Heading Sizes',
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    level: 1,
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Gebruik dit overzicht om de \`font-size\` van elke Heading op elkaar af te stemmen.`,
      },
    },
    editableTokens: {
      basis: {
        text: {
          'font-size': {
            '2xl': { $value: '' },
            '3xl': { $value: '' },
            '4xl': { $value: '' },
            lg: { $value: '' },
            md: { $value: '' },
            sm: { $value: '' },
            xl: { $value: '' },
          },
        },
      },
      nl: {
        heading: {
          'level-1': {
            'font-size': { $value: '' },
          },
          'level-2': {
            'font-size': { $value: '' },
          },
          'level-3': {
            'font-size': { $value: '' },
          },
          'level-4': {
            'font-size': { $value: '' },
          },
          'level-5': {
            'font-size': { $value: '' },
          },
          'level-6': {
            'font-size': { $value: '' },
          },
        },
      },
    },
  },
  render: renderHeadingLevelsPreview,
};
