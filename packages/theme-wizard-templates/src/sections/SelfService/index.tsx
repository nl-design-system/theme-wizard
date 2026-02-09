import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { AccordionProvider, ButtonLink, PageContent } from '@utrecht/component-library-react/dist/css-module';
import React from 'react';
import { ACCORDION_SECTIONS } from '../../components/AccordionSection';
import { Row } from '../../components/Layout';
import './styles.css';

export interface SelfServiceSectionProps {
  heading?: string;
  moreButtonLabel?: string;
}

const SelfServiceSection = ({
  heading = 'Zelf regelen',
  moreButtonLabel = 'Meer bekijken',
}: SelfServiceSectionProps) => (
  <PageContent className="utrecht-page-body__content--secondary">
    <section aria-labelledby="zelf-regelen-heading" className="clippy-voorbeeld-accordion__section">
      <Row justify="space-between">
        <Heading id="zelf-regelen-heading" level={2} appearance="level-2">
          {heading}
        </Heading>

        <ButtonLink appearance="primary-action-button" href="/">
          {moreButtonLabel}
        </ButtonLink>
      </Row>

      <AccordionProvider headingLevel={3} sections={ACCORDION_SECTIONS} />
    </section>
  </PageContent>
);

export default SelfServiceSection;
