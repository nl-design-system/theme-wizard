import type { SearchResultsData } from './SearchResultsPage/types';

export const SEARCH_FILTER_PERIODS = [
  { count: 471, label: 'Altijd', value: 'all' },
  { count: 12, label: 'Afgelopen 7 dagen', value: '7' },
  { count: 45, label: 'Afgelopen 30 dagen', value: '30' },
  { count: 120, label: 'Afgelopen 365 dagen', value: '365' },
  { label: 'Specifieke periode', value: 'custom' },
] as const;

export const SEARCH_FILTER_ORGANIZATIONS = [
  { count: 471, label: 'Alle organisaties', value: 'all' },
  { count: 156, label: 'Organisatie A', value: 'org-a' },
  { count: 89, label: 'Organisatie B', value: 'org-b' },
  { count: 124, label: 'Organisatie C', value: 'org-c' },
  { count: 102, label: 'Organisatie D', value: 'org-d' },
] as const;

export const SEARCH_FILTER_TYPES = [
  { count: 245, label: 'Alle documenten', value: 'all' },
  { count: 86, label: 'Nieuwsbericht', value: 'news' },
  { count: 54, label: 'Vraag en antwoord', value: 'qa' },
  { count: 92, label: 'Publicatie', value: 'publication' },
  { count: 13, label: 'Rapport', value: 'report' },
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
      organization: 'Organisatie A',
    },
    {
      id: '2',
      dateTime: '2026-01-15',
      description:
        'Klein chemisch afval (kca) kunt u inleveren bij een gemeentedepot, chemokar of kca-depot. Kijk voor meer informatie over afval op ...',
      title: 'Waar kan ik klein chemisch afval (kca) inleveren?',
      type: 'Vraag en antwoord',
      url: '/onderwerpen/afval/vraag-en-antwoord/waar-kan-ik-klein-chemisch-afval-kca-inleveren',
      organization: 'Organisatie B',
    },
    {
      id: '3',
      dateTime: '2025-10-20',
      description:
        'Alle EU-lidstaten zijn verplicht iedere 10 jaar een nationaal programma te maken voor het beheer van radioactief afval en ...',
      title: 'Nationaal programma radioactief afval',
      type: 'Publicatie',
      url: '/onderwerpen/afval/radioactief-afval',
      organization: 'Organisatie A',
    },
    {
      id: '4',
      description: 'Welke regels gelden voor gevaarlijk afval?',
      title: 'Gevaarlijk afval veilig inzamelen',
      type: 'Onderwerp',
      url: '/onderwerpen/afval/gevaarlijk-afval',
      organization: 'Organisatie C',
    },
    {
      id: '5',
      dateTime: '2026-02-01',
      description: 'Op weetwatjedoorspoelt.nl leest u wat er wel en niet in het riool terecht mag komen.',
      title: 'Welk afval mag ik door de wc of gootsteen spoelen?',
      type: 'Vraag en antwoord',
      url: '/onderwerpen/afval/vraag-en-antwoord/welk-afval-mag-ik-door-de-wc-of-gootsteen-spoelen',
      organization: 'Organisatie D',
    },
    {
      id: '6',
      description:
        'Goed gescheiden afval is makkelijker te recyclen dan afval dat niet wordt gescheiden. Daarom wil de overheid dat afval wordt ...',
      title: 'Huishoudelijk afval scheiden en recyclen',
      type: 'Onderwerp',
      url: '/onderwerpen/afval/huishoudelijk-afval',
      organization: 'Organisatie A',
    },
    {
      id: '7',
      dateTime: '2026-01-28',
      description: 'Nieuwe maatregelen voor het scheiden van bedrijfsafval per 2026.',
      title: 'Nieuws: Bedrijfsafval scheiden wordt verplicht',
      type: 'Nieuwsbericht',
      url: '/nieuws/bedrijfsafval-scheiden',
      organization: 'Organisatie B',
    },
    {
      id: '8',
      description: 'Contactgegevens Centrale Organisatie voor Radioactief Afval (COVRA)',
      title: 'Centrale Organisatie voor Radioactief Afval (COVRA)',
      type: 'Contactgegevens',
      url: '/contact/covra',
      organization: 'Organisatie C',
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
      organization: 'Organisatie D',
    },
    {
      id: '10',
      date: '06-11-2025',
      dateTime: '2025-11-06',
      description: 'Ontwikkelpad Afval en recycling - november 2025',
      title: 'Ontwikkelpad Afval en recycling - november 2025',
      type: 'Publicatie',
      url: '/publicaties/ontwikkelpad-afval-recycling',
      organization: 'Organisatie A',
    },
  ],
  sortBy: 'relevance',
  totalResults: 471,
};
