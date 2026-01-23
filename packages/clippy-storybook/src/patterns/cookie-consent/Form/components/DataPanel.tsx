import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { Link } from '@nl-design-system-candidate/link-react/css';
import { Paragraph } from '@nl-design-system-candidate/paragraph-react/css';
import React from 'react';

/*
 * Demo Panel component - this is just an example of how to implement a section on the cookie page
 */
export const DataPanel = () => (
  <>
    <Heading level={2}>Mijn gegevens</Heading>

    <Paragraph>
      Je hebt het recht om je gegevens in te zien, te corrigeren, te verwijderen of over te dragen. Ook kun je bezwaar
      maken tegen het gebruik van je gegevens.
    </Paragraph>

    <Paragraph>
      Voor vragen over je privacyrechten kun je contact opnemen via{' '}
      <Link href="mailto:privacy@example.nl">privacy@example.nl</Link>
    </Paragraph>
  </>
);
