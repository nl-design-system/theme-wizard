import { Heading } from '@nl-design-system-candidate/heading-react/css';
import '@amsterdam/design-system-css/dist/visually-hidden/visually-hidden.css';
import { Icon, NavBar, NavList, NavListLink } from '@utrecht/component-library-react';
import React, { useState } from 'react';
import { NAVIGATION_ITEMS } from '../../pages/gemeentevoorbeeld/constants';
import { IconMenu2, IconX } from '@tabler/icons-react';
import { SearchForm } from '../../components/SearchForm';

export interface NavigationProps {
  currentPath?: string;
  children?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  // Search pattern props
  showSearch?: boolean;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  onSearchSubmit?: (query: string) => void;
}

const Navigation = ({ 
  currentPath, 
  children, 
  breadcrumb,
  showSearch, 
  searchQuery = '', 
  onSearchQueryChange, 
  onSearchSubmit 
}: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NavBar className={`navigation-container ${isOpen ? 'is-open' : ''}`}>
      <div className="clippy--navigation-content-wrapper">
        <Heading level={2} className="ams-visually-hidden">
          Hoofdnavigatie
        </Heading>

        {breadcrumb && <div className="clippy--navigation-breadcrumb-wrapper">{breadcrumb}</div>}

        <button
          type="button"
          className="clippy--navigation-hamburger-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="navigation-list"
          aria-label={isOpen ? 'Menu sluiten' : 'Menu openen'}
        >
          <Icon className="clippy--navigation-hamburger-icon">
            {isOpen ? <IconX size={20} aria-hidden="true" /> : <IconMenu2 size={20} aria-hidden="true" />}
          </Icon>
          <span className="clippy--navigation-hamburger-label">Menu</span>
        </button>

        <div id="navigation-list" className={`clippy--navigation-menu ${isOpen ? 'is-open' : ''}`}>
          <NavList>
            {NAVIGATION_ITEMS.map(({ href, label }) => (
              <NavListLink key={`${href}-${label}`} href={href} aria-current={currentPath === href ? 'page' : undefined}>
                {label}
              </NavListLink>
            ))}
          </NavList>
        </div>

        {(showSearch || (onSearchQueryChange && onSearchSubmit)) && (
          <div className="clippy--navigation-search-wrapper">
            <SearchForm 
              query={searchQuery} 
              onQueryChange={onSearchQueryChange || (() => {})} 
              onSubmit={onSearchSubmit || (() => {})} 
            />
          </div>
        )}

        {children && <div className="clippy--navigation-extra-content-wrapper">{children}</div>}
      </div>
    </NavBar>
  );
};

export default Navigation;
