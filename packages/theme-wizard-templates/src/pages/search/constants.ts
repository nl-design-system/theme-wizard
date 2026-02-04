import type { SearchResultsData } from './SearchResultsPage/types';

export const SEARCH_FILTER_PERIODS = [
  { label: 'Altijd', value: 'all', count: 471 },
  { label: 'Afgelopen 7 dagen', value: '7', count: 12 },
  { label: 'Afgelopen 30 dagen', value: '30', count: 45 },
  { label: 'Afgelopen 365 dagen', value: '365', count: 120 },
  { label: 'Specifieke periode', value: 'custom' },
] as const;

export const SEARCH_FILTER_ORGANIZATIONS = [
  { label: 'Alle organisaties', value: 'all', count: 471 },
  { label: 'Organisatie A', value: 'org-a', count: 156 },
  { label: 'Organisatie B', value: 'org-b', count: 89 },
  { label: 'Organisatie C', value: 'org-c', count: 124 },
  { label: 'Organisatie D', value: 'org-d', count: 102 },
] as const;

export const SEARCH_FILTER_TYPES = [
  { label: 'Alle documenten', value: 'all', count: 245 },
  { label: 'Nieuwsbericht', value: 'news', count: 86 },
  { label: 'Vraag en antwoord', value: 'qa', count: 54 },
  { label: 'Publicatie', value: 'publication', count: 92 },
  { label: 'Rapport', value: 'report', count: 13 },
] as const;

export const SEARCH_SORT_OPTIONS = [
  { label: 'Relevantie', value: 'relevance' },
  { label: 'Datum', value: 'date' },
] as const;

// Mock data - replace with actual data fetching
export const MOCK_SEARCH_RESULTS: SearchResultsData = {
  filters: {},
  query: '',
  results: [
    {
      id: '1',
      description: 'Wat doet de overheid om de totale hoeveelheid afval terug te dringen?',
      title: 'Afval',
      type: 'Onderwerp',
      url: '/onderwerpen/afval',
    },
    {
      id: '2',
      dateTime: '2026-01-15',
      description:
        'Klein chemisch afval (kca) kunt u inleveren bij een gemeentedepot, chemokar of kca-depot. Kijk voor meer informatie over afval op ...',
      title: 'Waar kan ik klein chemisch afval (kca) inleveren?',
      type: 'Vraag en antwoord',
      url: '/onderwerpen/afval/vraag-en-antwoord/waar-kan-ik-klein-chemisch-afval-kca-inleveren',
    },
    {
      id: '3',
      dateTime: '2025-10-20',
      description:
        'Alle EU-lidstaten zijn verplicht iedere 10 jaar een nationaal programma te maken voor het beheer van radioactief afval en ...',
      title: 'Nationaal programma radioactief afval',
      type: 'Publicatie',
      url: '/onderwerpen/afval/radioactief-afval',
    },
    {
      id: '4',
      description: 'Welke regels gelden voor gevaarlijk afval?',
      title: 'Gevaarlijk afval veilig inzamelen',
      type: 'Onderwerp',
      url: '/onderwerpen/afval/gevaarlijk-afval',
    },
    {
      id: '5',
      dateTime: '2026-02-01',
      description: 'Op weetwatjedoorspoelt.nl leest u wat er wel en niet in het riool terecht mag komen.',
      title: 'Welk afval mag ik door de wc of gootsteen spoelen?',
      type: 'Vraag en antwoord',
      url: '/onderwerpen/afval/vraag-en-antwoord/welk-afval-mag-ik-door-de-wc-of-gootsteen-spoelen',
    },
    {
      id: '6',
      description:
        'Goed gescheiden afval is makkelijker te recyclen dan afval dat niet wordt gescheiden. Daarom wil de overheid dat afval wordt ...',
      title: 'Huishoudelijk afval scheiden en recyclen',
      type: 'Onderwerp',
      url: '/onderwerpen/afval/huishoudelijk-afval',
    },
    {
      id: '7',
      dateTime: '2026-01-28',
      description: 'Nieuwe maatregelen voor het scheiden van bedrijfsafval per 2026.',
      title: 'Nieuws: Bedrijfsafval scheiden wordt verplicht',
      type: 'Nieuwsbericht',
      url: '/nieuws/bedrijfsafval-scheiden',
    },
    {
      id: '8',
      description: 'Contactgegevens Centrale Organisatie voor Radioactief Afval (COVRA)',
      title: 'Centrale Organisatie voor Radioactief Afval (COVRA)',
      type: 'Contactgegevens',
      url: '/contact/covra',
    },
    {
      id: '9',
      date: '01-06-2025',
      dateTime: '2025-06-01',
      description:
        'Deze scenariostudie verkent mogelijkheden voor internationale samenwerking in het beheer van radioactief afval. De resultaten ...',
      title: 'Scenariostudie multinationale strategie eindberging radioactief afval',
      type: 'Rapport',
      url: '/publicaties/scenariostudie-radioactief-afval',
    },
    {
      id: '10',
      date: '06-11-2025',
      dateTime: '2025-11-06',
      description: 'Ontwikkelpad Afval en recycling - november 2025',
      title: 'Ontwikkelpad Afval en recycling - november 2025',
      type: 'Publicatie',
      url: '/publicaties/ontwikkelpad-afval-recycling',
    },
  ],
  sortBy: 'relevance',
  totalResults: 471,
};
