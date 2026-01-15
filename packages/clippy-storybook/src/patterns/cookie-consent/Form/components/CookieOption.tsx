import '@amsterdam/design-system-css/dist/visually-hidden/visually-hidden.css';
import { Button } from '@nl-design-system-candidate/button-react/css';
import { NumberBadge } from '@nl-design-system-candidate/number-badge-react/css';
import { FormFieldCheckbox, Icon } from '@utrecht/component-library-react/dist/css-module';
import { UtrechtIconChevronDown } from '@utrecht/web-component-library-react';
import React, { memo, useCallback, useState, type ChangeEvent, type FC } from 'react';
import type { CookieOption as CookieOptionType, CookieType, LegalBasis } from '../types';
import { CookieDescriptionList } from './CookieDescriptionList';

export interface CookieOptionProps {
  isSelected: boolean;
  onChange: (cookieId: CookieType, checked: boolean) => void;
  option: CookieOptionType;
}

/**
 * Get the description suffix based on legal basis and required status.
 */
const getDescriptionSuffix = (required: boolean, legalBasis: LegalBasis): string => {
  if (required) {
    return ' (Noodzakelijk – deze cookies zijn vereist voor de werking van de website en kunnen niet worden uitgeschakeld)';
  }
  if (legalBasis === 'legitimate-interest') {
    return ' (Standaard actief – zet uit om bezwaar te maken)';
  }
  return '';
};

/**
 * A single cookie option with checkbox, expandable details, and accessibility features.
 *
 * - Clear labeling of what each checkbox does
 * - Distinction between consent (opt-in) and legitimate interest (opt-out)
 * - Accessible descriptions for screen readers
 */
export const CookieOption: FC<CookieOptionProps> = memo(({ isSelected, onChange, option }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cookieCount = option.cookies?.length ?? 0;
  const hasCookies = cookieCount > 0;
  const cookieCountLabel = cookieCount === 1 ? 'cookie' : 'cookies';
  const legalBasis = option.legalBasis ?? 'consent';

  const handleCheckboxChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(option.id, event.target.checked);
    },
    [onChange, option.id],
  );

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const descriptionSuffix = getDescriptionSuffix(option.required ?? false, legalBasis);
  const description = option.description ? `${option.description}${descriptionSuffix}` : descriptionSuffix.trim();

  const label = (
    <>
      {option.label}{' '}
      <span aria-hidden="true">
        <NumberBadge>{cookieCount}</NumberBadge>
      </span>
      <span className="ams-visually-hidden">
        , bevat {cookieCount} {cookieCountLabel}
      </span>
    </>
  );

  return (
    <div className="clippy-cookie-option">
      <div className="clippy-cookie-option__header">
        <FormFieldCheckbox
          defaultChecked={isSelected}
          description={description}
          disabled={option.required}
          id={`cookie-option-${option.id}`}
          label={label}
          name={`cookie-option-${option.id}`}
          onChange={handleCheckboxChange}
          value={option.id}
        />

        {hasCookies && (
          <Button
            aria-expanded={isExpanded}
            iconOnly
            iconStart={
              <Icon className="clippy-cookie-option__toggle-icon">
                <UtrechtIconChevronDown />
              </Icon>
            }
            label={`${isExpanded ? 'Verberg' : 'Toon'} cookie details voor ${option.label} (${cookieCount} ${cookieCountLabel})`}
            onClick={handleToggle}
            purpose="subtle"
            toggle
          />
        )}
      </div>

      {hasCookies && isExpanded && option.cookies && (
        <div className="clippy-cookie-option__details">
          <CookieDescriptionList cookies={option.cookies} />
        </div>
      )}
    </div>
  );
});

CookieOption.displayName = 'CookieOption';
