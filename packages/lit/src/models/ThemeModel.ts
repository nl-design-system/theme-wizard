import type { SidebarConfig } from '../utils/types';
import { DEFAULT_CONFIG } from '../constants/default';

/**
 * Theme Model - Represents the current theme state and provides conversion methods
 *
 * This model:
 * - Stores theme configuration
 * - Generates CSS from configuration
 */
export class ThemeModel {
  private config: SidebarConfig;

  constructor(config: Partial<SidebarConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  getConfig(): SidebarConfig {
    return { ...this.config };
  }

  updateConfig(partial: Partial<SidebarConfig>): void {
    this.config = this.#mergeConfig(partial);
  }

  #mergeConfig(partial: Partial<SidebarConfig>): SidebarConfig {
    return { ...this.config, ...partial };
  }

  reset(): void {
    this.config = { ...DEFAULT_CONFIG };
  }
}
