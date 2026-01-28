import { DescriptionList } from '@amsterdam/design-system-react';
import React from 'react';
import type { Cookie } from '../types';
import '@amsterdam/design-system-css/dist/index.css';
import '@amsterdam/design-system-tokens/dist/index.css';

export interface CookieDescriptionListProps {
  cookies: Cookie[];
}

/**
 * Displays cookie details as a (responsive) description list.
 */
export const CookieDescriptionList = ({ cookies }: CookieDescriptionListProps) => (
  <DescriptionList className="clippy-description-list clippy-description-list--nested">
    {cookies.map((cookie) => (
      <DescriptionList.Section key={cookie.name} className="clippy-description-list__section--cookie">
        <DescriptionList.Term className="clippy-description-list__term">{cookie.name}</DescriptionList.Term>
        <DescriptionList.Description className="clippy-description-list__description">
          <DescriptionList className="clippy-description-list__grid" termsWidth="medium">
            <DescriptionList.Section className="clippy-description-list__row">
              <DescriptionList.Term className="clippy-description-list__term">Type</DescriptionList.Term>
              <DescriptionList.Description className="clippy-description-list__description">
                {cookie.type}
              </DescriptionList.Description>
            </DescriptionList.Section>

            <DescriptionList.Section className="clippy-description-list__row">
              <DescriptionList.Term className="clippy-description-list__term">Looptijd</DescriptionList.Term>
              <DescriptionList.Description className="clippy-description-list__description">
                {cookie.duration}
              </DescriptionList.Description>
            </DescriptionList.Section>

            <DescriptionList.Section className="clippy-description-list__row">
              <DescriptionList.Term className="clippy-description-list__term">Beschrijving</DescriptionList.Term>
              <DescriptionList.Description className="clippy-description-list__description">
                {cookie.description}
              </DescriptionList.Description>
            </DescriptionList.Section>
          </DescriptionList>
        </DescriptionList.Description>
      </DescriptionList.Section>
    ))}
  </DescriptionList>
);
