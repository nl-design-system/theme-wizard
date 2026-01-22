import { Heading } from '@nl-design-system-candidate/heading-react/css';
import '@amsterdam/design-system-css/dist/visually-hidden/visually-hidden.css';
import { NavBar, NavList, NavListLink } from '@utrecht/component-library-react';
import React from 'react';
import { NAVIGATION_ITEMS } from '../../constants';

export interface NavigationProps {
  currentPath?: string;
}

const Navigation = ({ currentPath }: NavigationProps) => (
  <NavBar>
    <Heading level={2} className="ams-visually-hidden">
      Hoofdnavigatie
    </Heading>

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
