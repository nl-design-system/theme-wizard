import type { ClippyButton } from '@nl-design-system-community/clippy-components/clippy-button';
import type { ClippyDrawer } from '@nl-design-system-community/clippy-components/clippy-drawer';
import {
  ERROR_CODES,
  type ThemeValidationIssue,
  type TokenGroup,
} from '@nl-design-system-community/design-tokens-schema';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import '.';
import type Theme from '../../lib/Theme';
import type { WizardValidationMessage } from '../wizard-validation-message';
import { WizardValidationDrawer } from '.';
import i18n from '../../i18n';
import ValidationIssue, { groupValidationIssues } from '../../lib/ValidationIssue';

const tag = 'wizard-validation-drawer';

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

const contrastIssue = (path: string, tokens: [string, string]): ValidationIssue =>
  makeIssue(path, ERROR_CODES.INSUFFICIENT_CONTRAST, { actual: 3.5, minimum: 4.5, tokens });

const makeTheme = (issues: ValidationIssue[], tokens: TokenGroup = {}): Partial<Theme> => ({
  errorCount: issues.length,
  groupedIssues: groupValidationIssues(issues, tokens),
});

const mount = async (theme: Partial<Theme>): Promise<WizardValidationDrawer> => {
  const el = document.createElement(tag) as WizardValidationDrawer;
  (el as unknown as { theme: Theme }).theme = theme as Theme;
  document.body.append(el);
  await el.updateComplete;
  return el;
};

const setTheme = (el: WizardValidationDrawer, theme: Partial<Theme>) => {
  (el as unknown as { theme: Theme }).theme = theme as Theme;
};

const getToggle = (el: WizardValidationDrawer): ClippyButton => {
  const toggle = el.shadowRoot?.querySelector<ClippyButton>('clippy-button');
  if (!toggle) throw new Error('toggle button not found');
  return toggle;
};

const getDrawer = (el: WizardValidationDrawer): ClippyDrawer => {
  const drawer = el.shadowRoot?.querySelector<ClippyDrawer>('clippy-drawer');
  if (!drawer) throw new Error('clippy-drawer not found');
  return drawer;
};

const getDialog = (el: WizardValidationDrawer): HTMLDialogElement => {
  const dialog = getDrawer(el).shadowRoot?.querySelector('dialog');
  if (!dialog) throw new Error('dialog not found');
  return dialog;
};

const getToggleText = (el: WizardValidationDrawer): string => normalizeWhitespace(getToggle(el).textContent ?? '');

const getDrawerTitle = (el: WizardValidationDrawer): string =>
  normalizeWhitespace(getDrawer(el).querySelector('span[slot="title"]')?.textContent ?? '');

const getNoIssuesParagraph = (el: WizardValidationDrawer): HTMLParagraphElement | null =>
  getDrawer(el).querySelector('p.nl-paragraph');

const getHeadings = (el: WizardValidationDrawer): string[] =>
  [...(el.shadowRoot?.querySelectorAll('clippy-heading') ?? [])].map((heading) =>
    normalizeWhitespace(heading.textContent ?? ''),
  );

const getMessages = (el: WizardValidationDrawer): WizardValidationMessage[] =>
  [...(el.shadowRoot?.querySelectorAll('wizard-validation-message') ?? [])] as WizardValidationMessage[];

