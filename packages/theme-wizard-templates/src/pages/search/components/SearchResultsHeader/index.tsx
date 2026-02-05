import { Heading } from "@nl-design-system-candidate/heading-react";
import { Paragraph } from "@nl-design-system-candidate/paragraph-react";

export const SearchResultsHeader = ({ headingText, statusText, activeFilterLabels }: { headingText: string, statusText: string, activeFilterLabels: { key: string, value: string, label: string }[] }) => (
  <div className="clippy--search-results-summary" aria-live="polite">
    <div className='clippy--search-results-heading-wrapper'>
      <hgroup>
        <Heading level={1}>
          {headingText}
        </Heading>

        <div className="clippy--search-results-summary-info">
          <Paragraph role='status' className="clippy--search-results-count">
            {statusText}
          </Paragraph>

          <div className="clippy--active-filters" aria-label="De volgende filters zijn actief">
            {activeFilterLabels.map((filter) => (
              <span
                key={`${filter.key}-${filter.value}`}
                className="clippy--active-filter-label-item"
              >
                {filter.label}
              </span>
            ))}
          </div>
        </div>
      </hgroup>
    </div>
  </div>
)