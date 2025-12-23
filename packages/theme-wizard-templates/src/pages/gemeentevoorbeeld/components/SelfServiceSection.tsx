import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { AccordionProvider, ButtonLink, PageContent } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC } from 'react';
import type { AccordionSection } from '../types';
import { Row } from './Layout';

export interface SelfServiceSectionProps {
  accordionSections: AccordionSection[];
  heading?: string;
  moreButtonLabel?: string;
}

const SelfServiceSection: FC<SelfServiceSectionProps> = ({
  accordionSections,
  heading = 'Zelf regelen',
  moreButtonLabel = 'Meer bekijken',
}) => (
  <PageContent className="section--secondary">
    <section aria-labelledby="zelf-regelen-heading" className="section">
      <Row justify="space-between">
        <Heading id="zelf-regelen-heading" level={2} appearance="level-2">
          {heading}
        </Heading>

        <ButtonLink appearance="primary-action-button" href="/">
          {moreButtonLabel}
        </ButtonLink>
      </Row>

      <AccordionProvider headingLevel={3} sections={accordionSections} />
    </section>
  </PageContent>
);

export default SelfServiceSection;
