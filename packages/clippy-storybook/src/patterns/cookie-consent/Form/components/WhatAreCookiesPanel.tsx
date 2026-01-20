import { DescriptionList } from '@amsterdam/design-system-react';
import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { Paragraph } from '@nl-design-system-candidate/paragraph-react/css';
import React, { type FC } from 'react';
import '@amsterdam/design-system-css/dist/index.css';
import '@amsterdam/design-system-tokens/dist/index.css';

/**
 * Demo Panel component - this is just an example of how to implement a section on the cookie page
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

    <DescriptionList className="clippy-description-list">
      <DescriptionList.Section className="clippy-description-list__section">
        <DescriptionList.Term className="clippy-description-list__term">Noodzakelijke cookies</DescriptionList.Term>
        <DescriptionList.Description className="clippy-description-list__description">
          Deze zijn essentieel voor het functioneren van de website. Zonder deze cookies werken bepaalde functies niet.
        </DescriptionList.Description>
      </DescriptionList.Section>

      <DescriptionList.Section className="clippy-description-list__section">
        <DescriptionList.Term className="clippy-description-list__term">Analytische cookies</DescriptionList.Term>
        <DescriptionList.Description className="clippy-description-list__description">
          Deze helpen ons te begrijpen hoe bezoekers de website gebruiken, zodat we de website kunnen verbeteren.
        </DescriptionList.Description>
      </DescriptionList.Section>

      <DescriptionList.Section className="clippy-description-list__section">
        <DescriptionList.Term className="clippy-description-list__term">Functionele cookies</DescriptionList.Term>
        <DescriptionList.Description className="clippy-description-list__description">
          Deze onthouden je voorkeuren, zoals taalinstellingen.
        </DescriptionList.Description>
      </DescriptionList.Section>

      <DescriptionList.Section className="clippy-description-list__section">
        <DescriptionList.Term className="clippy-description-list__term">Marketing cookies</DescriptionList.Term>
        <DescriptionList.Description className="clippy-description-list__description">
          Deze worden gebruikt om advertenties relevanter te maken voor jou.
        </DescriptionList.Description>
      </DescriptionList.Section>

      <DescriptionList.Section className="clippy-description-list__section">
        <DescriptionList.Term className="clippy-description-list__term">Externe content cookies</DescriptionList.Term>
        <DescriptionList.Description className="clippy-description-list__description">
          Deze worden geplaatst door externe diensten zoals YouTube of Google Maps wanneer je embedded content bekijkt.
        </DescriptionList.Description>
      </DescriptionList.Section>
    </DescriptionList>
  </>
);
