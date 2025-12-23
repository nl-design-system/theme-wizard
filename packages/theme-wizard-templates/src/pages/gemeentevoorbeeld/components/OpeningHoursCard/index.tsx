import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { Paragraph } from '@nl-design-system-candidate/paragraph-react/css';
import { Icon } from '@utrecht/component-library-react';
import { ButtonLink } from '@utrecht/component-library-react/dist/css-module';
import { UtrechtIconAfspraakMaken } from '@utrecht/web-component-library-react';
import React from 'react';

const OpeningHoursCard = () => (
  <div className="voorbeeld__card" itemScope itemType="https://schema.org/GovernmentOffice">
    <Icon>
      <UtrechtIconAfspraakMaken />
    </Icon>
    <Heading level={2} appearance="level-2" itemProp="name">
      Gemeente Voorbeeld
    </Heading>
    <Heading level={3} appearance="level-3">
      Openingstijden Gemeentehuis
    </Heading>
    <Paragraph className="nl-paragraph nl-paragraph--lead">Vandaag:</Paragraph>

    <span itemProp="openingHours" content="Mo-Fr 08:30-17:30">
      <time dateTime="08:30">08:30</time> tot <time dateTime="17:30">17:30</time>
    </span>
    <span itemProp="openingHours" content="Th 18:00-20:00">
      <time dateTime="18:00">18:00</time> tot <time dateTime="20:00">20:00</time>
    </span>
    <ButtonLink appearance="secondary-action-button" href="/">
      Contact
    </ButtonLink>
  </div>
);

export default OpeningHoursCard;
