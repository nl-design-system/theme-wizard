import type { NavigationItem as ClippyNavigationItem } from '@nl-design-system-community/clippy-components/clippy-navigation-bar';
import type { TokenPath } from '@nl-design-system-community/design-tokens-schema';

type DesignTokensAstroPageFragment = 'slug' | 'leaf' | 'branch' | 'colorBranch' | 'colorCollection';

export type NavigationItem = ClippyNavigationItem & {
  items?: NavigationItem[];
  metaData?: {
    astroPageFragment?: DesignTokensAstroPageFragment;
    tokenPath?: TokenPath;
  };
};

export type NavigationItems = NavigationItem[];
