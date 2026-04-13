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

export type DesignTokenLeaf = {
  path: string;
  value: string;
};

export type StoryWizardSelectionSummary = {
  label: string;
  optionLabel: string;
  tokens: DesignTokenLeaf[];
};

export type StoryWizardThemeHost = HTMLElement & {
  theme?: {
    at: (path: string) => { $value?: unknown } | undefined;
    defaults?: unknown;
  };
};

export interface StoryWizardStepState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  step: any; // circular dependency prevents importing StoryWizardStep here
  summaries: StoryWizardSelectionSummary[];
  isDone: boolean;
  isConfirmedAdvanced: boolean;
  hasResettableState: boolean;
}

export type StoryWizardStoredStepState = {
  advancedVisited: boolean;
  chosenSelections: boolean[];
  selections: number[];
};

export type StoryWizardStoredState = {
  currentStep: number;
  steps: StoryWizardStoredStepState[];
};
