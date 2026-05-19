import type { ClippyHeading } from '@nl-design-system-community/clippy-components/clippy-heading';
import type { ArgTypes, Meta, StoryObj } from '@storybook/web-components-vite';
import '@nl-design-system-community/clippy-components/clippy-heading';
import readme from '@nl-design-system-community/clippy-components/src/clippy-heading/README.md?raw';
import { getStorybookHelpers } from '@wc-toolkit/storybook-helpers';

const { args, argTypes, template } = getStorybookHelpers<ClippyHeading>('clippy-heading');

const meta: Meta<ClippyHeading & typeof args> = {
  args: {
    ...args,
    'default-slot': 'Pagina titel',
    level: 1,
  },
  argTypes: {
    ...(argTypes as ArgTypes<ClippyHeading & typeof args>),
    level: {
      name: 'Level',
      control: { max: 6, min: 1, step: 1, type: 'number' },
      defaultValue: 1,
      description: 'Heading level (1–6)',
      type: {
        name: 'number',
        required: true,
      },
    },
  },
  component: 'clippy-heading',
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  render: (args) => template(args),
  title: 'clippy/Heading',
};

export default meta;
type Story = StoryObj<ClippyHeading & typeof args>;

export const Default: Story = {};

// const meta = {
//   id: 'clippy-heading',
//   args: {
//     content: 'Pagina titel',
//     level: 1,
//   },
//   argTypes: {
//     content: {
//       name: 'Content',
//       defaultValue: '',
//       description: 'Text',
//       type: {
//         name: 'string',
//         required: true,
//       },
//     },
//     level: {
//       name: 'Level',
//       control: { max: 6, min: 1, step: 1, type: 'number' },
//       defaultValue: 1,
//       description: 'Heading level (1–6)',
//       type: {
//         name: 'number',
//         required: true,
//       },
//     },
//   },
//   parameters: {
//     docs: {
//       description: {
//         component: readme,
//       },
//     },
//   },
//   render: ({ content, level }: HeadingStoryArgs) => React.createElement('clippy-heading', { level }, content),
//   tags: ['autodocs'],
//   title: 'Clippy/Heading',
// } satisfies Meta<HeadingStoryArgs>;

// export default meta;

// type Story = StoryObj<typeof meta>;

// export const Default: Story = {
//   name: 'Heading',
//   parameters: {
//     docs: {
//       source: {
//         transform: (_code: string, storyContext: { args: HeadingStoryArgs }) => {
//           const template = createTemplate(storyContext.args.level, storyContext.args.content);
//           return templateToHtml(template);
//         },
//         type: 'code',
//       },
//     },
//   },
// };
