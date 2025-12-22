import type { NavigationItem, NewsItem, QuickTask } from './types';

export const QUICK_TASKS: QuickTask[] = [
  { href: '#', icon: 'paspoort', title: 'Paspoort of ID-kaart aanvragen' },
  { href: '/meldingen/', icon: 'melding-klacht', title: 'Meldingen openbare ruimte' },
  { href: '#', icon: 'verhuizen', title: 'Verhuizing doorgeven' },
  { href: '#', icon: 'werken', title: 'Werken bij de gemeente' },
  { href: '#', icon: 'nummerbord', title: 'Parkeren: kentekenwijziging doorgeven' },
  { href: '#', icon: 'afval-scheiden', title: 'Afval' },
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    body: 'Burgemeester Pos heeft 273 wijkraadsleden officieel beëdigd. Ze hebben allemaal de eed afgelegd of een belofte gedaan op het stadhuis van gemeente Voorbeeld.',
    date: 'donderdag 15 februari 2024',
    href: '',
    title: 'Wijkraadsleden officieel beëdigd',
  },
  {
    body: 'Burgemeester Pos heeft 273 wijkraadsleden officieel beëdigd. Ze hebben allemaal de eed afgelegd of een belofte gedaan op het stadhuis van gemeente Voorbeeld.',
    date: 'donderdag 15 februari 2024',
    href: '',
    title: 'Wijkraadsleden officieel beëdigd',
  },
  {
    body: 'Burgemeester Pos heeft 273 wijkraadsleden officieel beëdigd. Ze hebben allemaal de eed afgelegd of een belofte gedaan op het stadhuis van gemeente Voorbeeld.',
    date: 'donderdag 15 februari 2024',
    href: '',
    title: 'Wijkraadsleden officieel beëdigd',
  },
  {
    body: 'Burgemeester Pos heeft 273 wijkraadsleden officieel beëdigd. Ze hebben allemaal de eed afgelegd of een belofte gedaan op het stadhuis van gemeente Voorbeeld.',
    date: 'donderdag 15 februari 2024',
    href: '',
    title: 'Wijkraadsleden officieel beëdigd',
  },
];

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: '#', label: 'Home' },
  { href: '#', label: 'Wonen en leven' },
  { href: '#', label: 'Zorg en onderwijs' },
  { href: '#', label: 'Werk en inkomen' },
  { href: '#', label: 'Contact' },
];
