import type { components } from './components';

export type DerivedTokenReference = {
  offset: number;
  scalePath: string;
  sourcePath: string;
  targetIndex?: number;
  targetKey?: string;
  targetPath: string;
};

export type DynamicPresetOption = {
  derivedTokenReference?: DerivedTokenReference;
  previewStyle?: string;
  tokens: unknown;
};

export type SelectedPresetOption = {
  tokens: unknown;
} | null;

export type PresetResolutionContext<TOption extends DynamicPresetOption> = {
  defaults: unknown;
  options: TOption[];
  selectedOptions: SelectedPresetOption[];
};

export type StoryWizardPresetOption = {
  description?: string;
  derivedTokenReference?: DerivedTokenReference;
  name: string;
  previewStyle: string;
  tokens: unknown;
};

export type StoryWizardPresetGroup = {
  type: 'preset';
  description?: string;
  id: string;
  name: string;
  options: StoryWizardPresetOption[];
};

export type StoryWizardEditableToken = {
  cssVar: string;
  label: string;
  path: string;
};

export type StoryWizardEditableTokenGroup = {
  advancedTitle?: string;
  type: 'editable-tokens';
  description?: string;
  id: string;
  name: string;
  tokens: StoryWizardEditableToken[];
};

export type StoryWizardPreview = {
  id: string;
  name: string;
};

export type StoryWizardStep = {
  flowGroup: string;
  flowTitle: string;
  id: string;
  intro?: string;
  order: number;
  previewStories: StoryWizardPreview[];
  groups: Array<StoryWizardPresetGroup | StoryWizardEditableTokenGroup>;
  title: string;
};

export type StoryWizardViewModel = {
  componentId: keyof typeof components;
  storyIds: string[];
  steps: StoryWizardStep[];
};

export type StoryWizardPresetOptionObject = {
  description?: string;
  derivedTokenReference?: DerivedTokenReference;
  name: string;
  tokens: unknown;
};

export type StoryWizardPresetObject = {
  description?: string;
  name: string;
  options: StoryWizardPresetOptionObject[];
  question?: string;
  thumbnail?: boolean;
};

export type StoryWizardParameters = {
  editableTokens?: unknown;
  presets?: StoryWizardPresetObject[];
  wizard?:
    | {
        type: 'preset';
        description?: string;
        order: number;
        previewStoryIds: string[];
      }
    | {
        type: 'advanced';
        advancedTitle?: string;
        description?: string;
        order: number;
        question?: string;
        stepTitle: string;
      };
  [key: PropertyKey]: unknown;
};

export type StoryWizardStory = {
  name?: string;
  parameters?: StoryWizardParameters;
  [key: PropertyKey]: unknown;
};

export type StoryEntry = [id: string, story: StoryWizardStory];
