import { createPresetTokens, createRelativeFontSizePresetOptions, createPresetStory } from '../story-helpers';


const createSkipLinkTokens = (entries: Record<string, string>) => createPresetTokens('nl.skip-link', entries);


const defaultArgs = {
  children: 'Naar de inhoud',
  className: 'nl-skip-link--visible',
  href: '#inhoud',
  style: {
    position: 'static' as const,
  },
};

export const SkipLinkAfmeting = createPresetStory({
  name: 'Afmeting',
  args: defaultArgs,
  description: 'De minimale hoogte en breedte bepalen hoe gemakkelijk de skip link te raken is.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Ruim',
      description: 'Maak de skip link groter en makkelijker te raken.',
      tokens: createSkipLinkTokens({
        'min-block-size': '{basis.size.lg}',
        'min-inline-size': '{basis.size.lg}',
      }),
    },
  ],
  order: 1,
  question: 'Kies de minimale afmeting van de Skip Link',
});

export const SkipLinkPadding = createPresetStory({
  name: 'Padding',
  args: defaultArgs,
  description: 'De binnenruimte bepaalt hoeveel lucht rondom de tekst zit.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Compact',
      description: 'Minder witruimte binnen de skip link.',
      tokens: createSkipLinkTokens({
        'padding-block': '{basis.space.block.md}',
        'padding-inline': '{basis.space.inline.lg}',
      }),
    },
    {
      name: 'Ruim',
      description: 'Meer witruimte binnen de skip link.',
      tokens: createSkipLinkTokens({
        'padding-block': '{basis.space.block.xl}',
        'padding-inline': '{basis.space.inline.2xl}',
      }),
    },
  ],
  order: 2,
  question: 'Kies de padding van de Skip Link',
});

export const SkipLinkTekstgrootte = createPresetStory({
  name: 'Tekstgrootte',
  args: defaultArgs,
  description: 'De tekstgrootte van de skip link blijft in verhouding tot de ingestelde paragraph-grootte.',
  options: createRelativeFontSizePresetOptions('nl.skip-link.font-size', 'de skip link'),
  order: 3,
  question: 'Kies de tekstgrootte van de Skip Link',
});

export const SkipLinkAchtergrondkleur = createPresetStory({
  name: 'Achtergrondkleur',
  args: defaultArgs,
  description: 'De achtergrondkleur en tekstkleur bepalen hoe zichtbaar de skip link is wanneer hij in beeld komt.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Actiekleur',
      description: 'Gebruik een duidelijke actiekleur voor de skip link.',
      tokens: createSkipLinkTokens({
        'background-color': '{basis.color.action-1.bg-default}',
        color: '{basis.color.action-1.color-default}',
      }),
    },
    {
      name: 'Accent',
      description: 'Gebruik een duidelijke accentkleur voor focus.',
      tokens: createSkipLinkTokens({
        'background-color': '{basis.color.accent-1.bg-default}',
        color: '{basis.color.accent-1.color-default}',
      }),
    },
    {
      name: 'Omgekeerd',
      description: 'Gebruik een donkere focusachtergrond met lichte tekst.',
      tokens: createSkipLinkTokens({
        'background-color': '{basis.color.default.inverse-bg-default}',
        color: '{basis.color.default.inverse-color-default}',
      }),
    },
  ],
  order: 4,
  question: 'Kies de achtergrondkleur van de Skip Link',
});
