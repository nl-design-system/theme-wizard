import type { StoryObj, Meta } from '@storybook/react-vite';
import { CodeBlock as CodeBlockComponent, type CodeBlockProps } from '@nl-design-system-candidate/code-block-react';

const meta = {
  id: 'code-block',
  argTypes: {
    children: { control: 'text', table: { category: 'API' } },
    overflow: {
      control: 'radio',
      options: ['wrap', 'nowrap', 'overflow'],
      table: { type: { summary: 'union' } },
    },
  },
  component: CodeBlockComponent,
  title: 'Code block',
} satisfies Meta<CodeBlockProps>;

export default meta;

type Story = StoryObj<CodeBlockProps>;

export const CodeBlock: Story = {
  name: 'Code Block',
  args: {
    children: `import { CodeBlock } from '@nl-design-system-candidate/code-block-react';`,
  },
};

export const DesignCodeBlockColor: Story = {
  name: 'Design: Code Block Color',
  args: {
    ...CodeBlock.args,
  },
  parameters: {
    designStory: true,
    tokens: {
      nl: {
        'code-block': {
          'background-color': {
            $value: '0',
          },
          color: {
            $value: '0',
          },
        },
      },
    },
  },
};

export const DesignCodeBlockTypography: Story = {
  name: 'Design: Code Block Typography',
  args: {
    ...CodeBlock.args,
  },
  parameters: {
    designStory: true,
    tokens: {
      nl: {
        'code-block': {
          'font-family': {
            $value: '0',
          },
          'font-size': {
            $value: '0',
          },
          'line-height': {
            $value: '0',
          },
        },
      },
    },
  },
};

export const DesignCodeBlockSize: Story = {
  name: 'Design: Code Block Size',
  args: {
    ...CodeBlock.args,
  },
  parameters: {
    designStory: true,
    tokens: {
      nl: {
        'code-block': {
          'padding-block': {
            $value: '0',
          },
          'padding-inline': {
            $value: '0',
          },
        },
      },
    },
  },
};

export const DesignCodeBlockBorder: Story = {
  name: 'Design: Code Block Border',
  args: {
    ...CodeBlock.args,
  },
  parameters: {
    designStory: true,
    tokens: {
      nl: {
        'code-block': {
          'border-radius': {
            $value: '0',
          },
        },
      },
    },
  },
};
