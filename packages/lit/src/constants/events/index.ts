export const EVENT_NAMES = {
  /** Sidebar → App: config updates */
  CONFIG_CHANGE: 'config-change',
  /** Sidebar → App: website scraped successfully */
  SCRAPE_COMPLETE: 'scrape-complete',
  /** Template switcher → App: template changes */
  TEMPLATE_CHANGE: 'template-change',
  /** Typography component → Sidebar: font changes */
  TYPOGRAPHY_CHANGE: 'typography-change',
} as const;
