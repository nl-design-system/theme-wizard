import type { NewsItem } from './components/NewsCards/types';
import type { QuickTask } from './components/QuickTasks/types';
import type { NavigationItem } from './Sections/Navigation/types';
import sewerImage from '../../assets/images/140571-klein.jpg';
import cyclistImage from '../../assets/images/56370-klein.jpg';
import parrotImage from '../../assets/images/NL-HaNA_2.24.01.03_0_905-2093-klein.jpg';
import lambsImage from '../../assets/images/NL-HaNA_2.24.01.05_0_914-7737-klein.jpg';

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
    body: 'De kinderboerderij heeft twee nieuwe wollige bewoners! Help mee hun namen te kiezen. Stem op je favoriet via onze website.',
    date: 'donderdag 15 februari 2024',
    dateTime: '2024-02-15',
    href: '',
    image: {
      alt: 'Schaap met twee pasgeboren lammetjes',
      src: lambsImage,
    },
    title: 'Hoe moeten onze lammetjes heten?',
  },
  {
    body: 'Ooit afgevraagd wat er onder je voeten gebeurt? Tijdens de Dag van het Riool kun je afdalen in ons ondergrondse gangenstelsel. Laarzen verplicht, neus dichtknijpen optioneel.',
    date: 'woensdag 14 februari 2024',
    dateTime: '2024-02-14',
    href: '',
    image: {
      alt: 'Medewerker daalt via een trap af in het riool',
      src: sewerImage,
    },
    title: 'Dag van het Riool: durf jij af te dalen?',
  },
  {
    body: 'De lokale omroep zoekt dieren met sterallures voor een nieuwe serie. Aanstaande zaterdag kunnen baasjes met hun huisdier langskomen voor een screentest in het cultuurcentrum.',
    date: 'dinsdag 13 februari 2024',
    dateTime: '2024-02-13',
    href: '',
    image: {
      alt: 'Cameraman filmt een papegaai in de dierentuin',
      focalPoint: 'center 25%',
      src: parrotImage,
    },
    title: 'Gezocht: huisdieren met talent voor tv',
  },
  {
    body: 'Heb jij een stem die gehoord mag worden? Meld je aan voor de Open Podium Avond in het dorpshuis. Van protestlied tot smartlap: alles mag, playback niet.',
    date: 'maandag 12 februari 2024',
    dateTime: '2024-02-12',
    href: '',
    image: {
      alt: 'Zanger zingt op de grond tijdens Open Podium Avond 2025',
      focalPoint: 'center 75%',
      src: cyclistImage,
    },
    title: 'Zing je eigen lied op Open Podium Avond',
  },
];

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: '#', label: 'Home' },
  { href: '#', label: 'Wonen en leven' },
  { href: '#', label: 'Zorg en onderwijs' },
  { href: '#', label: 'Werk en inkomen' },
  { href: '#', label: 'Contact' },
];
