import { Heading } from '@nl-design-system-candidate/heading-react/css';
import {
  Fieldset,
  FieldsetLegend,
  FormField,
  FormLabel,
  Paragraph,
  RadioButton,
  Textbox,
} from '@utrecht/component-library-react/dist/css-module';
import React, { type FC, useState } from 'react';
import type { SearchFilters as SearchFiltersState } from '../types';
import { SEARCH_FILTER_PERIODS } from '../constants';

export interface SearchFiltersProps {
  filters: SearchFiltersState;
  onFilterChange: (key: keyof SearchFiltersState, value: string) => void;
}

export const SearchFiltersComponent: FC<SearchFiltersProps> = ({ filters, onFilterChange }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const isCustomPeriod = filters.period === 'custom';

  const handleDateChange = () => {
    if (dateFrom && dateTo) {
      // Format: "YYYY-MM-DD to YYYY-MM-DD"
      onFilterChange('period', `${dateFrom} to ${dateTo}`);
    }
  };

  return (
    <aside className="search-filters" aria-label="Zoekfilters">
      <section>
        <Heading level={3} appearance="level-4">
          Periode
        </Heading>
        <Fieldset id="search-filter-period" role="radiogroup">
          <FieldsetLegend>
            <span className="ams-visually-hidden">Selecteer periode</span>
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

          {isCustomPeriod && (
            <div className="search-filter-date-range" role="group" aria-labelledby="date-range-label">
              <span id="date-range-label" className="ams-visually-hidden">
                Selecteer datumbereik
              </span>
              
              <div className="search-filter-date-range__fields">
                <FormField>
                  <Paragraph className="utrecht-form-field__label">
                    <FormLabel htmlFor="date-from">Van:</FormLabel>
                  </Paragraph>
                  <Textbox
                    id="date-from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      setTimeout(handleDateChange, 0);
                    }}
                    aria-label="Startdatum"
                  />
                </FormField>

                <FormField>
                  <Paragraph className="utrecht-form-field__label">
                    <FormLabel htmlFor="date-to">Tot:</FormLabel>
                  </Paragraph>
                  <Textbox
                    id="date-to"
                    type="date"
                    value={dateTo}
                    min={dateFrom}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      setTimeout(handleDateChange, 0);
                    }}
                    aria-label="Einddatum"
                  />
                </FormField>
              </div>
            </div>
          )}
        </Fieldset>
      </section>
    </aside>
  );
};
