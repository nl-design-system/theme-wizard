import rosetta from 'rosetta';
import ValidationIssue from '../lib/ValidationIssue';
import { en, nl } from './messages';

const i18n = rosetta({ en, nl });
i18n.locale('nl');
i18n.set('nl', nl);
i18n.set('en', en);

export const t = (key: string, params?: ValidationIssue | Record<string, unknown>): string => {
  const result = i18n.t(key, params);
  return (typeof result === 'string' && result !== '') || (typeof result === 'object' && result !== null)
    ? result
    : key;
};

export default i18n;
