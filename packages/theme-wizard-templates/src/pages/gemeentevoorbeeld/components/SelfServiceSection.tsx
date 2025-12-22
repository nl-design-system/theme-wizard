import type { FC } from 'react';
import { AccordionProvider, ButtonLink, Heading2, PageContent } from '@utrecht/component-library-react/dist/css-module';
import type { AccordionSection } from '../types';
import { Row } from './Layout';

export interface SelfServiceSectionProps {
  accordionSections: AccordionSection[];
  heading?: string;
  moreButtonLabel?: string;
  onMoreButtonClick?: () => void;
}

const SelfServiceSection: FC<SelfServiceSectionProps> = ({
  accordionSections,
  heading = 'Zelf regelen',
  moreButtonLabel = 'Meer bekijken',
  onMoreButtonClick,
}) => (
  <PageContent className="section--secondary">
    <section aria-labelledby="zelf-regelen-heading" className="section">
      <Row justify="space-between">
        <Heading2 id="zelf-regelen-heading">{heading}</Heading2>

        <ButtonLink appearance="primary-action-button" onClick={onMoreButtonClick}>
          {moreButtonLabel}
        </ButtonLink>
      </Row>

      <AccordionProvider headingLevel={3} sections={accordionSections} />
    </section>
  </PageContent>
);

export default SelfServiceSection;
