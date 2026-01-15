import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { Link } from '@nl-design-system-candidate/link-react/css';
import { Paragraph } from '@nl-design-system-candidate/paragraph-react/css';
import React, { type FC } from 'react';
import type { CookieOption, CookieType } from '../types';

export interface DataPanelProps {
  cookieOptions: CookieOption[];
  selectedCookies: Set<CookieType>;
}

/*
 * Demo Panel component - this is just an example of how to implement an accordion section on the cookie page
 */
export const DataPanel: FC<DataPanelProps> = ({ cookieOptions, selectedCookies }) => (
  <>
    <Heading level={2}>Mijn gegevens</Heading>

    <Paragraph>
      Je hebt het recht om je gegevens in te zien, te corrigeren, te verwijderen of over te dragen. Ook kun je bezwaar
      maken tegen het gebruik van je gegevens.
    </Paragraph>

    <Paragraph>Je huidige cookievoorkeuren:</Paragraph>

    <div className="clippy-cookie-consent__preferences-box">
      <ul className="clippy-cookie-consent__preferences-list">
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
