/**
 * Interface for theme style properties
 *
 * This interface defines all available theme properties that can be used
 * in components.
 * Add new properties here to automatically include them in all components.
 */
export interface ThemeStyleProperties {
  /** Font family for body text */
  bodyFont?: string;
  /** Font family for headings */
  headingFont?: string;
}

/**
 * Sidebar configuration interface
 */
export interface SidebarConfig {
  /** Website URL to analyze */
  sourceUrl: string;
  /** Custom CSS rules */
  previewUrl: string;
  /** Font family for headings */
  headingFont: string;
  /** Font family for body text */
  bodyFont: string;
}
