import type { Meta, StoryObj } from '@storybook/react-vite';
import css from '@nl-design-system-candidate/code-block-css/code-block.css?inline';
import { CodeBlock, type CodeBlockProps } from '@nl-design-system-candidate/code-block-react';
import tokens from '@nl-design-system-candidate/code-block-tokens';

const meta = {
  id: 'code-block',
  component: CodeBlock,
  parameters: {
    css: [css],
    tokens,
  },
  title: 'Code Block',
} satisfies Meta<typeof CodeBlock>;

export default meta;

export * from './code-block-react.preset.stories';
export * from './code-block-react.advanced-stories';

type Story = StoryObj<CodeBlockProps>;

export const WizardPreview: Story = {
  name: 'Wizard Preview',
  args: {
    children: `import { CodeBlock } from '@nl-design-system-candidate/code-block-react';`,
  },
  parameters: {
    wizard: {
      preview: true,
    },
  },
};
