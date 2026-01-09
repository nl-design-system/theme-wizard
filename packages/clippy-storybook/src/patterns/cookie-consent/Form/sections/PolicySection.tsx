import { Heading2, Link, Paragraph } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC } from 'react';

interface PolicySectionProps {
  privacyPolicyUrl?: string;
}

/**
 * The cookie policy section explaining what cookies are and how they are used.
 */
export const PolicySection: FC<PolicySectionProps> = ({ privacyPolicyUrl }) => (
  <>
    <Heading2 className="utrecht-cookie-consent__section-title">Cookieverklaring</Heading2>

    <Paragraph>
      Op deze website gebruiken wij cookies en vergelijkbare technieken. Cookies zijn kleine tekstbestanden die door een
      internetpagina op een pc, tablet of mobiele telefoon worden geplaatst.
    </Paragraph>

    <Paragraph>Wij gebruiken cookies om:</Paragraph>

    <ul className="utrecht-cookie-consent__list">
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
