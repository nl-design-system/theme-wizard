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
    body: 'Alle huurders in Lenteveld die een woning, appartement of kamer huren van een particuliere verhuurder kunnen gratis gebruikmaken van de hulp van het Huurteam.',
    date: 'donderdag 15 februari 2024',
    href: '',
    title: 'Huurteam geeft huurders gratis hulp',
  },
  {
    body: 'De medewerkers van de gemeente doen van alles in de stad. Sommige beroepen zijn bekend, andere minder.',
    date: 'donderdag 15 februari 2024',
    href: '',
    title: 'Bijzonder beroep: specialist maatschappelijke ontwikkeling',
  },
  {
    body: 'Na het succes van de pilot vorig jaar, gaat de TegelTaxi weer in gemeente Voorbeeld rijden!',
    date: 'donderdag 15 februari 2024',
    href: '',
    title: 'De Tegeltaxi gaat weer rijden!',
  },
];

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: '#', label: 'Home' },
  { href: '#', label: 'Wonen en leven' },
  { href: '#', label: 'Zorg en onderwijs' },
  { href: '#', label: 'Werk en inkomen' },
  { href: '#', label: 'Contact' },
];
