import { Paragraph } from '@nl-design-system-candidate/paragraph-react';
import { IconChevronRight } from '@tabler/icons-react';
import { LinkList, LinkListLink } from '@utrecht/component-library-react/dist/css-module';
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
            <LinkListLink href="#" icon={<IconChevronRight />}>
              Paspoort aanvragen
            </LinkListLink>

            <LinkListLink href="#" icon={<IconChevronRight />}>
              ID-kaart aanvragen
            </LinkListLink>

            <LinkListLink href="#" icon={<IconChevronRight />}>
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
            <LinkListLink href="#" icon={<IconChevronRight />}>
              Verhuizing naar Gemeente voorbeeld
            </LinkListLink>

            <LinkListLink href="#" icon={<IconChevronRight />}>
              Verhuizing vanuit het buitenland naar Gemeente voorbeeld doorgeven
            </LinkListLink>

            <LinkListLink href="#" icon={<IconChevronRight />}>
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
            <LinkListLink href="#" icon={<IconChevronRight />}>
              Verhuizing naar Gemeente voorbeeld
            </LinkListLink>

            <LinkListLink href="#" icon={<IconChevronRight />}>
              Verhuizing vanuit het buitenland naar Gemeente voorbeeld doorgeven
            </LinkListLink>

            <LinkListLink href="#" icon={<IconChevronRight />}>
              Verhuizing naar het buitenland doorgeven
            </LinkListLink>
          </LinkList>
        </Column>
      </Row>
    ),
    label: 'Kentekenwijziging doorgeven',
  },
];
