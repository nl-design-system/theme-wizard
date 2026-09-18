type SelectedHTMLAnchorElementProps = Pick<HTMLAnchorElement, 'href'> &
  Partial<Pick<HTMLAnchorElement, 'target' | 'hreflang' | 'lang'>>;

// Currently infinite levels deep, update when we want to restrict the levels
export interface NavigationItem extends SelectedHTMLAnchorElementProps {
  label: string;
  current?: boolean;
  items?: NavigationItem[];
}

export type NavigationItems = NavigationItem[];
