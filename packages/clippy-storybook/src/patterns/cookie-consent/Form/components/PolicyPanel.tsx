import { Link } from '@nl-design-system-candidate/link-react/css';
import { Paragraph } from '@nl-design-system-candidate/paragraph-react/css';
import React, { type FC, type ReactNode } from 'react';

export interface PolicyPanelProps {
  children?: ReactNode;
  privacyPolicyUrl?: string;
}

/**
 * Demo Panel component - this is just an example of how to implement an accordion section on the cookie page
 * Cookie policy content explaining what cookies are and how they are used.
 */
export const PolicyPanel: FC<PolicyPanelProps> = ({ children, privacyPolicyUrl }) => (
  <>
    {children}

    <Paragraph>
      Op deze website gebruiken wij cookies en vergelijkbare technieken. Cookies zijn kleine tekstbestanden die door een
      internetpagina op een pc, tablet of mobiele telefoon worden geplaatst.
    </Paragraph>

    <Paragraph>Wij gebruiken cookies om:</Paragraph>

    <ul>
      <li>de functionaliteit van de website te garanderen;</li>
      <li>de website te verbeteren en te analyseren;</li>
      <li>voorkeuren te onthouden;</li>
      <li>relevante content en advertenties te tonen.</li>
    </ul>

    <Paragraph>
      Je kunt zelf kiezen welke cookies je accepteert. Je kunt je keuze altijd weer aanpassen via de
      cookie-instellingen.
    </Paragraph>

    {privacyPolicyUrl && (
      <Paragraph>
        <Link href={privacyPolicyUrl} rel="noopener noreferrer" target="_blank">
          Lees meer in ons privacybeleid
        </Link>
      </Paragraph>
    )}
  </>
);
