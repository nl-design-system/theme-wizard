import type { MarkProps } from '@nl-design-system-candidate/mark-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import markMeta from '@nl-design-system-candidate/mark-docs/stories/mark.react.meta';
// import * as Stories from '@nl-design-system-candidate/mark-docs/stories/mark.stories';
// import packageJSON from '../../components-react/mark-react/package.json';
import { Mark as MarkComponent } from '@nl-design-system-candidate/mark-react';
// import '../../components-css/paragraph-css/src/paragraph.scss';
// import { getExternalLinks } from '../src/helpers/external-links';
import tokens from '@nl-design-system-candidate/mark-tokens';

// const externalLinks = getExternalLinks('https://nldesignsystem.nl/mark', packageJSON.homepage);

const meta: Meta<typeof MarkComponent> = {
  ...markMeta,
  id: 'mark',
  // ...externalLinks,
  component: MarkComponent,
  parameters: { tokens },
  title: 'React Componenten/Mark',
};

export default meta;

type Story = StoryObj<MarkProps>;

export const Mark: Story = {
  name: 'Mark',
  args: {
    children: 'Gemarkeerde tekst',
  },
};

// copied from https://github.com/frameless/candidate/blob/main/packages/docs/mark-docs/stories/mark.stories.tsx
export const MarkInEenParagraph: Story = {
  name: 'Mark in een Paragraph',
  args: {
    children: 'Gemarkeerde tekst',
  },
  parameters: {
    tokens: {
      nl: {
        mark: {
          'background-color': {
            $value: '',
          },
          color: {
            $value: '',
          },
        },
      },
    },
  },
  render: (_props, { component }) => {
    const Mark = component as ComponentType<MarkProps>;
    return (
      <p className="nl-paragraph">
        In deze paragraaf staat een stukje <Mark>gemarkeerde tekst</Mark>.
      </p>
    );
  },
};

export const DesignMark: Story = {
  name: 'Design: Mark',
  args: {
    children: 'Gemarkeerde tekst',
  },
  parameters: {
    designStory: true,
    tokens: {
      nl: {
        mark: {
          'background-color': {
            $value: '',
          },
          color: {
            $value: '',
          },
        },
      },
    },
  },
};
