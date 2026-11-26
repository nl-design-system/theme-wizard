import { ERROR_CODES, type ThemeValidationIssue } from '@nl-design-system-community/design-tokens-schema';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import '.';
import type Theme from '../../lib/Theme';
import { WizardValidationMessage } from '.';
import { provideTokenUrlResolver, type TokenUrlResolver } from '../../contexts/token-url';
import i18n from '../../i18n';
import ValidationIssue from '../../lib/ValidationIssue';

const tag = 'wizard-validation-message';

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

const makeIssue = (
  path: string,
  errorCode: (typeof ERROR_CODES)[keyof typeof ERROR_CODES],
  extra: Record<string, unknown> = {},
): ValidationIssue =>
  new ValidationIssue({
    code: 'custom',
    ERROR_CODE: errorCode,
    message: 'Something went wrong',
    path: path.split('.'),
    ...extra,
  } as ThemeValidationIssue);

const mount = async (
  path: string,
  theme: Partial<Theme>,
  tokenUrlResolver?: TokenUrlResolver,
): Promise<WizardValidationMessage> => {
  document.body.innerHTML = '<div id="context-host"></div>';
  const host = document.querySelector('#context-host') as HTMLElement;
  if (tokenUrlResolver) {
    provideTokenUrlResolver(host, tokenUrlResolver);
  }
  const el = document.createElement(tag) as WizardValidationMessage;
  el.path = path;
  (el as unknown as { theme: Theme }).theme = theme as Theme;
  host.append(el);
  await el.updateComplete;
  return el;
};

const setTheme = (el: WizardValidationMessage, theme: Partial<Theme>) => {
  (el as unknown as { theme: Theme }).theme = theme as Theme;
};

const getParagraph = (el: WizardValidationMessage): HTMLParagraphElement | null =>
  el.shadowRoot?.querySelector('p.nl-paragraph') ?? null;

