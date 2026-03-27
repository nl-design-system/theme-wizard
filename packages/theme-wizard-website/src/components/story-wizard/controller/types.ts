import type { DerivedTokenReference } from '@/lib/types';

export type StoryWizardSelectedOption = {
  derivedTokenReference?: DerivedTokenReference;
  optionLabel: string;
  previewStyle: string;
  tokens: unknown;
};

export type StoryWizardPresetOption = {
  description?: string;
  derivedTokenReference?: DerivedTokenReference;
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
