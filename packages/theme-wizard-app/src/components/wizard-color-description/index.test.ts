import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WizardColorDescription } from '.';
import i18n from '../../i18n';

const tag = 'wizard-color-description';

const mount = async (color?: string): Promise<WizardColorDescription> => {
  document.body.innerHTML = `<${tag}></${tag}>`;
  const el = document.querySelector<WizardColorDescription>(tag)!;
  if (color !== undefined) {
    el.color = color;
  }
  await el.updateComplete;
  return el;
};

const getText = (el: WizardColorDescription): string => el.shadowRoot?.textContent?.trim() ?? '';

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('default state', () => {
    it('renders nothing when no color is set', async () => {
      const el = await mount();
      expect(getText(el)).toBe('');
    });
  });

  describe('color property', () => {
    it('renders a Dutch description for a CSS named color', async () => {
      const el = await mount('red');
      expect(getText(el)).toBe('rood');
    });

    it('renders a Dutch description for a hex color', async () => {
      const el = await mount('#0000ff');
      expect(getText(el)).toBe('erg diepe blauw');
    });

    it('renders a Dutch description for an rgb() color', async () => {
      const el = await mount('rgb(255, 0, 0)');
      expect(getText(el)).toBe('rood');
    });

    it('renders a Dutch description for an hsl() color', async () => {
      const el = await mount('hsl(120, 100%, 50%)');
      expect(getText(el)).toBe('erg diepe groen');
    });

    it('renders nothing for an invalid color', async () => {
      const el = await mount('notacolor');
      expect(getText(el)).toBe('');
    });

    it('renders nothing for an empty string', async () => {
      const el = await mount('');
      expect(getText(el)).toBe('');
    });
  });

  describe('color attribute', () => {
    it('renders a Dutch description when the color attribute is set via HTML', async () => {
      document.body.innerHTML = `<${tag} color="navy"></${tag}>`;
      const el = document.querySelector<WizardColorDescription>(tag)!;
      await el.updateComplete;
      expect(getText(el)).toBe('marineblauw');
    });
  });

  describe('reactivity', () => {
    it('updates the description when the color property changes', async () => {
      const el = await mount('red');
      expect(getText(el)).toBe('rood');

      el.color = 'white';
      await el.updateComplete;
      expect(getText(el)).toBe('wit');
    });

    it('clears the description when color is changed to an invalid value', async () => {
      const el = await mount('red');
      expect(getText(el)).toBe('rood');

      el.color = 'notacolor';
      await el.updateComplete;
      expect(getText(el)).toBe('');
    });
  });

  describe('English locale', () => {
    beforeEach(() => {
      i18n.locale('en');
    });

    afterEach(() => {
      i18n.locale('nl');
    });

    it('renders an English description for a CSS named color', async () => {
      const el = await mount('red');
      expect(getText(el)).toBe('red');
    });

    it('renders an English description for a named special color', async () => {
      const el = await mount('navy');
      expect(getText(el)).toBe('navy blue');
    });

    it('renders an English description for a hex color', async () => {
      const el = await mount('#0000ff');
      expect(getText(el)).toBe('very deep blue');
    });

    it('renders an English description for an hsl() color', async () => {
      const el = await mount('hsl(120, 100%, 50%)');
      expect(getText(el)).toBe('very deep green');
    });
  });
});
