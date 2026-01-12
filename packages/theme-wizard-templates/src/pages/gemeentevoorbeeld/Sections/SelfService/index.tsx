import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { AccordionProvider, ButtonLink, PageContent } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC } from 'react';
import { ACCORDION_SECTIONS } from '../../components/AccordionSection';
import { Row } from '../../components/Layout';

export interface SelfServiceSectionProps {
  heading?: string;
  moreButtonLabel?: string;
}

const SelfServiceSection: FC<SelfServiceSectionProps> = ({
  heading = 'Zelf regelen',
  moreButtonLabel = 'Meer bekijken',
}) => (
  <PageContent className="clippy-section--secondary">
    <section aria-labelledby="zelf-regelen-heading" className="clippy-section clippy-voorbeeld-accordion__section">
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
