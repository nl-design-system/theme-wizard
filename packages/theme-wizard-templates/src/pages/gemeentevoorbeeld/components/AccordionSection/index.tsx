import { LinkList, LinkListLink, Paragraph } from '@utrecht/component-library-react/dist/css-module';
import { UtrechtIconChevronRight } from '@utrecht/web-component-library-react';
import * as React from 'react';
import type { AccordionSection } from './types';
import { Column, Row } from '../Layout';

export const ACCORDION_SECTIONS: AccordionSection[] = [
  {
    body: (
      <Row gap="var(--basis-space-column-6xl)" justify="space-between">
        <Column cols={8}>
          <Paragraph>
            Met een paspoort, identiteitskaart of rijbewijs kunt u zich identificeren en reizen. Onder voorwaarden kunt
            u de Nederlandse identiteit krijgen.
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
            Wilt u het kenteken aanpassen van uw parkeervergunning, garageabonnement of gehandicaptenparkeerplaats? Kies
            hier wat u wilt aanpassen.
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
];
