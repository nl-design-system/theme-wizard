export type ThemeConfig = {
  className: string;
  title: string;
  href: string;
  package: string;
};

export const THEMES: ThemeConfig[] = [
  {
    className: 'voorbeeld-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/voorbeeld-design-tokens/dist/theme.css',
    package: '@nl-design-system-unstable/voorbeeld-design-tokens',
    title: 'Voorbeeld thema',
  },
  {
    className: 'start-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/start-design-tokens/dist/theme.css',
    package: '@nl-design-system-unstable/start-design-tokens',
    title: 'Start thema',
  },
  {
    className: 'ma-theme',
    href: 'https://unpkg.com/@nl-design-system-community/ma-design-tokens/dist/theme.css',
    package: '@nl-design-system-unstable/start-design-tokens',
    title: 'Mooi & Anders thema',
  },
  {
    className: 'amsterdam-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/amsterdam-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/amsterdam-design-tokens',
    title: 'Gemeente Amsterdam',
  },
  {
    className: 'bodegravenreeuwijk-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/bodegraven-reeuwijk-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/bodegraven-reeuwijk-design-tokens',
    title: 'Gemeente Bodegraven-Reeuwijk',
  },
  {
    className: 'buren-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/buren-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/buren-design-tokens',
    title: 'Gemeente Buren',
  },
  {
    className: 'denhaag-theme',
    href: 'https://unpkg.com/@gemeente-denhaag/design-tokens-components/dist/theme/index.css',
    package: '@gemeente-denhaag/design-tokens-components',
    title: 'Gemeente Den Haag',
  },
  {
    className: 'drechterland-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/drechterland-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/drechterland-design-tokens',
    title: 'Gemeente Drechterland',
  },
  {
    className: 'duiven-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/duiven-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/duiven-design-tokens',
    title: 'Gemeente Duiven',
  },
  {
    className: 'enkhuizen-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/enkhuizen-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/enkhuizen-design-tokens',
    title: 'Gemeente Enkhuizen',
  },
  {
    className: 'groningen-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/groningen-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/groningen-design-tokens',
    title: 'Gemeente Groningen',
  },
  {
    className: 'haarlem-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/haarlem-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/haarlem-design-tokens',
    title: 'Gemeente Haarlem',
  },
  {
    className: 'haarlemmermeer-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/haarlemmermeer-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/haarlemmermeer-design-tokens',
    title: 'Gemeente Haarlemmermeer',
  },
  {
    className: 'hoorn-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/hoorn-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/hoorn-design-tokens',
    title: 'Gemeente Hoorn',
  },
  {
    className: 'horstaandemaas-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/horstaandemaas-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/horstaandemaas-design-tokens',
    title: 'Gemeente Horst aan de Maas',
  },
  {
    className: 'leidschendamvoorburg-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/leidschendam-voorburg-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/leidschendam-voorburg-design-tokens',
    title: 'Gemeente Leidschendam-Voorburg',
  },
  {
    className: 'noordoostpolder-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/noordoostpolder-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/noordoostpolder-design-tokens',
    title: 'Gemeente Noordoostpolder',
  },
  {
    className: 'of-theme',
    href: 'https://unpkg.com/@open-formulieren/design-tokens/dist/index.css',
    package: '@open-formulieren/design-tokens',
    title: 'Open Formulieren',
  },
  {
    className: 'rotterdam-theme',
    href: 'https://unpkg.com/@gemeente-rotterdam/design-tokens/dist/index.css',
    package: '@gemeente-rotterdam/design-tokens',
    title: 'Gemeente Rotterdam',
  },
  {
    className: 'stedebroec-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/stedebroec-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/stedebroec-design-tokens',
    title: 'Gemeente Stede Broec',
  },
  {
    className: 'tilburg-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/tilburg-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/tilburg-design-tokens',
    title: 'Gemeente Tilburg',
  },
  {
    className: 'utrecht-theme',
    href: 'https://unpkg.com/@utrecht/design-tokens/dist/index.css',
    package: '@utrecht/design-tokens',
    title: 'Gemeente Utrecht',
  },
  {
    className: 'venray-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/venray-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/venray-design-tokens',
    title: 'Gemeente Venray',
  },
  {
    className: 'vught-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/vught-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/vught-design-tokens',
    title: 'Gemeente Vught',
  },
  {
    className: 'westervoort-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/westervoort-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/westervoort-design-tokens',
    title: 'Gemeente Westervoort',
  },
  {
    className: 'zevenaar-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/zevenaar-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/zevenaar-design-tokens',
    title: 'Gemeente Zevenaar',
  },
  {
    className: 'zwolle-theme',
    href: 'https://unpkg.com/@nl-design-system-unstable/zwolle-design-tokens/dist/index.css',
    package: '@nl-design-system-unstable/zwolle-design-tokens',
    title: 'Gemeente Zwolle',
  },
];
