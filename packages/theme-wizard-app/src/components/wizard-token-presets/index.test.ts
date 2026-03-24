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

const dispatchThemeUpdate = (tokens: Record<string, unknown>) => {
  const theme = {
    at: (path: string) =>
      path.split('.').reduce((obj: Record<string, unknown>, key) => obj?.[key] as Record<string, unknown>, tokens),
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
  });

  describe('matched option ordering', () => {
    it('renders the theme-matched option first in the list', async () => {
      const el = await mount({ options: [optionA, optionB] });
      dispatchThemeUpdate({ color: { primary: { $value: 'red' } } });
      await el.updateComplete;

      const titles = el.shadowRoot?.querySelectorAll('.wizard-token-preset__option-title');
      const names = Array.from(titles ?? []).map((title) => title.textContent?.trim());

      expect(names[0]).toBe('Optie B');
      expect(names[1]).toBe('Optie A');
    });

    it('does not move the clicked option to the top when the theme match stays the same', async () => {
      const el = await mount({ options: [optionA, optionB] });
      dispatchThemeUpdate({ color: { primary: { $value: 'red' } } });
      await el.updateComplete;

      el.selectIndex(0);
      await el.updateComplete;

      const titles = el.shadowRoot?.querySelectorAll('.wizard-token-preset__option-title');
      const names = Array.from(titles ?? []).map((title) => title.textContent?.trim());

      expect(names[0]).toBe('Optie B');
      expect(names[1]).toBe('Optie A');
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
      expect(el.shadowRoot?.querySelector('.wizard-token-preset__option-values')).toBeTruthy();
    });

    it('renders a details element for options with multiple tokens', async () => {
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
  });

  describe('theme-update event', () => {
    it('selects the matching preset when theme-update fires', async () => {
      const el = await mount({ options: [optionA, optionB] });
      dispatchThemeUpdate({ color: { primary: { $value: 'red' } } });
      expect(el.selectedIndex).toBe(1);
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
