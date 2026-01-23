import { Paragraph } from '@nl-design-system-candidate/paragraph-react/css';
import { Fieldset, FieldsetLegend } from '@utrecht/component-library-react/dist/css-module';
import React, { type ReactNode, type PropsWithChildren, useMemo } from 'react';
import type { CookieOption as CookieOptionType, CookieType } from '../types';
import { CookieOption } from './CookieOption';

export interface CookieOptionListProps {
  children?: ReactNode;
  cookieOptions: CookieOptionType[];
  legendConsent?: string;
  legendLegitimateInterest?: string;
  onCheckboxChange: (cookieId: CookieType, checked: boolean) => void;
  selectedCookies: Set<CookieType>;
  showLegitimateInterest?: boolean;
}

const CONSENT_DESCRIPTION =
  'Voor deze cookies is jouw toestemming vereist. Vink aan welke cookies je wilt accepteren. ' +
  'Je kunt je toestemming op ieder moment intrekken via deze cookie-instellingen.';

const LEGITIMATE_INTEREST_DESCRIPTION =
  'Deze cookies worden geplaatst op basis van ons gerechtvaardigd belang voor het goed functioneren van de website. ' +
  'Je kunt bezwaar maken door het vinkje uit te zetten. Als je bezwaar maakt, worden deze cookies niet meer geplaatst.';

/**
 * A fieldset containing a list of cookie options with checkboxes.
 * Optionally separates consent-based and legitimate-interest-based options.
 *
 * - Clear distinction between consent (opt-in) and legitimate interest (opt-out)
 * - Explains how to withdraw consent or object
 * - Makes clear what happens when clicking a checkbox
 */
export const CookieOptionList = ({
  children,
  cookieOptions,
  legendConsent = 'Toestemming vereist',
  legendLegitimateInterest = 'Gerechtvaardigd belang',
  onCheckboxChange,
  selectedCookies,
  showLegitimateInterest = true,
}: PropsWithChildren<CookieOptionListProps>) => {
  const { consentOptions, legitimateInterestOptions } = useMemo(() => {
    if (!showLegitimateInterest) {
      return { consentOptions: cookieOptions, legitimateInterestOptions: [] };
    }

    return cookieOptions.reduce<{
      consentOptions: CookieOptionType[];
      legitimateInterestOptions: CookieOptionType[];
    }>(
      (acc, option) => {
        const legalBasis = option.legalBasis ?? 'consent';
        if (legalBasis === 'legitimate-interest') {
          acc.legitimateInterestOptions.push(option);
        } else {
          acc.consentOptions.push(option);
        }
        return acc;
      },
      { consentOptions: [], legitimateInterestOptions: [] },
    );
  }, [cookieOptions, showLegitimateInterest]);

  const hasConsentOptions = consentOptions.length > 0;
  const hasLegitimateInterestOptions = legitimateInterestOptions.length > 0;

  return (
    <>
      {children}

      {hasConsentOptions && (
        <Fieldset aria-describedby="consent-description" className="clippy-cookie-fieldset">
          <FieldsetLegend className="clippy-cookie-fieldset__legend">{legendConsent}</FieldsetLegend>

          <Paragraph className="clippy-cookie-fieldset__description" id="consent-description">
            {CONSENT_DESCRIPTION}
          </Paragraph>

          <div className="clippy-cookie-options">
            {consentOptions.map((option) => (
              <CookieOption
                isSelected={selectedCookies.has(option.id)}
                key={option.id}
                onChange={onCheckboxChange}
                option={option}
              />
            ))}
          </div>
        </Fieldset>
      )}

      {hasLegitimateInterestOptions && (
        <Fieldset
          aria-describedby="legitimate-interest-description"
          className="clippy-cookie-fieldset clippy-cookie-fieldset--legitimate-interest"
        >
          <FieldsetLegend>
            <strong>{legendLegitimateInterest}</strong>
          </FieldsetLegend>

          <Paragraph className="clippy-cookie-fieldset__description" id="legitimate-interest-description">
            {LEGITIMATE_INTEREST_DESCRIPTION}
          </Paragraph>

          <div className="clippy-cookie-options">
            {legitimateInterestOptions.map((option) => (
              <CookieOption
                isSelected={selectedCookies.has(option.id)}
                key={option.id}
                onChange={onCheckboxChange}
                option={option}
              />
            ))}
          </div>
        </Fieldset>
      )}
    </>
  );
};
