import type { ClippyButton } from '@nl-design-system-community/clippy-components/clippy-button';
import type { ClippyDrawer } from '@nl-design-system-community/clippy-components/clippy-drawer';
import { ContextProvider } from '@lit/context';
import '@nl-design-system-community/clippy-components/clippy-stack';
import { ERROR_CODES, type ThemeValidationIssue } from '@nl-design-system-community/design-tokens-schema';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type Theme from '../../lib/Theme';
import { WizardValidationDrawer } from '.';
import { themeContext } from '../../contexts/theme';
import '.';
import ValidationIssue from '../../lib/ValidationIssue';

const tag = 'wizard-validation-drawer';

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

// Mirrors the Theme getters the component reads: errorCount and groupedIssues
const makeTheme = (issues: ValidationIssue[]): Theme =>
  ({
    errorCount: issues.length,
    groupedIssues: Object.groupBy(issues, ({ code }) => code),
    issues,
  }) as unknown as Theme;

const mount = async (theme: Theme) => {
  document.body.innerHTML = '<div id="context-host"></div>';
  const host = document.querySelector('#context-host') as HTMLElement;
  // A real provider (instead of assigning the consumed property) so the nested
  // <wizard-validation-message> children receive the theme through the context too.
  const provider = new ContextProvider(host, { context: themeContext, initialValue: theme });
  provider.hostConnected();
  const el = document.createElement(tag) as WizardValidationDrawer;
  host.append(el);
  await el.updateComplete;
  await getDrawer(el)?.updateComplete;
  return { el, provider };
};

const getToggle = (el: WizardValidationDrawer): ClippyButton | null | undefined =>
  el.shadowRoot?.querySelector('clippy-button.wizard-validation-drawer__toggle');

const getDrawer = (el: WizardValidationDrawer): ClippyDrawer | null | undefined =>
  el.shadowRoot?.querySelector('clippy-drawer');

const getHeadings = (el: WizardValidationDrawer): Element[] =>
  Array.from(el.shadowRoot?.querySelectorAll('clippy-heading') ?? []);

const getMessages = (el: WizardValidationDrawer): Element[] =>
  Array.from(el.shadowRoot?.querySelectorAll('wizard-validation-message') ?? []);

const getText = (el: WizardValidationDrawer): string => (el.shadowRoot?.textContent ?? '').replace(/\s+/g, ' ').trim();

const hasNotification = (el: WizardValidationDrawer): boolean =>
  getToggle(el)?.classList.contains('wizard-validation-drawer__toggle--has-notification') ?? false;

