// Currently infinite levels deep, update when we want to restrict the levels
export type SideNavigationItem = {
  href: string;
  label: string;
  active?: boolean;
  items?: SideNavigationItem[];
};

export type SideNavigationItems = SideNavigationItem[];
