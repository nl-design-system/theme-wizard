export type WizardTokenPresetInput = HTMLElement;

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