const unexpectedUnitIssue = (path: string) => makeIssue(path, ERROR_CODES.UNEXPECTED_UNIT);

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('toggle button', () => {
    it('renders the toggle with the accessibility label', async () => {
      const { el } = await mount(makeTheme([]));
      expect(getToggle(el)).not.toBeNull();
      expect(getText(el)).toContain('Toon toegankelijkheidsmeldingen');
    });

    it('has no notification style or count when the theme has no issues', async () => {
      const { el } = await mount(makeTheme([]));
      expect(hasNotification(el)).toBe(false);
      expect(getText(el)).not.toContain('meldingen)');
    });

    it('shows the issue count as a notification when the theme has issues', async () => {
      const { el } = await mount(
        makeTheme([unexpectedUnitIssue('basis.line-height.md'), unexpectedUnitIssue('basis.line-height.sm')]),
      );
      expect(hasNotification(el)).toBe(true);
      expect(getText(el)).toContain('(2 meldingen)');
    });
  });

  describe('drawer content', () => {
    it('shows the success message and no issue groups when there are no issues', async () => {
      const { el } = await mount(makeTheme([]));
      expect(getText(el)).toContain('Goed bezig! Je thema ziet er goed uit.');
      expect(getHeadings(el)).toHaveLength(0);
      expect(getMessages(el)).toHaveLength(0);
    });

    it('groups issues under a heading with the localized label and count per error code', async () => {
      const { el } = await mount(
        makeTheme([
          unexpectedUnitIssue('basis.line-height.md'),
          unexpectedUnitIssue('basis.line-height.sm'),
          makeIssue('basis.text.font-size.sm', ERROR_CODES.FONT_SIZE_TOO_SMALL, { actual: '0.5rem', minimum: '1rem' }),
        ]),
      );

      const headings = getHeadings(el).map((heading) => (heading.textContent ?? '').replace(/\s+/g, ' ').trim());
      expect(headings).toEqual(['Onverwachte eenheid (2)', 'Lettergrootte te klein (1)']);
    });

    it('renders one wizard-validation-message per issue with the issue path', async () => {
      const { el } = await mount(
        makeTheme([unexpectedUnitIssue('basis.line-height.md'), unexpectedUnitIssue('basis.line-height.sm')]),
      );

      expect(getMessages(el).map((message) => message.getAttribute('path'))).toEqual([
        'basis.line-height.md',
        'basis.line-height.sm',
      ]);
    });

    it('renders the translated message inside each wizard-validation-message', async () => {
      const { el } = await mount(makeTheme([unexpectedUnitIssue('basis.line-height.md')]));

      await vi.waitFor(() => {
        const [message] = getMessages(el);
        expect((message?.shadowRoot?.textContent ?? '').replace(/\s+/g, ' ')).toContain(
          'Onverwachte eenheid. Gebruik alleen nummers.',
        );
      });
    });
  });

  describe('opening and closing', () => {
    it('opens the clippy drawer and expands the toggle when the toggle is clicked', async () => {
      const { el } = await mount(makeTheme([unexpectedUnitIssue('basis.line-height.md')]));
      const toggle = getToggle(el)!;
      const drawer = getDrawer(el)!;

      toggle.click();
      await el.updateComplete;

      expect(drawer.dialogElement.open).toBe(true);
      expect(toggle.expanded).toBe(true);
    });

    it('collapses the toggle when the drawer closes', async () => {
      const { el } = await mount(makeTheme([unexpectedUnitIssue('basis.line-height.md')]));
      const toggle = getToggle(el)!;
      const drawer = getDrawer(el)!;

      toggle.click();
      await el.updateComplete;
      expect(toggle.expanded).toBe(true);

      drawer.close();
      await vi.waitFor(() => expect(toggle.expanded).toBe(false));
      expect(drawer.dialogElement.open).toBe(false);
    });

    it('removes the drawer close listener when disconnected', async () => {
      const { el } = await mount(makeTheme([]));
      const drawer = getDrawer(el)!;
      const removeEventListenerSpy = vi.spyOn(drawer, 'removeEventListener');

      el.remove();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('close', expect.any(Function));
    });
  });

  describe('theme context updates', () => {
    it('updates when the provided theme gains issues', async () => {
      const { el, provider } = await mount(makeTheme([]));
      expect(hasNotification(el)).toBe(false);
      expect(getText(el)).toContain('Goed bezig! Je thema ziet er goed uit.');

      provider.setValue(makeTheme([unexpectedUnitIssue('basis.line-height.md')]));
      await vi.waitFor(() => expect(hasNotification(el)).toBe(true));

      expect(getText(el)).toContain('(1 meldingen)');
      expect(getText(el)).not.toContain('Goed bezig! Je thema ziet er goed uit.');
      expect(getHeadings(el).map((h) => (h.textContent ?? '').replace(/\s+/g, ' ').trim())).toEqual([
        'Onverwachte eenheid (1)',
      ]);
      expect(getMessages(el).map((m) => m.getAttribute('path'))).toEqual(['basis.line-height.md']);
    });

    it('updates when the provided theme loses all issues', async () => {
      const { el, provider } = await mount(makeTheme([unexpectedUnitIssue('basis.line-height.md')]));
      expect(hasNotification(el)).toBe(true);

      provider.setValue(makeTheme([]));
      await vi.waitFor(() => expect(hasNotification(el)).toBe(false));

      expect(getText(el)).toContain('Goed bezig! Je thema ziet er goed uit.');
      expect(getMessages(el)).toHaveLength(0);
    });
  });
});
