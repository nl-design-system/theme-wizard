import type { TemplateResult } from 'lit';
import rosetta from 'rosetta';
import ValidationIssue from '../lib/ValidationIssue';
import { en, nl } from './messages';

const supportedLocales = new Set(['nl', 'en']);
const i18n = rosetta({ en, nl });
i18n.locale('nl');

for (const locale of navigator.languages) {
  if (supportedLocales.has(locale)) {
    i18n.locale(locale);
    break;
  }
}

i18n.set('nl', nl);
i18n.set('en', en);

export const t = (key: string, params?: ValidationIssue | Record<string, unknown>): string | TemplateResult => {
  const result = i18n.t(key, params);

  return (typeof result === 'string' && result !== '') || (typeof result === 'object' && result !== null)
    ? result
    : key;
};

export default i18n;
