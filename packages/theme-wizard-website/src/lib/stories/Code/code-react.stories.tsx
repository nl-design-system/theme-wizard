import type { Meta, StoryObj } from '@storybook/react-vite';
import css from '@nl-design-system-candidate/code-css/code.css?inline';
import codeMeta from '@nl-design-system-candidate/code-docs/stories/code.react.meta';
import * as Stories from '@nl-design-system-candidate/code-docs/stories/code.stories';
import { Code as CodeComponent, type CodeProps } from '@nl-design-system-candidate/code-react';
import tokens from '@nl-design-system-candidate/code-tokens';

const meta = {
  ...codeMeta,
  id: 'code',
  parameters: {
    css: [css],
    tokens,
  },
  title: 'Code',
} satisfies Meta<typeof CodeComponent>;

export default meta;

export * from './code-react.preset.stories';

type Story = StoryObj<CodeProps>;

export const Code: Story = Stories.Code;

export const WizardPreview: Story = {
  name: 'Wizard Preview',
  parameters: {
    wizard: {
      preview: true,
    },
  },
  render: () => (
    <p>
      Gebruik <CodeComponent>npm run dev</CodeComponent> om lokaal te starten.
    </p>
  ),
};
