import { ERROR_CODES } from '@nl-design-system-community/design-tokens-schema';
import rosetta from 'rosetta';

export type MessageKey =
  | 'unknown'
  | 'validation.title'
  | 'validation.error.insufficient_contrast.label'
  | 'validation.error.insufficient_contrast.parts'
  | 'validation.error.invalid_ref.label'
  | 'validation.error.unknown'
  | 'validation.token_link.aria_label';

/**
 * Return type for contrast message parts function
 * Used to compose translated messages with HTML components
 */
export interface ContrastMessageParts {
  separator: string;
  details: string;
}

const i18n = rosetta();

// Set default locale
i18n.locale('nl');

i18n.set('nl', {
  unknown: 'Onbekende fout opgetreden',
  validation: {
    error: {
      [ERROR_CODES.INSUFFICIENT_CONTRAST]: {
        label: 'Onvoldoende contrast',
        parts(obj: Record<string, string | number>): ContrastMessageParts {
          return {
            details: `Contrast: ${obj['current']}, minimaal vereist: ${obj['minimum']}`,
            separator: ' en ',
          };
        },
      },
      [ERROR_CODES.INVALID_REF]: {
        label: 'Ongeldige referentie',
      },
      unknown: 'Onbekende fout',
    },
    title: 'Thema validatie fouten',
    token_link: {
      aria_label: 'Spring naar {{token}}',
    },
  },
});

i18n.set('en', {
  unknown: 'Unknown error',
  validation: {
    error: {
      [ERROR_CODES.INSUFFICIENT_CONTRAST]: {
        label: 'Insufficient contrast',
        parts(obj: Record<string, string | number>): ContrastMessageParts {
          return {
            details: `Contrast: ${obj['current']}, required minimum: ${obj['minimum']}`,
            separator: ' and ',
          };
        },
      },
      [ERROR_CODES.INVALID_REF]: {
        label: 'Invalid reference',
      },
      unknown: 'Unknown error',
    },
    title: 'Theme validation errors',
    token_link: {
      aria_label: 'Jump to {{token}}',
    },
  },
});

export default i18n;
