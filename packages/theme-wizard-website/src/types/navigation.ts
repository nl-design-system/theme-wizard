import type { NavigationItem as ClippyNavigationItem } from '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import type { TokenPath } from '@nl-design-system-community/design-tokens-schema';

export type NavigationItem = ClippyNavigationItem & {
  items?: NavigationItem[];
  metaData?: {
    astroFragment?: string;
    tokenPath?: TokenPath;
  };
};

export type NavigationItems = NavigationItem[];
