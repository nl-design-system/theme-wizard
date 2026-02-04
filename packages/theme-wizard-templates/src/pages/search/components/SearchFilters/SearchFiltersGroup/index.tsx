import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { NumberBadge } from '@nl-design-system-candidate/number-badge-react/css';
import {
  Fieldset,
  FieldsetLegend,
  FormField,
  FormLabel,
  RadioButton,
} from '@utrecht/component-library-react/dist/css-module';
import React from 'react';
import type { SearchFilterGroupProps } from './types';
import './styles.css';

export const SearchFilterGroup = ({
  id,
  name,
  children,
  onValueChange,
  options,
  selectedValue,
  title,
}: SearchFilterGroupProps) => (
  <section className="clippy--search-filter-section">
    <div className="clippy--search-filter-heading">
      <Heading level={3} appearance="level-3">
        {title}
      </Heading>
    </div>

    <Fieldset id={id} role="radiogroup">
      <FieldsetLegend>
        <span className="ams-visually-hidden">Selecteer {title.toLowerCase()}</span>
      </FieldsetLegend>

      <ul className="clippy--search-filter-options">
        {options.map((option) => {
          const optionId = `${id}-${option.value}`;
          const checked = selectedValue === option.value;

          return (
            <FormField key={option.value} type="radio">
              <li className="clippy--search-filter-list-item utrecht-form-field__label utrecht-form-field__label--radio">
                  <RadioButton
                    className="clippy--radio-button utrecht-form-field__input"
                    id={optionId}
                    name={name}
                    value={option.value}
                    checked={checked}
                    onChange={() => onValueChange(option.value)}
                  />

                  <FormLabel htmlFor={optionId} type="radio" className="clippy--search-filter-label">
                    <span className="clippy--search-filter-item-text">{option.label}</span>
                    {option.count !== undefined && (
                      <>
                        <span aria-hidden="true" className="clippy--search-filter-item-count">
                          <NumberBadge>{option.count}</NumberBadge>
                        </span>
                        <span className="ams-visually-hidden">, bevat {option.count} resultaten</span>
                      </>
                    )}
                  </FormLabel>

              </li>
            </FormField>
          );
        })}
      </ul>
      {children}
    </Fieldset>
  </section>
);
