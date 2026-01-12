import { Fieldset, FieldsetLegend } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC, type ReactNode } from 'react';
import type { CookieOption as CookieOptionType, CookieType } from '../types';
import { CookieOption } from './CookieOption';

export interface CookieOptionListProps {
  children?: ReactNode;
  cookieOptions: CookieOptionType[];
  legend?: string;
  onCheckboxChange: (cookieId: CookieType, checked: boolean) => void;
  selectedCookies: Set<CookieType>;
}

/**
 * A fieldset containing a list of cookie options with checkboxes.
 */
export const CookieOptionList: FC<CookieOptionListProps> = ({
  children,
  cookieOptions,
  legend = 'Kies welke cookies je wilt accepteren:',
  onCheckboxChange,
  selectedCookies,
}) => (
  <>
    {children}

    <Fieldset>
      <FieldsetLegend>
        <strong>{legend}</strong>
      </FieldsetLegend>

      <div className="utrecht-cookie-options">
        {cookieOptions.map((option) => (
          <CookieOption
            isSelected={selectedCookies.has(option.id)}
            key={option.id}
            onChange={onCheckboxChange}
            option={option}
          />
        ))}
      </div>
    </Fieldset>
  </>
);
