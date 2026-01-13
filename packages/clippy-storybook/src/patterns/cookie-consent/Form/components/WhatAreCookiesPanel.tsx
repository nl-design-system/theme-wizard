import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { Paragraph } from '@nl-design-system-candidate/paragraph-react/css';
import { UnorderedList, UnorderedListItem } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC } from 'react';

/**
 * Demo Panel component - this is just an example of how to implement an accordion section on the cookie page
 * Panel explaining what cookies are and why websites use them.
 */
export const WhatAreCookiesPanel: FC = () => (
  <>
    <Heading level={2}>Wat zijn cookies?</Heading>

    <Paragraph>
      Cookies zijn kleine tekstbestanden die door een website op je computer, tablet of telefoon worden geplaatst
      wanneer je de website bezoekt. Ze worden veel gebruikt om websites goed te laten werken en om informatie te
      verzamelen over je bezoek.
    </Paragraph>

    <Paragraph>Er zijn verschillende soorten cookies:</Paragraph>

    <UnorderedList>
      <UnorderedListItem>
        <strong>Noodzakelijke cookies</strong> – Deze zijn essentieel voor het functioneren van de website. Zonder deze
        cookies werken bepaalde functies niet.
      </UnorderedListItem>
      <UnorderedListItem>
        <strong>Analytische cookies</strong> – Deze helpen ons te begrijpen hoe bezoekers de website gebruiken, zodat we
        de website kunnen verbeteren.
      </UnorderedListItem>
      <UnorderedListItem>
        <strong>Functionele cookies</strong> – Deze onthouden je voorkeuren, zoals taalinstellingen.
      </UnorderedListItem>
      <UnorderedListItem>
        <strong>Marketing cookies</strong> – Deze worden gebruikt om advertenties relevanter te maken voor jou.
      </UnorderedListItem>
      <UnorderedListItem>
        <strong>Externe content cookies</strong> – Deze worden geplaatst door externe diensten zoals YouTube of Google
        Maps wanneer je embedded content bekijkt.
      </UnorderedListItem>
    </UnorderedList>
  </>
);