const hasNotificationClass = (el: WizardValidationDrawer): boolean =>
  getToggle(el).classList.contains('wizard-validation-drawer__toggle--has-notification');

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    i18n.locale('nl');
  });

  it('registers itself as a custom element', () => {
    expect(customElements.get(tag)).toBeTruthy();
  });

  describe('toggle button', () => {
    it('renders the translated toggle label without a count when there are no issues', async () => {
      const el = await mount(makeTheme([]));
      expect(getToggleText(el)).toBe('Toon toegankelijkheidsmeldingen');
    });

    it('includes the number of issue groups in the toggle label', async () => {
      const el = await mount(
        makeTheme([
          makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT),
          makeIssue('basis.text.font-size.sm', ERROR_CODES.FONT_SIZE_TOO_SMALL, { actual: '0.5rem', minimum: '1rem' }),
          makeIssue('basis.text.font-size.xs', ERROR_CODES.FONT_SIZE_TOO_SMALL, { actual: '0.4rem', minimum: '1rem' }),
        ]),
      );

      // Two groups: one unexpected_unit group and one font_size_too_small group with both issues merged
      expect(getToggleText(el)).toBe('Toon toegankelijkheidsmeldingen (2 meldingen)');
    });

    it('does not show the notification indicator when there are no errors', async () => {
      const el = await mount(makeTheme([]));
      expect(hasNotificationClass(el)).toBe(false);
    });

    it('shows the notification indicator when there are errors', async () => {
      const el = await mount(makeTheme([makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)]));
      expect(hasNotificationClass(el)).toBe(true);
    });

    it('is not expanded initially', async () => {
      const el = await mount(makeTheme([]));
      expect(getToggle(el).expanded).toBe(false);
    });
  });

  describe('drawer content', () => {
    it('renders the drawer title', async () => {
      const el = await mount(makeTheme([]));
      expect(getDrawerTitle(el)).toBe('Fouten, waarschuwingen of tips');
    });

    it('shows the no-issues message and no issue groups when the theme has no errors', async () => {
      const el = await mount(makeTheme([]));

      expect(normalizeWhitespace(getNoIssuesParagraph(el)?.textContent ?? '')).toBe(
        'Goed bezig! Je thema ziet er goed uit.',
      );
      expect(getHeadings(el)).toHaveLength(0);
      expect(getMessages(el)).toHaveLength(0);
    });

    it('hides the no-issues message when the theme has errors', async () => {
      const el = await mount(makeTheme([makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)]));
      expect(getNoIssuesParagraph(el)).toBeNull();
    });

    it('renders one heading per error code with the translated label and group count', async () => {
      const el = await mount(
        makeTheme([
          makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT),
          makeIssue('basis.text.font-size.sm', ERROR_CODES.FONT_SIZE_TOO_SMALL, { actual: '0.5rem', minimum: '1rem' }),
        ]),
      );

      const headings = getHeadings(el);
      expect(headings).toHaveLength(2);
      expect(headings).toEqual(expect.arrayContaining(['Onverwachte eenheid (1)', 'Lettergrootte te klein (1)']));
    });

    it('renders a single validation message without details for a group with one issue', async () => {
      const el = await mount(makeTheme([makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)]));

      const messages = getMessages(el);
      expect(messages).toHaveLength(1);
      expect(messages[0].issue?.path).toBe('basis.line-height.md');
      expect(el.shadowRoot?.querySelector('details')).toBeNull();

      await messages[0].updateComplete;
      expect(normalizeWhitespace(messages[0].shadowRoot?.textContent ?? '')).toContain('basis.line-height.md');
    });

    it('renders the representative issue and a details section for a group with multiple issues', async () => {
      const el = await mount(
        makeTheme([
          makeIssue('basis.text.font-size.sm', ERROR_CODES.FONT_SIZE_TOO_SMALL, { actual: '0.5rem', minimum: '1rem' }),
          makeIssue('basis.text.font-size.xs', ERROR_CODES.FONT_SIZE_TOO_SMALL, { actual: '0.4rem', minimum: '1rem' }),
        ]),
      );

      const details = el.shadowRoot?.querySelector('details');
      expect(details).not.toBeNull();
      // The representative is rendered above the details, so the summary counts only the rest
      expect(normalizeWhitespace(details?.querySelector('summary')?.textContent ?? '')).toBe('1 gerelateerde fout');

      const messages = getMessages(el);
      // 1 representative message + 1 message per remaining issue inside the details section
      expect(messages).toHaveLength(2);
      expect(messages[0].issue?.path).toBe('basis.text.font-size.sm');

      const detailsMessages = [
        ...(details?.querySelectorAll('wizard-validation-message') ?? []),
      ] as WizardValidationMessage[];
      expect(detailsMessages.map((message) => message.issue?.path)).toEqual(['basis.text.font-size.xs']);
    });

    it('collapses a failing contrast pair into a single group with one message', async () => {
      const color = 'basis.color.default.color-default';
      const background = 'basis.color.default.bg-default';
      const el = await mount(
        makeTheme([contrastIssue(color, [color, background]), contrastIssue(background, [background, color])]),
      );

      expect(getHeadings(el)).toEqual(['Onvoldoende contrast (1)']);

      // The issue on the referred token is the opposite of the first issue and is removed,
      // so the group holds a single issue and renders without a details section
      expect(el.shadowRoot?.querySelector('details')).toBeNull();
      const messages = getMessages(el);
      expect(messages).toHaveLength(1);
      expect(messages[0].issue?.path).toBe(color);
    });

    it('counts multiple groups with the same error code in the heading and the toggle label', async () => {
      const el = await mount(
        makeTheme([
          contrastIssue('basis.color.a.color', ['basis.color.a.color', 'basis.color.a.bg']),
          contrastIssue('basis.color.a.bg', ['basis.color.a.bg', 'basis.color.a.color']),
          contrastIssue('basis.color.b.color', ['basis.color.b.color', 'basis.color.b.bg']),
          contrastIssue('basis.color.b.bg', ['basis.color.b.bg', 'basis.color.b.color']),
        ]),
      );

      expect(getHeadings(el)).toEqual(['Onvoldoende contrast (2)']);
      // Each pair collapses to its first issue, so no group has a details section anymore
      expect(el.shadowRoot?.querySelectorAll('details')).toHaveLength(0);
      expect(getMessages(el)).toHaveLength(2);
      expect(getToggleText(el)).toBe('Toon toegankelijkheidsmeldingen (2 meldingen)');
    });
  });

  describe('open and close behavior', () => {
    it('opens the drawer and expands the toggle when the toggle is clicked', async () => {
      const el = await mount(makeTheme([makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)]));
      expect(getDialog(el).open).toBe(false);
      expect(getToggle(el).expanded).toBe(false);

      getToggle(el).click();
      await el.updateComplete;

      expect(getDialog(el).open).toBe(true);
      expect(getToggle(el).expanded).toBe(true);
    });

    it('collapses the toggle when the drawer emits a close event', async () => {
      const el = await mount(makeTheme([makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)]));
      getToggle(el).click();
      await el.updateComplete;
      expect(getToggle(el).expanded).toBe(true);

      getDrawer(el).dispatchEvent(new Event('close'));
      await el.updateComplete;

      expect(getToggle(el).expanded).toBe(false);
    });

    it('resets the toggle when the drawer dialog is closed', async () => {
      const el = await mount(makeTheme([makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)]));
      getToggle(el).click();
      await el.updateComplete;

      getDrawer(el).close();
      // The native dialog fires its close event as a task, which clippy-drawer re-dispatches
      await new Promise((resolve) => setTimeout(resolve, 0));
      await el.updateComplete;

      expect(getDialog(el).open).toBe(false);
      expect(getToggle(el).expanded).toBe(false);
    });
  });

  describe('reactivity', () => {
    it('updates the rendered issues when the theme gains errors', async () => {
      const el = await mount(makeTheme([]));
      expect(getNoIssuesParagraph(el)).not.toBeNull();
      expect(getToggleText(el)).toBe('Toon toegankelijkheidsmeldingen');
      expect(hasNotificationClass(el)).toBe(false);

      setTheme(el, makeTheme([makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)]));
      await el.updateComplete;

      expect(getNoIssuesParagraph(el)).toBeNull();
      expect(getHeadings(el)).toEqual(['Onverwachte eenheid (1)']);
      expect(getMessages(el)).toHaveLength(1);
      expect(getToggleText(el)).toBe('Toon toegankelijkheidsmeldingen (1 meldingen)');
      expect(hasNotificationClass(el)).toBe(true);
    });

    it('updates back to the no-issues state when the errors are resolved', async () => {
      const el = await mount(makeTheme([makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT)]));
      expect(getNoIssuesParagraph(el)).toBeNull();
      expect(getHeadings(el)).toHaveLength(1);

      setTheme(el, makeTheme([]));
      await el.updateComplete;

      expect(normalizeWhitespace(getNoIssuesParagraph(el)?.textContent ?? '')).toBe(
        'Goed bezig! Je thema ziet er goed uit.',
      );
      expect(getHeadings(el)).toHaveLength(0);
      expect(getMessages(el)).toHaveLength(0);
      expect(getToggleText(el)).toBe('Toon toegankelijkheidsmeldingen');
      expect(hasNotificationClass(el)).toBe(false);
    });
  });

  describe('English locale', () => {
    beforeEach(() => {
      i18n.locale('en');
    });

    it('renders the English toggle label without a count when there are no issues', async () => {
      const el = await mount(makeTheme([]));
      expect(getToggleText(el)).toBe('Show accessibility notifications');
      expect(normalizeWhitespace(getNoIssuesParagraph(el)?.textContent ?? '')).toBe(
        'Well done! Your theme looks good.',
      );
    });

    it('renders English title, headings, toggle count and affected-token count', async () => {
      const el = await mount(
        makeTheme([
          makeIssue('basis.line-height.md', ERROR_CODES.UNEXPECTED_UNIT),
          makeIssue('basis.text.font-size.sm', ERROR_CODES.FONT_SIZE_TOO_SMALL, { actual: '0.5rem', minimum: '1rem' }),
          makeIssue('basis.text.font-size.xs', ERROR_CODES.FONT_SIZE_TOO_SMALL, { actual: '0.4rem', minimum: '1rem' }),
        ]),
      );

      expect(getToggleText(el)).toBe('Show accessibility notifications (2 notifications)');
      expect(getDrawerTitle(el)).toBe('Errors, warnings or tips');

      const headings = getHeadings(el);
      expect(headings).toHaveLength(2);
      expect(headings).toEqual(expect.arrayContaining(['Unexpected unit. (1)', 'Font size too small (1)']));

      const summary = el.shadowRoot?.querySelector('details summary');
      expect(normalizeWhitespace(summary?.textContent ?? '')).toBe('1 related issue');
    });
  });
});
