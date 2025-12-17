import type { FC } from 'react';
import {
  Accordion,
  AccordionSection,
  Link,
  Heading1,
  Heading2,
  Heading3,
  LinkList,
  LinkListLink,
  Paragraph,
  PageContent,
  PageHeader,
} from '@utrecht/component-library-react/dist/css-module';
import NavigationBar from './components/NavigationBar';
import OpeningHoursCard from './components/OpeningHoursCard';
import QuickTasks from './components/QuickTasks';

const GemeenteVoorbeeldHome: FC = () => {
  const quickTasks = [
    { href: '#', icon: 'paspoort', title: 'Paspoort of ID-kaart aanvragen' },
    { href: '/meldingen/', icon: 'melding-klacht', title: 'Meldingen openbare ruimte' },
    { href: '#', icon: 'verhuizen', title: 'Verhuizing doorgeven' },
    { href: '#', icon: 'werken', title: 'Werken bij de gemeente' },
    { href: '#', icon: 'nummerbord', title: 'Parkeren: kentekenwijziging doorgeven' },
    { href: '#', icon: 'afval-scheiden', title: 'Afval' },
  ];

  return (
    <div>
      <PageHeader>
        <PageContent>
          <Heading1>Gemeente Voorbeeld</Heading1>
          <Link>Contact</Link>
          <Link>Mijn Omgeving</Link>
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
      />
      <section className="voorbeeld-toptask">
        <div className="voorbeeld-toptask__layout">
          <QuickTasks tasks={quickTasks} />
          <OpeningHoursCard />
        </div>
      </section>

      <section aria-labelledby="zelf-regelen-heading">
        <Heading2 id="zelf-regelen-heading">Zelf regelen</Heading2>
        <Paragraph>Regel uw zaken online bij gemeente Voorbeeld. Kies een onderwerp om direct te starten.</Paragraph>
      </section>

      <section aria-labelledby="veelgestelde-vragen-heading">
        <Heading3 id="veelgestelde-vragen-heading">Veelgestelde vragen</Heading3>

        <Accordion>
          <AccordionSection
            headingLevel={3}
            label="Hoe vraag ik een paspoort aan?"
            body={
              <Paragraph>
                Maak online een afspraak en neem een pasfoto en uw huidige reisdocument mee naar het gemeentehuis.
              </Paragraph>
            }
          />

          <AccordionSection
            headingLevel={3}
            label="Waar vind ik informatie over afvalinzameling?"
            body={
              <Paragraph>
                Bekijk de afvalkalender en locaties van milieustraten op de pagina Afval op gemeentevoorbeeld.nl.
              </Paragraph>
            }
          />
        </Accordion>
      </section>

      <section aria-labelledby="nieuws-heading">
        <Heading3 id="nieuws-heading">Nieuws en inzichten</Heading3>

        <LinkList>
          <LinkListLink href="#">Wijkraadleden officieel beëdigd</LinkListLink>
          <LinkListLink href="#">Huurteam geeft huurders gratis hulp</LinkListLink>
          <LinkListLink href="#">Bijzonder beroep: specialist maatschappelijke ontwikkeling</LinkListLink>
          <LinkListLink href="#">De Tegeltaxi gaat weer rijden!</LinkListLink>
        </LinkList>
      </section>
    </div>
  );
};

export default GemeenteVoorbeeldHome;
