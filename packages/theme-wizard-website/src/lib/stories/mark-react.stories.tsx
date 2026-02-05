import type { MarkProps } from '@nl-design-system-candidate/mark-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import markMeta from '@nl-design-system-candidate/mark-docs/stories/mark.react.meta';
import { Mark as MarkComponent } from '@nl-design-system-candidate/mark-react';
import tokens from '@nl-design-system-candidate/mark-tokens';

const meta: Meta<typeof MarkComponent> = {
  ...markMeta,
  id: 'mark',
  component: MarkComponent,
  parameters: { tokens },
  title: 'Mark',
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
