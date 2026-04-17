import '.';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { WizardTokenPreset } from '.';

const tag = 'wizard-token-preset';

const optionA = {
  name: 'Optie A',
  description: 'Beschrijving A',
  tokens: { color: { primary: { $value: 'blue' } } },
};

const optionB = {
  name: 'Optie B',
  tokens: { color: { primary: { $value: 'red' } } },
};

const mount = async (overrides: Partial<WizardTokenPreset> = {}): Promise<WizardTokenPreset> => {
  document.body.innerHTML = `<${tag}></${tag}>`;
  const el = document.querySelector<WizardTokenPreset>(tag)!;
  Object.assign(el, overrides);
  await el.updateComplete;
  return el;
};

const getRadios = (el: WizardTokenPreset): HTMLInputElement[] =>
  Array.from(el.shadowRoot?.querySelectorAll('input[type="radio"]') ?? []);

const dispatchThemeUpdate = (
  tokens: Record<string, unknown>,
  defaults: Record<string, unknown> = structuredClone(tokens),
) => {
  const theme = {
    at: (path: string) =>
      path.split('.').reduce((obj: Record<string, unknown>, key) => obj?.[key] as Record<string, unknown>, tokens),
    defaults,
  };
  document.dispatchEvent(new CustomEvent('theme-update', { detail: { theme } }));
};

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('rendering', () => {
    it('renders a fieldset', async () => {
      const el = await mount();
      expect(el.shadowRoot?.querySelector('fieldset')).toBeTruthy();
    });

    it('renders a legend with default text', async () => {
      const el = await mount();
      const legend = el.shadowRoot?.querySelector('legend');
      expect(legend?.textContent?.trim()).toBe('Preset opties');
    });

    it('renders a legend with groupLabel when set', async () => {
      const el = await mount({ groupLabel: 'Kies een stijl' });
      const legend = el.shadowRoot?.querySelector('legend');
      expect(legend?.textContent?.trim()).toBe('Kies een stijl');
    });

    it('renders no radio buttons when options is empty', async () => {
      const el = await mount();
      expect(getRadios(el)).toHaveLength(0);
    });

    it('renders a radio button for each option', async () => {
      const el = await mount({ options: [optionA, optionB] });
      expect(getRadios(el)).toHaveLength(2);
    });

    it('renders option names', async () => {
      const el = await mount({ options: [optionA, optionB] });
      const titles = el.shadowRoot?.querySelectorAll('.wizard-token-preset__option-title');
      const names = Array.from(titles ?? []).map((t) => t.textContent?.trim());
      expect(names).toContain('Optie A');
      expect(names).toContain('Optie B');
    });

    it('renders option description when present', async () => {
      const el = await mount({ options: [optionA] });
      const description = el.shadowRoot?.querySelector('.wizard-token-preset__option-description');
      expect(description?.textContent?.trim()).toBe('Beschrijving A');
    });

    it('does not render description element when absent', async () => {
      const el = await mount({ options: [optionB] });
      const description = el.shadowRoot?.querySelector('.wizard-token-preset__option-description');
      expect(description).toBeNull();
    });

    it('all radio buttons share the same name attribute', async () => {
      const el = await mount({ options: [optionA, optionB] });
      const radios = getRadios(el);
      const names = radios.map((r) => r.getAttribute('name'));
      expect(new Set(names).size).toBe(1);
    });
  });

  describe('initial state', () => {
    it('selectedIndex is -1 by default', async () => {
      const el = await mount({ options: [optionA] });
      expect(el.selectedIndex).toBe(-1);
    });

    it('value returns empty object when nothing is selected', async () => {
      const el = await mount({ options: [optionA] });
      expect(el.value).toEqual({});
    });

    it('selectedOption returns null when nothing is selected', async () => {
      const el = await mount({ options: [optionA] });
      expect(el.selectedOption).toBeNull();
    });

    it('optionLabel returns empty string when nothing is selected', async () => {
      const el = await mount({ options: [optionA] });
      expect(el.optionLabel).toBe('');
    });

    it('previewStyle returns empty string when nothing is selected', async () => {
      const el = await mount({ options: [optionA] });
      expect(el.previewStyle).toBe('');
    });

    it('does not have selected attribute by default', async () => {
      const el = await mount({ options: [optionA] });
      expect(el.hasAttribute('selected')).toBe(false);
    });
  });

  describe('selectIndex()', () => {
    it('sets selectedIndex to the given index', async () => {
      const el = await mount({ options: [optionA, optionB] });
      el.selectIndex(1);
      expect(el.selectedIndex).toBe(1);
    });

    it('updates value to the tokens of the selected option', async () => {
      const el = await mount({ options: [optionA, optionB] });
      el.selectIndex(0);
      expect(el.value).toEqual(optionA.tokens);
    });

    it('updates optionLabel to the name of the selected option', async () => {
      const el = await mount({ options: [optionA, optionB] });
      el.selectIndex(0);
      expect(el.optionLabel).toBe('Optie A');
    });

    it('sets the selected attribute', async () => {
      const el = await mount({ options: [optionA] });
      el.selectIndex(0);
      expect(el.hasAttribute('selected')).toBe(true);
    });

    it('dispatches a change event', async () => {
      const el = await mount({ options: [optionA, optionB] });
      const handler = vi.fn();
      el.addEventListener('change', handler);
      el.selectIndex(1);
      expect(handler).toHaveBeenCalledOnce();
    });

    it('ignores negative indices', async () => {
      const el = await mount({ options: [optionA] });
      el.selectIndex(-1);
      expect(el.selectedIndex).toBe(-1);
    });

    it('ignores out-of-bounds indices', async () => {
      const el = await mount({ options: [optionA] });
      el.selectIndex(5);
      expect(el.selectedIndex).toBe(-1);
    });
  });

  describe('clearSelection()', () => {
    it('resets selectedIndex to -1', async () => {
      const el = await mount({ options: [optionA] });
      el.selectIndex(0);
      el.clearSelection();
      expect(el.selectedIndex).toBe(-1);
    });

    it('resets value to empty object', async () => {
      const el = await mount({ options: [optionA] });
      el.selectIndex(0);
      el.clearSelection();
      expect(el.value).toEqual({});
    });

    it('removes the selected attribute', async () => {
      const el = await mount({ options: [optionA] });
      el.selectIndex(0);
      el.clearSelection();
      expect(el.hasAttribute('selected')).toBe(false);
    });
  });

  describe('radio button interaction', () => {
    it('selecting a radio button updates selectedIndex', async () => {
      const el = await mount({ options: [optionA, optionB] });
      const radios = getRadios(el);
      radios[1].dispatchEvent(new Event('change', { bubbles: true }));
      expect(el.selectedIndex).toBe(1);
    });

    it('selecting a radio button dispatches a change event', async () => {
      const el = await mount({ options: [optionA, optionB] });
      const handler = vi.fn();
      el.addEventListener('change', handler);
      const radios = getRadios(el);
      radios[0].dispatchEvent(new Event('change', { bubbles: true }));
      expect(handler).toHaveBeenCalledOnce();
    });

    it('clicking the selected radio dispatches a change event again', async () => {
      const el = await mount({ options: [optionA, optionB] });
      const handler = vi.fn();
      el.addEventListener('change', handler);

      el.selectIndex(0);
      handler.mockClear();

      const radios = getRadios(el);
      radios[0].dispatchEvent(new Event('click', { bubbles: true }));

      expect(handler).toHaveBeenCalledOnce();
    });
  });

  describe('token details rendering', () => {
    it('does not render token details when no option is selected', async () => {
      const el = await mount({ options: [optionA] });
      expect(el.shadowRoot?.querySelector('.wizard-token-preset__option-values')).toBeNull();
    });

    it('renders token details for the selected option with a single token', async () => {
      const el = await mount({ options: [optionA] });
      el.selectIndex(0);
      await el.updateComplete;
      expect(el.shadowRoot?.querySelector('.wizard-token-preset__details')).toBeTruthy();
    });

    it('renders a details element for selected options with token values', async () => {
      const multiTokenOption = {
        name: 'Multi',
        tokens: {
          color: { primary: { $value: 'blue' }, secondary: { $value: 'green' } },
        },
      };
      const el = await mount({ options: [multiTokenOption] });
      el.selectIndex(0);
      await el.updateComplete;
      expect(el.shadowRoot?.querySelector('details')).toBeTruthy();
    });

    it('renders technical details only once for the currently selected option', async () => {
      const el = await mount({ options: [optionA, optionB] });
      el.selectIndex(1);
      await el.updateComplete;

      const summary = el.shadowRoot?.querySelector('.wizard-token-preset__details-summary');
      expect(summary?.textContent).toContain('Technische details van "Optie B"');
      expect(el.shadowRoot?.querySelectorAll('.wizard-token-preset__details')).toHaveLength(1);
    });

    it('renders intermediate and resolved steps for token reference chains', async () => {
      const chainOption = {
        name: 'Chain',
        tokens: {
          heading: {
            color: {
              $value: '{color.document}',
            },
          },
        },
      };
      const el = await mount({ options: [chainOption] });

      dispatchThemeUpdate({
        color: { document: { $value: '#000000' } },
        heading: {
          'base-color': { $value: '{color.document}' },
          color: { $value: '{heading.base-color}' },
        },
      });

      el.selectIndex(0);
      await el.updateComplete;

      const resolvedValues = Array.from(
        el.shadowRoot?.querySelectorAll('.wizard-token-preset__option-value-resolved') ?? [],
      ).map((node) => node.textContent?.trim());

      expect(resolvedValues).toContain('{heading.base-color}');
      expect(resolvedValues).toContain('#000000');
    });
  });

  describe('theme-update event', () => {
    it('selects the matching preset when theme-update fires', async () => {
      const el = await mount({ options: [optionA, optionB] });
      dispatchThemeUpdate({ color: { primary: { $value: 'red' } } });
      expect(el.selectedIndex).toBe(1);
    });

    it('sets defaultIndex to the matching option on initial theme-update', async () => {
      const el = await mount({ options: [optionA, optionB] });
      expect(el.defaultIndex).toBe(-1);

      dispatchThemeUpdate({ color: { primary: { $value: 'red' } } });
      await el.updateComplete;

      expect(el.defaultIndex).toBe(1);
    });

    it('renders the default pill on the matching option', async () => {
      const el = await mount({ options: [optionA, optionB] });
      dispatchThemeUpdate({ color: { primary: { $value: 'blue' } } });
      await el.updateComplete;

      const pills = el.shadowRoot?.querySelectorAll('.wizard-token-preset__option-default-pill') ?? [];
      expect(pills).toHaveLength(1);

      // The pill should be inside the first option (Optie A)
      const optionWithPill = pills[0]?.closest('.wizard-token-preset__option');
      const title = optionWithPill?.querySelector('.wizard-token-preset__option-title');
      expect(title?.textContent?.trim()).toBe('Optie A');
    });

    it('defaultIndex stays -1 when no option matches the theme', async () => {
      const el = await mount({ options: [optionA, optionB] });
      dispatchThemeUpdate({ color: { primary: { $value: 'green' } } });
      await el.updateComplete;

      expect(el.defaultIndex).toBe(-1);
      const pills = el.shadowRoot?.querySelectorAll('.wizard-token-preset__option-default-pill') ?? [];
      expect(pills).toHaveLength(0);
    });

    it('matches a preset when the theme value resolves to it through a reference chain', async () => {
      // Preset expects "final-value", but the theme has a reference that resolves to it
      const optionDirect = {
        name: 'Direct',
        tokens: { heading: { color: { $value: '{color.document}' } } },
      };
      const optionOther = {
        name: 'Other',
        tokens: { heading: { color: { $value: 'green' } } },
      };
      const el = await mount({ options: [optionDirect, optionOther] });

      // Theme has heading.color → {heading.base-color}, and heading.base-color → {color.document}
      // So heading.color resolves through the chain to {color.document}
      dispatchThemeUpdate({
        color: { document: { $value: '#000000' } },
        heading: {
          'base-color': { $value: '{color.document}' },
          color: { $value: '{heading.base-color}' },
        },
      });

      expect(el.selectedIndex).toBe(0);
    });

    it('sets defaultIndex through a reference chain', async () => {
      const optionResolved = {
        name: 'Resolved',
        tokens: { heading: { color: { $value: '{color.document}' } } },
      };
      const el = await mount({ options: [optionResolved] });

      dispatchThemeUpdate({
        color: { document: { $value: '#000000' } },
        heading: {
          'base-color': { $value: '{color.document}' },
          color: { $value: '{heading.base-color}' },
        },
      });
      await el.updateComplete;

      expect(el.defaultIndex).toBe(0);
    });

    it('clears selection when no preset matches the theme', async () => {
      const el = await mount({ options: [optionA, optionB] });
      el.selectIndex(0);
      dispatchThemeUpdate({ color: { primary: { $value: 'green' } } });
      expect(el.selectedIndex).toBe(-1);
    });

    it('does not listen for theme-update after disconnection', async () => {
      const el = await mount({ options: [optionA] });
      el.remove();
      dispatchThemeUpdate({ color: { primary: { $value: 'blue' } } });
      expect(el.selectedIndex).toBe(-1);
    });

    it('preserves the start-theme default option when the current theme changes', async () => {
      const el = await mount({ options: [optionA, optionB] });
      const startTheme = { color: { primary: { $value: 'blue' } } };
      dispatchThemeUpdate(startTheme);
      await el.updateComplete;
      expect(el.defaultIndex).toBe(0);

      dispatchThemeUpdate({ color: { primary: { $value: 'red' } } }, startTheme);
      await el.updateComplete;

      expect(el.selectedIndex).toBe(1);
      expect(el.defaultIndex).toBe(0);

      const defaultPills = Array.from(
        el.shadowRoot?.querySelectorAll('.wizard-token-preset__option-default-pill') ?? [],
      );
      expect(defaultPills).toHaveLength(1);
      expect(defaultPills[0]?.textContent?.trim()).toBe('start-theme');
      const optionTitles = Array.from(el.shadowRoot?.querySelectorAll('.wizard-token-preset__option-title') ?? []);
      expect(optionTitles[0]?.textContent?.trim()).toBe('Optie A');
    });
  });

  describe('previewStyle', () => {
    it('returns the previewStyle of the selected option', async () => {
      const optionWithStyle = { name: 'Stijl', previewStyle: 'background: red', tokens: {} };
      const el = await mount({ options: [optionWithStyle] });
      el.selectIndex(0);
      expect(el.previewStyle).toBe('background: red');
    });

    it('returns empty string when selected option has no previewStyle', async () => {
      const el = await mount({ options: [optionA] });
      el.selectIndex(0);
      expect(el.previewStyle).toBe('');
    });
  });
});
