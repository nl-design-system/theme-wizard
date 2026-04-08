import { createPresetStory } from '../story-helpers';

const defaultArgs = {
  children: 'example.com',
  href: 'https://example.com/',
};

export const LinkHoverOnderstreping = createPresetStory({
  name: 'Hover onderstreping',
  args: defaultArgs,
  description: 'Bepaal of de onderstreping bij hover hetzelfde blijft of dikker wordt.',
  options: [
    {
      name: 'Verdwijn',
      description: 'De standaard uit het startthema. De onderstreping verdwijnt bij hover.',
      tokens: null,
    },
    {
      name: 'Gelijk',
      description: 'De onderstreping blijft bij hover gelijk aan de standaard staat.',
      tokens: {
        nl: {
          link: {
            hover: {
              'text-decoration-line': {
                $value: 'underline',
              },
              'text-decoration-thickness': {
                $value: 'auto',
              },
            },
          },
        },
      },
    },
    {
      name: 'Dikker bij hover',
      description: 'De onderstreping wordt dikker wanneer iemand over de link hovert.',
      tokens: {
        nl: {
          link: {
            hover: {
              'text-decoration-line': {
                $value: 'underline',
              },
              'text-decoration-thickness': {
                $value: '2px',
              },
            },
          },
        },
      },
    },
  ],
  order: 2,
  question: 'Kies het hover-effect voor de onderstreping van Link',
});

export const LinkColor = createPresetStory({
  name: 'Link color',
  args: defaultArgs,
  description: 'De kleur van de link in alle states.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Actie 2',
      description: 'Gebruik de secundaire actiekleur voor alle link states.',
      tokens: {
        nl: {
          link: {
            active: {
              color: { $value: '{basis.color.action-2.color-active}' },
            },
            color: { $value: '{basis.color.action-2.color-default}' },
            hover: {
              color: { $value: '{basis.color.action-2.color-hover}' },
            },
          },
        },
      },
    },
    {
      name: 'Actie 1',
      description: 'Gebruik de primaire actiekleur voor alle link states.',
      tokens: {
        nl: {
          link: {
            active: {
              color: { $value: '{basis.color.action-1.color-active}' },
            },
            color: { $value: '{basis.color.action-1.color-default}' },
            hover: {
              color: { $value: '{basis.color.action-1.color-hover}' },
            },
          },
        },
      },
    },
  ],
  order: 4,
  question: 'Kies de kleur van Link',
});
