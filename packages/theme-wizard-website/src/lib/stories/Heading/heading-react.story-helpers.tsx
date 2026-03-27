import type { HeadingLevel, HeadingProps } from '@nl-design-system-candidate/heading-react';
import type { StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Heading } from '@nl-design-system-candidate/heading-react';
import { storySampleText } from '../story-helpers';
import { HeadingAllLevels } from './heading-react.story-components';

export type HeadingStory = StoryObj<HeadingProps>;
export type PreviewHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type AccentNumber = 1 | 2 | 3;

export const headingSampleText = storySampleText;
export const headingLevels: PreviewHeadingLevel[] = [1, 2, 3, 4, 5, 6];

export const headingFontSizes = [
  { label: 'Gigantisch', step: '4xl' },
  { label: 'Enorm', step: '3xl' },
  { label: 'Heel groot', step: '2xl' },
  { label: 'Extra groot', step: 'xl' },
  { label: 'Groot', step: 'lg' },
  { label: 'Normaal', step: 'md' },
  { label: 'Klein', step: 'sm' },
] as const;

export const clampStyles: CSSProperties = {
  display: '-webkit-box',
  lineClamp: 1,
  overflow: 'hidden',
  WebkitBoxOrient: 'block-axis',
  WebkitLineClamp: '1',
};

const tokenValue = (value: string) => ({ $value: value });

export const createHeadingToken = (level: HeadingLevel, property: string, value: string) => ({
  nl: {
    heading: {
      [`level-${level}`]: {
        [property]: { $value: value },
      },
    },
  },
});

export const createHeadingEditableTokens = (level: number, tokenNames: string[]) => ({
  nl: {
    heading: {
      [`level-${level}`]: Object.fromEntries(tokenNames.map((tokenName) => [tokenName, tokenValue('0')])),
    },
  },
});

export const createHeadingPreview = (name: string, level?: PreviewHeadingLevel): HeadingStory => ({
  name,
  args: {
    children: headingSampleText,
    ...(typeof level === 'number' ? { level } : {}),
  },
  render: (args) => <HeadingAllLevels {...args} />,
});

export const renderHeadingLevelsPreview = ({ children }: HeadingProps) => (
  <div>
    <Heading level={1} style={clampStyles}>
      {children}
    </Heading>
    <Heading level={2} style={clampStyles}>
      {children}
    </Heading>
    <Heading level={3} style={clampStyles}>
      {children}
    </Heading>
    <Heading level={4} style={clampStyles}>
      {children}
    </Heading>
    <Heading level={5} style={clampStyles}>
      {children}
    </Heading>
    <Heading level={6} style={clampStyles}>
      {children}
    </Heading>
  </div>
);
