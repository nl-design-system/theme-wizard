/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import type { SidebarConfig, UrlParamsConfig } from './types';

/**
 * Event names for component communication
 */
export const EVENT_NAMES = {
  SIDEBAR_CONFIG_CHANGED: 'sidebarConfigChanged',
  TYPOGRAPHY_CHANGED: 'typographyChanged',
} as const;

/**
 * Dispatch a typography change event
 * @param detail - Typography configuration changes
 */
export const dispatchTypographyChanged = (detail: Partial<Pick<SidebarConfig, 'headingFont' | 'bodyFont'>>): void => {
  const event = new CustomEvent(EVENT_NAMES.TYPOGRAPHY_CHANGED, {
    bubbles: true,
    composed: true,
    detail,
  });
  document.dispatchEvent(event);
};

/**
 * Dispatch a sidebar config change event
 * @param config - Complete sidebar configuration
 */
export const dispatchSidebarConfigChanged = (config: UrlParamsConfig): void => {
  const event = new CustomEvent(EVENT_NAMES.SIDEBAR_CONFIG_CHANGED, {
    bubbles: true,
    composed: true,
    detail: config,
  });
  document.dispatchEvent(event);
};
