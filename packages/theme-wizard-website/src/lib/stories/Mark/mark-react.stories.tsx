import type { MarkProps } from '@nl-design-system-candidate/mark-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import css from '@nl-design-system-candidate/mark-css/mark.css?inline';
import markMeta from '@nl-design-system-candidate/mark-docs/stories/mark.react.meta';
import { Mark as MarkComponent } from '@nl-design-system-candidate/mark-react';
import tokens from '@nl-design-system-candidate/mark-tokens';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';

const meta: Meta<typeof MarkComponent> = {
  ...markMeta,
  id: 'mark',
  component: MarkComponent,
  parameters: {
    css: [css, paragraphCss],
    tokens,
  },
  title: 'Mark',
};

export default meta;

export * from './mark-react.preset.stories';

type Story = StoryObj<MarkProps>;

export const Mark: Story = {
  name: 'Mark',
  args: {
    children: 'Gemarkeerde tekst',
  },
};

export const MarkInEenParagraph: Story = {
  name: 'Mark in een Paragraph',
  render: () => (
    <p className="nl-paragraph">
      In deze paragraaf staat een stukje <MarkComponent>gemarkeerde tekst</MarkComponent>.
    </p>
  ),
};

export const WizardPreview: Story = {
  name: 'Wizard Preview',
  parameters: {
    wizard: {
      preview: true,
    },
  },
  render: () => (
    <p className="nl-paragraph">
      In deze paragraaf staat een stukje <MarkComponent>gemarkeerde tekst</MarkComponent>.
    </p>
  ),
};
