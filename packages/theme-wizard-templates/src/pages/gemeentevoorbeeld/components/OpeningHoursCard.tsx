import { Icon } from '@utrecht/component-library-react';
import { ButtonLink, Heading3, Heading4, Paragraph } from '@utrecht/component-library-react/dist/css-module';
import { UtrechtIconAfspraakMaken } from '@utrecht/web-component-library-react';
import React, { type FC } from 'react';

export interface OpeningHoursCardProps {
  buttonLabel?: string;
  hours?: string;
  onButtonClick?: () => void;
  subtitle?: string;
  title?: string;
}

const DEFAULT_HOURS = 'Maandag t/m vrijdag van 09.00 tot 17.00 uur. Op donderdag ook geopend tot 20.00 uur.';
const DEFAULT_SUBTITLE = 'Openingstijden Gemeentehuis';
const DEFAULT_TITLE = 'Openingstijden';
const DEFAULT_BUTTON_LABEL = 'Contact';

const OpeningHoursCard: FC<OpeningHoursCardProps> = ({
  buttonLabel = DEFAULT_BUTTON_LABEL,
  hours = DEFAULT_HOURS,
  onButtonClick,
  subtitle = DEFAULT_SUBTITLE,
  title = DEFAULT_TITLE,
}) => (
  <div className="voorbeeld__card">
    <Icon>
      <UtrechtIconAfspraakMaken />
    </Icon>

    <Heading3>{title}</Heading3>

    <Heading4>{subtitle}</Heading4>

    <Paragraph className="voorbeeld-paragraph--opening-times">{hours}</Paragraph>

    <ButtonLink appearance="secondary-action-button" onClick={onButtonClick}>
      {buttonLabel}
    </ButtonLink>
  </div>
);

export default OpeningHoursCard;
