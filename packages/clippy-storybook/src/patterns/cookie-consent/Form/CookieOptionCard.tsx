import '@amsterdam/design-system-css/dist/visually-hidden/visually-hidden.css';
import { Button } from '@nl-design-system-candidate/button-react/css';
import { NumberBadge } from '@nl-design-system-candidate/number-badge-react/css';
import { FormFieldCheckbox, Icon } from '@utrecht/component-library-react/dist/css-module';
import { UtrechtIconChevronDown } from '@utrecht/web-component-library-react';
import React, { memo, useCallback, useState, type ChangeEvent, type FC } from 'react';
import type { CookieOption, CookieType } from './types';
import { CookieDetailsTable } from './CookieDetailsTable';

interface CookieOptionCardProps {
  isSelected: boolean;
  onChange: (cookieId: CookieType, checked: boolean) => void;
  option: CookieOption;
}

/**
 * A single cookie option card with checkbox, expandable details, and accessibility features.
 */
export const CookieOptionCard: FC<CookieOptionCardProps> = memo(({ isSelected, onChange, option }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cookieCount = option.cookies?.length ?? 0;
  const hasCookies = cookieCount > 0;
  const cookieCountLabel = cookieCount === 1 ? 'cookie' : 'cookies';

  const handleCheckboxChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(option.id, event.target.checked);
    },
    [onChange, option.id],
  );

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const description = option.required
    ? `${option.description} (Verplicht – deze cookies zijn noodzakelijk voor de werking van de website)`
    : option.description;

  const label = (
    <>
      {option.label}{' '}
      <span aria-hidden="true">
        <NumberBadge>{cookieCount}</NumberBadge>
      </span>
      <span className="ams-visually-hidden">
        , {cookieCount} {cookieCountLabel}
      </span>
    </>
  );

  return (
    <div className="utrecht-cookie-option">
      <div className="utrecht-cookie-option__header">
        <FormFieldCheckbox
          checked={isSelected}
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
            iconOnly
            iconStart={
              <Icon size="16px" style={{ '--utrecht-icon-size': '10px' }}>
                <UtrechtIconChevronDown />
              </Icon>
            }
            label={`${isExpanded ? 'Verberg' : 'Toon'} cookie details voor ${option.label} (${cookieCount} ${cookieCountLabel})`}
            purpose="subtle"
            toggle
            onClick={handleToggle}
            aria-expanded={isExpanded}
          ></Button>
        )}
      </div>

      {hasCookies && isExpanded && option.cookies && (
        <div className="utrecht-cookie-option__details">
          <CookieDetailsTable cookies={option.cookies} />
        </div>
      )}
    </div>
  );
});

CookieOptionCard.displayName = 'CookieOptionCard';
