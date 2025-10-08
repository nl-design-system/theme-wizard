/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import type { ConfigChangedDetail } from './types';

/**
 * Dispatch a configChanged event to notify other components
 * @param detail - Configuration changes to dispatch
 */
export const dispatchConfigChanged = (detail: ConfigChangedDetail): void => {
  const event = new CustomEvent('configChanged', {
    bubbles: true,
    composed: true,
    detail,
  });
  document.dispatchEvent(event);
};
