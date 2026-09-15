type SelectedHTMLAnchorElementAttrs = 'href' | 'target' | 'hreflang' | 'lang';

// Currently infinite levels deep, update when we want to restrict the levels
export interface SideNavigationItem extends Partial<Pick<HTMLAnchorElement, SelectedHTMLAnchorElementAttrs>> {
  label: string;
  current?: boolean;
  items?: SideNavigationItem[];
}

export type SideNavigationItems = SideNavigationItem[];
