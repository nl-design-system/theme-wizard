import type { FC } from 'react';
import { NavBar, NavList, NavListLink } from '@utrecht/component-library-react';

export interface NavigationItem {
  href: string;
  label: string;
}

export interface NavigationBarProps {
  currentPath?: string;
  items?: NavigationItem[];
}

const DEFAULT_ITEMS: NavigationItem[] = [
  { href: '#', label: 'Wonen en leven' },
  { href: '#', label: 'Werk en inkomen' },
  { href: '#', label: 'Ondernemen' },
  { href: '#', label: 'Bestuur en organisatie' },
];

const NavigationBar: FC<NavigationBarProps> = ({ currentPath, items = DEFAULT_ITEMS }) => (
  <NavBar>
    <NavList>
      {items.map(({ href, label }) => (
        <NavListLink key={`${href}-${label}`} href={href} aria-current={currentPath === href ? 'page' : undefined}>
          {label}
        </NavListLink>
      ))}
    </NavList>
  </NavBar>
);

export default NavigationBar;
