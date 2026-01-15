import { DescriptionList } from '@amsterdam/design-system-react';
import React, { type FC } from 'react';
import type { Cookie } from '../types';
import '@amsterdam/design-system-css/dist/index.css';
import '@amsterdam/design-system-tokens/dist/index.css';

export interface CookieDescriptionListProps {
  cookies: Cookie[];
}

/**
 * Displays cookie details as a (responsive) description list.
 */
export const CookieDescriptionList: FC<CookieDescriptionListProps> = ({ cookies }) => (
  <DescriptionList className="clippy-cookie-details">
    {cookies.map((cookie) => (
      <DescriptionList.Section key={cookie.name} className="clippy-cookie-details__cookie">
        <DescriptionList.Term className="clippy-cookie-details__cookie-name">{cookie.name}</DescriptionList.Term>
        <DescriptionList.Description className="clippy-cookie-details__cookie-details">
          <DescriptionList className="clippy-cookie-details__grid" termsWidth="medium">
            <DescriptionList.Section className="clippy-cookie-details__row">
              <DescriptionList.Term className="clippy-cookie-details__term">Type</DescriptionList.Term>
              <DescriptionList.Description className="clippy-cookie-details__value">
                {cookie.type}
              </DescriptionList.Description>
            </DescriptionList.Section>

            <DescriptionList.Section className="clippy-cookie-details__row">
              <DescriptionList.Term className="clippy-cookie-details__term">Looptijd</DescriptionList.Term>
              <DescriptionList.Description className="clippy-cookie-details__value">
                {cookie.duration}
              </DescriptionList.Description>
            </DescriptionList.Section>

            <DescriptionList.Section className="clippy-cookie-details__row">
              <DescriptionList.Term className="clippy-cookie-details__term">Beschrijving</DescriptionList.Term>
              <DescriptionList.Description className="clippy-cookie-details__value">
                {cookie.description}
              </DescriptionList.Description>
            </DescriptionList.Section>
          </DescriptionList>
        </DescriptionList.Description>
      </DescriptionList.Section>
    ))}
  </DescriptionList>
);
