import type { FC } from 'react';
import {
  AccordionProvider,
  ButtonLink,
  Link,
  Heading1,
  Heading2,
  Heading3,
  LinkList,
  LinkListLink,
  Paragraph,
  PageContent,
  PageHeader,
  PageFooter,
} from '@utrecht/component-library-react/dist/css-module';
import { UtrechtIconChevronRight } from '@utrecht/web-component-library-react';
import { Column, Row } from './components/Layout';
import NavigationBar from './components/NavigationBar';
import NewsCards from './components/NewsCards';
import OpeningHoursCard from './components/OpeningHoursCard';
import QuickTasks from './components/QuickTasks';

export interface GemeenteVoorbeeldHomeProps {
  currentPath?: string;
}

const GemeenteVoorbeeldHome: FC<GemeenteVoorbeeldHomeProps> = ({ currentPath }) => {
  const quickTasks = [
    { href: '#', icon: 'paspoort', title: 'Paspoort of ID-kaart aanvragen' },
    { href: '/meldingen/', icon: 'melding-klacht', title: 'Meldingen openbare ruimte' },
    { href: '#', icon: 'verhuizen', title: 'Verhuizing doorgeven' },
    { href: '#', icon: 'werken', title: 'Werken bij de gemeente' },
    { href: '#', icon: 'nummerbord', title: 'Parkeren: kentekenwijziging doorgeven' },
    { href: '#', icon: 'afval-scheiden', title: 'Afval' },
  ];

  const newsItems = [
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

  return (
    <div>
      <PageHeader>
        <PageContent>
          <div className="section">
            <Row justify="space-between" align="center">
              <Column cols={6}>
                <Heading1>Gemeente Voorbeeld</Heading1>
              </Column>
              <Row align="flex-end">
                <Column cols={12}>
                  <Link>Contact</Link>
                  <Link>Mijn Omgeving</Link>
                </Column>
              </Row>
            </Row>
          </div>
        </PageContent>
      </PageHeader>

      <NavigationBar
        items={[
          { href: '#', label: 'Home' },
          { href: '#', label: 'Wonen en leven' },
          { href: '#', label: 'Zorg en onderwijs' },
          { href: '#', label: 'Werk en inkomen' },
          { href: '#', label: 'Contact' },
        ]}
        currentPath={currentPath}
      />
      <PageContent>
        <section className="section">
          <Row rowGap="var(--basis-space-column-xl)" columnGap={'var(--basis-space-column-xl)'} justify="space-between">
            <Column cols={9}>
              <QuickTasks tasks={quickTasks} />
            </Column>

            <Column cols={3}>
              <OpeningHoursCard />
            </Column>
          </Row>
        </section>
      </PageContent>

      <PageContent className="section--secondary">
        <section className="section" aria-labelledby="zelf-regelen-heading">
          <Row justify="space-between">
            <Heading2 id="zelf-regelen-heading">Zelf regelen</Heading2>

            <ButtonLink appearance="primary-action-button">Meer bekijken</ButtonLink>
          </Row>

          <AccordionProvider
            headingLevel={3}
            sections={[
              {
                body: (
                  <Row gap="var(--basis-space-column-6xl)" justify="space-between">
                    <Column cols={8}>
                      <Paragraph>
                        Met een paspoort, identiteitskaart of rijbewijs kunt u zich identificeren en reizen. Onder
                        voorwaarden kunt u de Nederlandse identiteit krijgen.
                      </Paragraph>
                    </Column>

                    <Column cols={4}>
                      <LinkList>
                        <LinkListLink href="#" icon={<UtrechtIconChevronRight />}>
                          Paspoort aanvragen
                        </LinkListLink>
                        <LinkListLink href="#" icon={<UtrechtIconChevronRight />}>
                          ID-kaart aanvragen
                        </LinkListLink>
                        <LinkListLink href="#" icon={<UtrechtIconChevronRight />}>
                          Rijbewijs aanvragen
                        </LinkListLink>
                      </LinkList>
                    </Column>
                  </Row>
                ),
                label: 'Hoe vraag ik een paspoort aan?',
              },
              {
                body: (
                  <Row gap="var(--basis-space-column-6xl)" justify="space-between">
                    <Column cols={12}>
                      <LinkList>
                        <LinkListLink href="#" icon={<UtrechtIconChevronRight />}>
                          Verhuizing naar Gemeente voorbeeld
                        </LinkListLink>
                        <LinkListLink href="#" icon={<UtrechtIconChevronRight />}>
                          Verhuizing vanuit het buitenland naar Gemeente voorbeeld doorgeven
                        </LinkListLink>
                        <LinkListLink href="#" icon={<UtrechtIconChevronRight />}>
                          Verhuizing naar het buitenland doorgeven
                        </LinkListLink>
                      </LinkList>
                    </Column>
                  </Row>
                ),
                label: 'Verhuizen',
              },
              {
                body: (
                  <Row gap="var(--basis-space-column-6xl)" justify="space-between">
                    <Column cols={9}>
                      <Paragraph>
                        Wilt u het kenteken aanpassen van uw parkeervergunning, garageabonnement of
                        gehandicaptenparkeerplaats? Kies hier wat u wilt aanpassen.
                      </Paragraph>
                    </Column>
                    <Column cols={12}>
                      <LinkList>
                        <LinkListLink href="#" icon={<UtrechtIconChevronRight />}>
                          Verhuizing naar Gemeente voorbeeld
                        </LinkListLink>
                        <LinkListLink href="#" icon={<UtrechtIconChevronRight />}>
                          Verhuizing vanuit het buitenland naar Gemeente voorbeeld doorgeven
                        </LinkListLink>
                        <LinkListLink href="#" icon={<UtrechtIconChevronRight />}>
                          Verhuizing naar het buitenland doorgeven
                        </LinkListLink>
                      </LinkList>
                    </Column>
                  </Row>
                ),
                label: 'Kentekenwijziging doorgeven',
              },
            ]}
          />
        </section>
      </PageContent>

      <PageContent>
        <section className="section" aria-labelledby="nieuws-heading">
          <Heading3 id="nieuws-heading">Nieuws en inzichten</Heading3>
          <NewsCards cards={newsItems}></NewsCards>
        </section>
      </PageContent>

      <PageFooter>
        <PageContent>
          <div className="section">
            <Row rowGap={'var(--basis-space-column-xl)'} columnGap={'var(--basis-space-column-xl)'}>
              <Column cols={6}>
                <Heading3>Footer</Heading3>
              </Column>
              <Column cols={3}>
                <LinkList>
                  <LinkListLink href="">Contact</LinkListLink>
                  <LinkListLink href="">RSS</LinkListLink>
                </LinkList>
              </Column>
              <Column cols={3}>
                <Row justify="flex-end">
                  <LinkList>
                    <LinkListLink href="">Bescherming persoonsgegevens</LinkListLink>
                    <LinkListLink href="">Gebruikersvoorwaarden</LinkListLink>
                    <LinkListLink href="">Proclaimer</LinkListLink>
                    <LinkListLink href="">Cookieverklaring</LinkListLink>
                  </LinkList>
                </Row>
              </Column>
            </Row>
          </div>
        </PageContent>
      </PageFooter>
    </div>
  );
};

export default GemeenteVoorbeeldHome;
