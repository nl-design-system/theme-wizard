/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

export interface SidebarConfig {
  sourceUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  themeClass?: string;
  customCss?: string;
}

// Re-export shared types for convenience
export type { ThemePreviewElement } from '../shared/types';
