/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import type { SidebarConfig } from '../components/sidebar/types';

/**
 * Export current theme configuration as design tokens JSON file
 * @private
 */
export const exportDesignTokens = (config: SidebarConfig): void => {
  try {
    const tokens = {
      $metadata: {
        exportedAt: new Date().toISOString(),
        sourceUrl: config.sourceUrl,
        version: '1.0.0',
      },
      example: {
        typography: {
          'font-family': {
            body: {
              value: config.bodyFont,
            },
            heading: {
              value: config.headingFont,
            },
          },
        },
      },
    };

    downloadFile(JSON.stringify(tokens, null, 2), 'theme-tokens.json', 'application/json');
  } catch (error) {
    console.error('Failed to export design tokens:', error);
  }
};

/**
 * Download a file with the given content
 * @param content - File content
 * @param filename - File name
 * @param mimeType - MIME type
 * @private
 */
const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
