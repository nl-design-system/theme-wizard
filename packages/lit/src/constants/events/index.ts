/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

/**
 * Event names for component communication
 */
export const EVENT_NAMES = {
  /** Sidebar → Wrapper: config updates */
  CONFIG_CHANGE: 'config-change',
  /** Typography component → Sidebar: font changes */
  TYPOGRAPHY_CHANGE: 'typography-change',
} as const;
