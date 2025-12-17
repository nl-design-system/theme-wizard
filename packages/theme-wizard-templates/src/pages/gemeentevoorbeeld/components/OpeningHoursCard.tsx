import type { FC } from 'react';
import { Button, Heading3, Heading4, Paragraph } from '@utrecht/component-library-react/dist/css-module';

interface OpeningHoursCardProps {
  title?: string;
  subtitle?: string;
  hours?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

const OpeningHoursCard: FC<OpeningHoursCardProps> = ({
  buttonLabel = 'Contact',
  hours = 'Maandag t/m vrijdag van 09.00 tot 17.00 uur. Op donderdag ook geopend tot 20.00 uur.',
  onButtonClick,
  subtitle = 'Openingstijden Gemeentehuis',
  title = 'Openingstijden',
}) => {
  return (
    <div className="voorbeeld-toptask__card">
      <Heading3>{title}</Heading3>
      <Heading4>{subtitle}</Heading4>
      <Paragraph className="voorbeeld-paragraph--opening-times">{hours}</Paragraph>
      <Button appearance="secondary-action-button" onClick={onButtonClick}>
        {buttonLabel}
      </Button>
    </div>
  );
};

export default OpeningHoursCard;
