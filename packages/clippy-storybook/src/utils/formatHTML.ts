/* @license CC0-1.0 */

/**
 * Simple HTML formatter for better readability in code panels
 * Formats HTML string with proper indentation and line breaks
 *
 * @param html - Raw HTML string to format
 * @returns Formatted HTML string with indentation
 */
export const formatHTML = (html: string): string => {
  let formatted = '';
  let indent = 0;
  const tab = '  '; // 2 spaces

  const closingTagRegex = /^<\/\w/;
  const selfClosingRegex = /^<\w[^>]*\/>/;
  const openingTagRegex = /^<\w/;

  html.split(/(<[^>]+>)/g).forEach((element) => {
    if (!element.trim()) return;

    // Closing tag
    if (closingTagRegex.test(element)) {
      indent--;
      formatted += tab.repeat(Math.max(0, indent)) + element + '\n';
    }
    // Self-closing or content
    else if (selfClosingRegex.test(element)) {
      formatted += tab.repeat(indent) + element + '\n';
    }
    // Opening tag
    else if (openingTagRegex.test(element)) {
      formatted += tab.repeat(indent) + element + '\n';
      indent++;
    }
    // Text content
    else {
      const trimmed = element.trim();
      if (trimmed) {
        formatted += tab.repeat(indent) + trimmed + '\n';
      }
    }
  });

  return formatted.trim();
};
