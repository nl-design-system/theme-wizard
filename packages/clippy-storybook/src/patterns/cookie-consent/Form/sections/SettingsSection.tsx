import { Fieldset, FieldsetLegend, Paragraph } from '@utrecht/component-library-react/dist/css-module';
import React, { type FC, type ReactNode } from 'react';
import type { CookieOption, CookieType } from '../types';
import { CookieOptionCard } from '../CookieOptionCard';

interface SettingsSectionProps {
  children?: ReactNode;
  cookieOptions: CookieOption[];
  onCheckboxChange: (cookieId: CookieType, checked: boolean) => void;
  selectedCookies: Set<CookieType>;
}

/**
 * The settings section of the cookie consent form where users can select their preferences.
 */
export const SettingsSection: FC<SettingsSectionProps> = ({
  children,
  cookieOptions,
  onCheckboxChange,
  selectedCookies,
}) => (
  <>
    {children ?? (
      <Paragraph>Wij willen graag uw toestemming om uw gegevens te gebruiken voor de volgende doeleinden:</Paragraph>
    )}

    <Fieldset>
      <FieldsetLegend>
        <strong>Kies welke cookies je wilt accepteren:</strong>
      </FieldsetLegend>

      <div className="utrecht-cookie-options">
        {cookieOptions.map((option) => (
          <CookieOptionCard
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
