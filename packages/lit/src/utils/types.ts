/**
 * Type utilities for working with nested object structures
 */

/**
 * Type helper to identify leaf nodes in a nested object structure
 * Non-objects and functions are considered leaves
 */
export type ObjectLeaf<T> = T extends (...args: unknown[]) => unknown ? T : T extends object ? never : T;

/**
 * Generates all possible dot-notation paths for a nested object type
 * @example
 * type Example = { a: { b: string; c: number } };
 * type Paths = ObjectPath<Example>; // "a.b" | "a.c"
 */
export type ObjectPath<T, ParentPath extends string = ''> = {
  [K in keyof T]: T[K] extends ObjectLeaf<T[K]>
    ? `${ParentPath & string}${K & string}`
    : ObjectPath<T[K], `${ParentPath & string}${K & string}.`>;
}[keyof T];

/**
 * Interface for theme style properties
 *
 * This interface defines all available theme properties that can be used
 * in components.
 * Add new properties here to automatically include them in all components.
 */
export interface ThemeStyleProperties {
  bodyFont: string;
  headingFont: string;
}

/**
 * Sidebar configuration interface
 */
export interface SidebarConfig {
  /** Website URL to analyze */
  sourceUrl: string;
  /** Preview URL for the wizard-preview component */
  previewUrl: string;
  /** Font family for headings */
  headingFont: string;
  /** Font family for body text */
  bodyFont: string;
}
