import { Button } from '@nl-design-system-candidate/button-react/css';
import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { Link } from '@nl-design-system-candidate/link-react/css';
import { Paragraph } from '@nl-design-system-candidate/paragraph-react/css';
import React, { type FC } from 'react';
import type { CookieOption, CookieType } from '../types';

export interface DataPanelProps {
  buttonResetLabel?: string;
  cookieOptions: CookieOption[];
  onReset?: () => void;
  selectedCookies: Set<CookieType>;
}

const RESET_DESCRIPTION =
  'Zet alle cookievoorkeuren terug naar de standaardinstellingen. Toestemmingscookies worden uitgeschakeld, ' +
  'cookies op basis van gerechtvaardigd belang worden ingeschakeld.';

export const DataPanel: FC<DataPanelProps> = ({
  buttonResetLabel = 'Cookies resetten',
  cookieOptions,
  onReset,
  selectedCookies,
}) => (
  <>
    <Heading level={2}>Mijn gegevens</Heading>

    <Paragraph>
      Je hebt het recht om je gegevens in te zien, te corrigeren, te verwijderen of over te dragen. Ook kun je bezwaar
      maken tegen het gebruik van je gegevens.
    </Paragraph>

    <Paragraph>Je huidige cookievoorkeuren:</Paragraph>

    <div className="utrecht-cookie-consent__preferences-box">
      <ul className="utrecht-cookie-consent__preferences-list">
        {cookieOptions.map((option) => (
          <li key={option.id}>
            {option.label}: {selectedCookies.has(option.id) ? 'Geaccepteerd' : 'Geweigerd'}
          </li>
        ))}
      </ul>
    </div>

    <Paragraph>Om je cookievoorkeuren te wijzigen, ga naar het tabblad &quot;Instellingen&quot;.</Paragraph>

    <Paragraph>
      Voor vragen over je privacyrechten kun je contact opnemen via{' '}
      <Link href="mailto:privacy@example.nl">privacy@example.nl</Link>
    </Paragraph>

    {onReset && (
      <div className="utrecht-cookie-reset">
        <Paragraph className="utrecht-cookie-reset__description">{RESET_DESCRIPTION}</Paragraph>
        <Button onClick={onReset} purpose="secondary" type="button">
          {buttonResetLabel}
        </Button>
      </div>
    )}
  </>
);
