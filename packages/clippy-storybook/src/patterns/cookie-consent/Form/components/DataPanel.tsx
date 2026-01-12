import { Heading2, Link, Paragraph } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC } from 'react';
import type { CookieOption, CookieType } from '../types';

export interface DataPanelProps {
  cookieOptions: CookieOption[];
  selectedCookies: Set<CookieType>;
}

/**
 * "My data" panel showing current cookie preferences and privacy rights information.
 */
export const DataPanel: FC<DataPanelProps> = ({ cookieOptions, selectedCookies }) => (
  <>
    <Heading2 className="utrecht-cookie-consent__section-title">Mijn gegevens</Heading2>

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
  </>
);
