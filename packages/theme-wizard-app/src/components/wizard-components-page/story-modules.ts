import type { Meta } from '@storybook/react-vite';
import * as ButtonStories from './button-react.stories';
import * as CodeBlockStories from './code-block-react.stories';
import * as CodeStories from './code-react.stories';
import * as ColorSampleStories from './color-sample-react.stories';
import * as DataBadgeStories from './data-badge-react.stories';
import * as HeadingStories from './heading-react.stories';
import * as LinkStories from './link-react.stories';
import * as MarkStories from './mark-react.stories';
import * as NumberBadgeStories from './number-badge-react.stories';
import * as ParagraphStories from './paragraph-react.stories';
import * as SkipLinkStories from './skip-link-react.stories';

/**
 * Component Story Format module structure.
 * Enforces that CSF modules have a default export (Meta),
 * and any number of story exports (various prop types).
 * Uses `any` for the component type because each module has different component props,
 * and we don't need to access component-specific type information.
 */
export type StoryModule = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: Meta<any>;
  [key: string]: unknown;
};

export const storyModules: StoryModule[] = [
  MarkStories,
  LinkStories,
  ColorSampleStories,
  CodeStories,
  HeadingStories,
  CodeBlockStories,
  ParagraphStories,
  DataBadgeStories,
  NumberBadgeStories,
  SkipLinkStories,
  ButtonStories,
].sort((a, b) => (a.default.id || a.default.title || '').localeCompare(b.default.id || b.default.title || ''));

/**
 * Lazy-loadable map of component ID to dynamic import function.
 * Use this to load individual story modules on demand.
 */
export const storyModulesLazy: Record<string, () => Promise<StoryModule>> = {
  button: () => import('./button-react.stories'),
  code: () => import('./code-react.stories'),
  'code-block': () => import('./code-block-react.stories'),
  'color-sample': () => import('./color-sample-react.stories'),
  'data-badge': () => import('./data-badge-react.stories'),
  heading: () => import('./heading-react.stories'),
  link: () => import('./link-react.stories'),
  mark: () => import('./mark-react.stories'),
  'number-badge': () => import('./number-badge-react.stories'),
  paragraph: () => import('./paragraph-react.stories'),
  'skip-link': () => import('./skip-link-react.stories'),
};
