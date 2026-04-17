import type { DerivedTokenReference } from '@/lib/types';

export type StoryWizardSelectedOption = {
  derivedTokenReference?: DerivedTokenReference;
  derivedTokenReferences?: DerivedTokenReference[];
  optionLabel: string;
  previewStyle: string;
  tokens: unknown;
};

export type StoryWizardPresetOption = {
  description?: string;
  derivedTokenReference?: DerivedTokenReference;
  derivedTokenReferences?: DerivedTokenReference[];
  name: string;
  previewStyle?: string;
  tokens: unknown;
};

export type WizardTokenPresetInput = HTMLElement & {
  updateComplete?: Promise<boolean>;
  clearSelection: () => void;
  defaultIndex: number;
  options: StoryWizardPresetOption[];
  optionLabel: string;
  previewStyle: string;
  selectedIndex: number;
  selectedOption: StoryWizardSelectedOption | null;
  selectIndex: (index: number) => void;
  value: unknown;
};

export type StoryWizardThemeHost = HTMLElement & {
  theme?: {
    at: (path: string) => { $value?: unknown } | undefined;
    defaults?: unknown;
  };
};

export type StoryWizardStoredStepState = {
  advancedVisited: boolean;
  chosenSelections: boolean[];
  selections: number[];
  selectionLabels?: string[];
};

export type StoryWizardStoredState = {
  currentStep: number;
  steps: StoryWizardStoredStepState[];
};
