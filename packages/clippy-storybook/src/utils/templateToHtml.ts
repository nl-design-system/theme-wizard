/* @license CC0-1.0 */

import { html } from 'lit';

/**
 * Converts a Lit TemplateResult to an HTML string
 * Used for displaying source code in Storybook docs
 *
 * @param template - Lit TemplateResult to convert
 * @returns HTML string representation of the template
 */
export const templateToHtml = (template: ReturnType<typeof html>): string => {
  // Reconstruct HTML from Lit template strings and values
  let htmlString = '';
  for (let i = 0; i < template.strings.length; i++) {
    htmlString += template.strings[i];
    if (i < template.values.length) {
      // Insert values as-is (they're already safe in this context)
      htmlString += String(template.values[i]);
    }
  }
  return htmlString;
};
