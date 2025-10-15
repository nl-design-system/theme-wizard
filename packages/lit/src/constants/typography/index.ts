export type FontOption = { label: string; value: string };

/**
 * Available font options for typography selection
 */
export const DEFAULT_FONT_OPTIONS: FontOption[] = [
  { label: 'System UI', value: 'system-ui, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: "'Times New Roman', serif" },
  { label: 'Courier New', value: "'Courier New', monospace" },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
];

/**
 * Default typography configuration
 */
export const DEFAULT_TYPOGRAPHY = {
  bodyFont: 'system-ui, sans-serif',
  headingFont: 'system-ui, sans-serif',
};
