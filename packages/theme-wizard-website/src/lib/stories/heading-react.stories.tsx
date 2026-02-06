import type { HeadingProps } from '@nl-design-system-candidate/heading-react';
import type { StoryObj, Meta } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import css from '@nl-design-system-candidate/heading-css/heading.css?inline';
import { Heading } from '@nl-design-system-candidate/heading-react';
import { Paragraph } from '@nl-design-system-candidate/paragraph-react';

const meta = {
  id: 'heading',
  component: Heading,
  parameters: {
    css: [css],
  },
  title: 'Heading',
} satisfies Meta<typeof Heading>;

export default meta;

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

const clampStyles: CSSProperties = {
  display: '-webkit-box',
  lineClamp: 1,
  overflow: 'hidden',
  WebkitBoxOrient: 'block-axis',
  WebkitLineClamp: '1',
};

export const DesignHeadingSizes: Story = {
  name: 'Design: Heading Sizes',
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
    tokens: {
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
  render: ({ children }) => {
    return (
      <div>
        <Heading level={1} style={clampStyles}>
          {children}
        </Heading>
        <Heading level={2} style={clampStyles}>
          {children}
        </Heading>
        <Heading level={3} style={clampStyles}>
          {children}
        </Heading>
        <Heading level={4} style={clampStyles}>
          {children}
        </Heading>
        <Heading level={5} style={clampStyles}>
          {children}
        </Heading>
        <Heading level={6} style={clampStyles}>
          {children}
        </Heading>
      </div>
    );
  },
};
