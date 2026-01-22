import { Heading } from '@nl-design-system-candidate/heading-react/css';
import { IconCalendarEvent } from '@tabler/icons-react';
import { Icon } from '@utrecht/component-library-react';
import { ButtonLink } from '@utrecht/component-library-react/dist/css-module';
import React, { Fragment, useMemo } from 'react';
import type { OpeningHoursCardProps } from './types';
import '../shared/card-styles.css';

const formatTime = (time: string): string => time.substring(0, 5);

const OpeningHoursCard = ({ openingHoursSummary = [] }: OpeningHoursCardProps) => {
  useMemo(() => {
    const today = new Date();
    return {
      dayName: today.toLocaleDateString('nl-NL', { weekday: 'long' }),
      formattedDate: today.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
      }),
    };
  }, []);

  return (
    <div className="clippy-voorbeeld__card">
      <Icon>
        <IconCalendarEvent />
      </Icon>

      <section aria-labelledby="openingstijden">
        <Heading level={2} appearance="level-3" id="openingstijden">
          Openingstijden Gemeentehuis
        </Heading>

        {openingHoursSummary && openingHoursSummary.length > 0 && (
          <div className="opening-hours-summary">
            {openingHoursSummary.map((item) => (
              <Fragment key={item.label}>
                <p className="opening-hours-item">
                  <strong>{item.label}:</strong>{' '}
                  <p>
                    {item.hours ? (
                      item.hours.map((hour, index) => (
                        <span key={`${hour.opens}-${hour.closes}`}>
                          {index > 0 && ', '}
                          <time dateTime={formatTime(hour.opens)}>{formatTime(hour.opens)}</time>
                          {' tot '}
                          <time dateTime={formatTime(hour.closes)}>{formatTime(hour.closes)}</time>
                        </span>
                      ))
                    ) : (
                      <span>gesloten</span>
                    )}
                  </p>
                </p>

                <br />
              </Fragment>
            ))}
          </div>
        )}
      </section>

      <ButtonLink appearance="secondary-action-button" className="contact-button" href="/">
        Contact
      </ButtonLink>
    </div>
  );
};

export default OpeningHoursCard;
