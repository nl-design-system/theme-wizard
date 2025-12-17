import type { FC, ReactElement } from 'react';

export interface NavigationItem {
  href: string;
  label: string;
}

export interface NavigationBarProps {
  items?: NavigationItem[];
}

const DEFAULT_ITEMS: NavigationItem[] = [
  { href: '#', label: 'Wonen en leven' },
  { href: '#', label: 'Werk en inkomen' },
  { href: '#', label: 'Ondernemen' },
  { href: '#', label: 'Bestuur en organisatie' },
];

const NavigationBar: FC<NavigationBarProps> = ({ items = DEFAULT_ITEMS }) => (
  <nav className="utrecht-nav-bar" aria-label="Hoofdonderwerpen">
    <div className="utrecht-nav-bar__content">
      <ul className="utrecht-nav-list">
        {items.map(
          (item: NavigationItem): ReactElement => (
            <li key={item.href} className="utrecht-nav-list__item">
              <a href={item.href} className="utrecht-link utrecht-link--html-a utrecht-nav-list__link">
                {item.label}
              </a>
            </li>
          ),
        )}
      </ul>
    </div>
  </nav>
);

export default NavigationBar;
