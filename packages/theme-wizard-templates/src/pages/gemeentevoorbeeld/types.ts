import type { ReactNode } from 'react';

export interface QuickTask {
  href: string;
  icon: string;
  title: string;
}

export interface NewsItem {
  body: string;
  date: string;
  href: string;
  title: string;
}

export interface NavigationItem {
  href: string;
  label: string;
}

export interface AccordionSection {
  body: ReactNode;
  label: string;
}