const getText = (el: WizardValidationMessage): string => normalizeWhitespace(el.shadowRoot?.textContent ?? '');

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    i18n.locale('nl');
  });

  describe('when no issue matches', () => {
    it('renders nothing when the path is empty', async () => {
      const el = await mount('', { issues: [makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)] });
      expect(getParagraph(el)).toBeNull();
      expect(getText(el)).toBe('');
    });

    it('renders nothing when the theme has no issues', async () => {
      const el = await mount('basis.line-height.md', { issues: [] });
      expect(getParagraph(el)).toBeNull();
      expect(getText(el)).toBe('');
    });

    it('renders nothing when no issue has exactly the given path', async () => {
      const issues = [
        makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT),
        makeIssue('basis.line-height.sm', ERROR_CODES.UNEXPECTED_UNIT),
      ];
      const el = await mount('basis.line-height.lg', { issues });
      expect(getParagraph(el)).toBeNull();
      expect(getText(el)).toBe('');
    });
  });

  describe('when an issue matches the path', () => {
    it('renders the issue path as a link to the design-tokens page', async () => {
      const el = await mount(
        'basis.line-height.md',
        {
          issues: [makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)],
        },
        (tokenPath) => `/design-tokens/${tokenPath.replaceAll('.', '/')}`,
      );

      const anchor = getParagraph(el)?.querySelector('a');
      expect(anchor?.textContent).toBe('basis.line-height.md');
      expect(anchor?.getAttribute('href')).toBe('/design-tokens/basis/line-height/md');
    });

    it('renders the issue path without a link when no token URL resolver is provided', async () => {
      const el = await mount('basis.line-height.md', {
        issues: [makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)],
      });

      expect(getParagraph(el)?.querySelector('a')).toBeNull();
      expect(getText(el)).toContain('basis.line-height.md');
    });

    it('renders the issue path without a link when the resolver has no page for the path', async () => {
      const el = await mount(
        'basis.line-height.md',
        {
          issues: [makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)],
        },
        () => undefined,
      );

      expect(getParagraph(el)?.querySelector('a')).toBeNull();
      expect(getText(el)).toContain('basis.line-height.md');
    });

    it('renders the translated message for the issue code', async () => {
      const el = await mount('basis.line-height.md', {
        issues: [makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)],
      });

      expect(getText(el)).toContain('basis.line-height.md');
      expect(getText(el)).toContain('Onverwachte eenheid. Gebruik alleen nummers.');
    });

    it('interpolates issue details into the message', async () => {
      const issue = makeIssue('basis.color.accent-1.color-default', ERROR_CODES.INSUFFICIENT_CONTRAST, {
        actual: 3.5,
        minimum: 4.5,
        tokens: ['basis.color.accent-1.color-default', 'basis.color.default.bg-document'],
      });
      const el = await mount(issue.path, { issues: [issue] });

      const text = getText(el);
      expect(text).toContain('Onvoldoende contrast met basis.color.default.bg-document');
      expect(text).toContain('Contrast: 3,5');
      expect(text).toContain('Minimaal vereist: 4,5');
    });

    it('picks the issue with the exact path when multiple issues exist', async () => {
      const issues = [
        makeIssue('basis.line-height.sm', ERROR_CODES.UNEXPECTED_UNIT),
        makeIssue('basis.text.font-size.sm', ERROR_CODES.FONT_SIZE_TOO_SMALL, { actual: '0.5rem', minimum: '1rem' }),
      ];
      const el = await mount('basis.text.font-size.sm', { issues });

      expect(getText(el)).toContain('basis.text.font-size.sm');
      expect(getText(el)).toContain('Lettergrootte is te klein');
      expect(getText(el)).not.toContain('Onverwachte eenheid');
    });
  });

  describe('reactivity', () => {
    it('updates when the path changes to another matching issue', async () => {
      const issues = [
        makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT),
        makeIssue('basis.text.font-size.sm', ERROR_CODES.FONT_SIZE_TOO_SMALL, { actual: '0.5rem', minimum: '1rem' }),
      ];
      const el = await mount('basis.line-height.md', { issues });
      expect(getText(el)).toContain('Onverwachte eenheid');

      el.path = 'basis.text.font-size.sm';
      await el.updateComplete;
      expect(getText(el)).toContain('Lettergrootte is te klein');
    });

    it('renders nothing when the path changes to a non-matching path', async () => {
      const el = await mount('basis.line-height.md', {
        issues: [makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)],
      });
      expect(getParagraph(el)).not.toBeNull();

      el.path = 'does.not.exist';
      await el.updateComplete;
      expect(getParagraph(el)).toBeNull();
      expect(getText(el)).toBe('');
    });

    it('renders again when the path changes back to a matching path', async () => {
      const issues = [makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)];
      const el = await mount('does.not.exist', { issues });
      expect(getParagraph(el)).toBeNull();

      el.path = 'basis.line-height.md';
      await el.updateComplete;
      expect(getParagraph(el)).not.toBeNull();
    });

    it('renders nothing when the theme no longer has the issue', async () => {
      const el = await mount('basis.line-height.md', {
        issues: [makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)],
      });
      expect(getParagraph(el)).not.toBeNull();

      setTheme(el, { issues: [] });
      await el.updateComplete;
      expect(getParagraph(el)).toBeNull();
    });

    it('renders when the theme gains a matching issue', async () => {
      const el = await mount('basis.line-height.md', { issues: [] });
      expect(getParagraph(el)).toBeNull();

      setTheme(el, { issues: [makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)] });
      await el.updateComplete;
      expect(getParagraph(el)).not.toBeNull();
      expect(getText(el)).toContain('Onverwachte eenheid');
    });
  });

  describe('English locale', () => {
    beforeEach(() => {
      i18n.locale('en');
    });

    it('renders an English message for the issue code', async () => {
      const el = await mount('basis.line-height.md', {
        issues: [makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)],
      });

      expect(getText(el)).toContain('Unexpected unit. Use a plain number instead.');
    });
  });
});
