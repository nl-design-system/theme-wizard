import { Heading } from '@nl-design-system-candidate/heading-react/css';
import {
  AccordionProvider,
  Fieldset,
  FieldsetLegend,
  FormField,
  FormFieldCheckbox,
  FormLabel,
  Paragraph,
  RadioButton,
} from '@utrecht/component-library-react/dist/css-module';
import React, { type FC, useMemo } from 'react';
import type { AccordionSection } from '../../../components/AccordionSection/types';
import type { SearchFilters as SearchFiltersState } from '../types';
import { SEARCH_FILTER_PERIODS, SEARCH_FILTER_MINISTRIES, SEARCH_FILTER_TYPES } from '../constants';

export interface SearchFiltersProps {
  filters: SearchFiltersState;
  onFilterChange: (key: keyof SearchFiltersState, value: string) => void;
}

export const SearchFiltersComponent: FC<SearchFiltersProps> = ({ filters, onFilterChange }) => {
  const filterSections: AccordionSection[] = useMemo(
    () => [
      {
        body: (
          <Fieldset id="search-filter-period" role="radiogroup">
            <FieldsetLegend>
              <span className="utrecht-visually-hidden">Selecteer periode</span>
            </FieldsetLegend>

            <div className="search-filter-options">
              {SEARCH_FILTER_PERIODS.map((period) => {
                const id = `search-filter-period-${period.value}`;
                const checked = filters.period === period.value;

                return (
                  <FormField key={period.value} type="radio">
                    <Paragraph className="utrecht-form-field__label utrecht-form-field__label--radio">
                      <FormLabel htmlFor={id} type="radio">
                        <RadioButton
                          className="utrecht-form-field__input"
                          id={id}
                          name="period"
                          value={period.value}
                          defaultChecked={checked}
                          onChange={() => onFilterChange('period', period.value)}
                        />
                        {period.label}
                      </FormLabel>
                    </Paragraph>
                  </FormField>
                );
              })}
            </div>
          </Fieldset>
        ),
        label: 'Periode',
      },
      {
        body: (
          <Fieldset id="search-filter-ministry">
            <FieldsetLegend>
              <span className="utrecht-visually-hidden">Selecteer ministerie</span>
            </FieldsetLegend>

            <div className="search-filter-options">
              {SEARCH_FILTER_MINISTRIES.map((ministry) => (
                <FormFieldCheckbox
                  key={ministry.value}
                  id={`search-filter-ministry-${ministry.value}`}
                  name="ministry"
                  value={ministry.value}
                  defaultChecked={
                    ministry.value === 'all'
                      ? !filters.ministry || filters.ministry === 'all'
                      : filters.ministry === ministry.value
                  }
                  label={ministry.label}
                  onChange={() => onFilterChange('ministry', ministry.value)}
                />
              ))}
            </div>
          </Fieldset>
        ),
        label: 'Ministerie',
      },
      {
        body: (
          <Fieldset id="search-filter-type">
            <FieldsetLegend>
              <span className="utrecht-visually-hidden">Selecteer documenttype</span>
            </FieldsetLegend>

            <div className="search-filter-options">
              {SEARCH_FILTER_TYPES.map((type) => (
                <FormFieldCheckbox
                  key={type.value}
                  id={`search-filter-type-${type.value}`}
                  name="type"
                  value={type.value}
                  defaultChecked={
                    type.value === 'all'
                      ? !filters.documentType || filters.documentType === 'all'
                      : filters.documentType === type.value
                  }
                  label={type.label}
                  onChange={() => onFilterChange('documentType', type.value)}
                />
              ))}
            </div>
          </Fieldset>
        ),
        label: 'Type',
      },
    ],
    [filters, onFilterChange],
  );

  return (
    <aside aria-label="Zoekfilters">
      <Heading level={2} appearance="level-3" className="utrecht-visually-hidden">
        Vul zoekcriteria in
      </Heading>

      <AccordionProvider headingLevel={3} sections={filterSections} />
    </aside>
  );
};
