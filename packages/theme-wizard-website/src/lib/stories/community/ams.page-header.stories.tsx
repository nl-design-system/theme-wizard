import type { Meta, StoryObj } from '@storybook/react-vite';
import gridCss from '@amsterdam/design-system-css/dist/grid/grid.css?inline';
import headingCss from '@amsterdam/design-system-css/dist/heading/heading.css?inline';
import iconCss from '@amsterdam/design-system-css/dist/icon/icon.css?inline';
import linkListCss from '@amsterdam/design-system-css/dist/link-list/link-list.css?inline';
import logoCss from '@amsterdam/design-system-css/dist/logo/logo.css?inline';
import pageHeaderCss from '@amsterdam/design-system-css/dist/page-header/page-header.css?inline';
import proseCss from '@amsterdam/design-system-css/dist/prose/prose.css?inline';
import visuallyHiddenCss from '@amsterdam/design-system-css/dist/visually-hidden/visually-hidden.css?inline';
import { Grid, Heading, LinkList, PageHeader } from '@amsterdam/design-system-react';
import { SearchIcon } from '@amsterdam/design-system-react-icons';
import amsTokensCss from '@amsterdam/design-system-tokens/dist/index.theme.css?inline';
import tokens from './ams.page-header.tokens.json';

// copied from https://github.com/Amsterdam/design-system/blob/develop/storybook/src/components/PageHeader/content.ts
const collapsibleMenuItems = [
  [
    { href: '#', label: 'Kaart' },
    { href: '#', label: 'Panoramabeelden' },
    { href: '#', label: 'Tabellen' },
    { href: '#', label: 'Catalogus (Beta)' },
    { href: '#', label: 'Kaarten' },
    { href: '#', label: 'Datacatalogus' },
  ],
  [
    { href: '#', label: 'Over de organisatie' },
    { href: '#', label: 'Over het dataplatform' },
  ],
  [
    { href: '#', label: 'Help' },
    { href: '#', label: 'Contact' },
  ],
];

const meta = {
  id: 'ams-page-header',
  component: PageHeader,
  parameters: {
    css: [amsTokensCss, gridCss, headingCss, iconCss, linkListCss, logoCss, pageHeaderCss, proseCss, visuallyHiddenCss],
    tokens,
  },
  title: 'Page Header (Amsterdam)',
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

// copied from https://github.com/Amsterdam/design-system/blob/develop/storybook/src/components/PageHeader/PageHeader.stories.tsx
export const DefaultPageHeader: Story = {
  name: 'Page Header',
  args: {
    brandName: 'Data Amsterdam',
    children: (
      <Grid>
        <PageHeader.GridCellNarrowWindowOnly span="all">
          <LinkList>
            <LinkList.Link href="#" lang="en">
              English
            </LinkList.Link>
          </LinkList>
        </PageHeader.GridCellNarrowWindowOnly>
        <Grid.Cell className="ams-prose" span={4}>
          <Heading level={2} size="level-3">
            Onderdelen
          </Heading>
          <LinkList>
            {collapsibleMenuItems[0].map(({ href, label }) => (
              <LinkList.Link href={href} key={label}>
                {label}
              </LinkList.Link>
            ))}
          </LinkList>
        </Grid.Cell>
        <Grid.Cell className="ams-prose" span={4}>
          <Heading level={2} size="level-3">
            Over ons
          </Heading>
          <LinkList>
            {collapsibleMenuItems[1].map(({ href, label }) => (
              <LinkList.Link href={href} key={label}>
                {label}
              </LinkList.Link>
            ))}
          </LinkList>
        </Grid.Cell>
        <Grid.Cell className="ams-prose" span={4}>
          <Heading level={2} size="level-3">
            Help
          </Heading>
          <LinkList>
            {collapsibleMenuItems[2].map(({ href, label }) => (
              <LinkList.Link href={href} key={label}>
                {label}
              </LinkList.Link>
            ))}
          </LinkList>
        </Grid.Cell>
      </Grid>
    ),
    menuItems: [
      <PageHeader.MenuLink href="#" key={1} lang="en">
        English
      </PageHeader.MenuLink>,
      <PageHeader.MenuLink fixed href="#" icon={SearchIcon} key={2}>
        Zoeken
      </PageHeader.MenuLink>,
    ],
  },
  // Amsterdam tokens are scoped to `.ams-theme`, the wizard theme doesn't provide them yet
  render: (args) => (
    <div className="ams-theme">
      <PageHeader {...args} />
    </div>
  ),
};
