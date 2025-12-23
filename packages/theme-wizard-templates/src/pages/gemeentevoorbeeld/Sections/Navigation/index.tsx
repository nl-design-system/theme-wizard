import { NavBar, NavList, NavListLink } from '@utrecht/component-library-react';
import React, { type FC } from 'react';
import { NAVIGATION_ITEMS } from '../..//constants';

export interface NavigationProps {
  currentPath?: string;
}

const Navigation: FC<NavigationProps> = ({ currentPath }) => (
  <NavBar>
    <NavList>
      {NAVIGATION_ITEMS.map(({ href, label }) => (
        <NavListLink key={`${href}-${label}`} href={href} aria-current={currentPath === href ? 'page' : undefined}>
          {label}
        </NavListLink>
      ))}
    </NavList>
  </NavBar>
);

export default Navigation;
