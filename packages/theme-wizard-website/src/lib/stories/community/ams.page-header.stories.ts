import type { Meta, StoryObj } from '@storybook/react-vite';
import { createElement } from 'react';
import tokens from './ams.page-header.tokens.json';

// Placeholder until the Amsterdam page header package is added
type PageHeaderProps = {
  brandName: string;
};

const PageHeader = ({ brandName }: PageHeaderProps) =>
  createElement(
    'header',
    {
      className: 'ams-page-header',
      style: {
        backgroundColor: 'var(--ams-page-header-background-color)',
        color: 'var(--ams-page-header-color)',
        paddingBlock: 'var(--ams-page-header-padding-block)',
        paddingInline: 'var(--ams-page-header-padding-inline)',
      },
    },
    brandName,
  );

const meta = {
  id: 'ams-page-header',
  component: PageHeader,
  parameters: {
    tokens,
  },
  title: 'Page Header (Amsterdam)',
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<PageHeaderProps>;

export const DefaultPageHeader: Story = {
  name: 'Page Header',
  args: {
    brandName: 'Gemeente Amsterdam',
  },
};
