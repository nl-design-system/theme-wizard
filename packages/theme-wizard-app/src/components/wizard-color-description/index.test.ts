import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WizardColorDescription, describeColor } from '.';
import i18n from '../../i18n';

const translations: Record<string, string> = {
  'colorDescription.gray': 'grijs',
  'colorDescription.hue.blue': 'blauw',
  'colorDescription.hue.cyan': 'cyaan',
  'colorDescription.hue.green': 'groen',
  'colorDescription.hue.indigo': 'indigo',
  'colorDescription.hue.limeGreen': 'limoengroen',
  'colorDescription.hue.magenta': 'magenta',
  'colorDescription.hue.orange': 'oranje',
  'colorDescription.hue.pink': 'roze',
  'colorDescription.hue.purple': 'paars',
  'colorDescription.hue.red': 'rood',
  'colorDescription.hue.violet': 'violet',
  'colorDescription.hue.yellow': 'geel',
  'colorDescription.lightness.almostBlack': 'bijna zwarte ',
  'colorDescription.lightness.almostWhite': 'bijna witte ',
  'colorDescription.lightness.dark': 'donker',
  'colorDescription.lightness.light': 'licht',
  'colorDescription.lightness.medium': '',
  'colorDescription.lightness.slightlyDarker': 'iets donkerder ',
  'colorDescription.lightness.veryDark': 'heel donker ',
  'colorDescription.lightness.veryLight': 'heel licht ',
  'colorDescription.namedColors.black': 'zwart',
  'colorDescription.namedColors.maroon': 'kastanjebruin',
  'colorDescription.namedColors.navyBlue': 'marineblauw',
  'colorDescription.namedColors.oliveGreen': 'olijfgroen',
  'colorDescription.namedColors.red': 'rood',
  'colorDescription.namedColors.salmon': 'zalm',
  'colorDescription.namedColors.white': 'wit',
  'colorDescription.saturation.almostGray': 'bijna grijze ',
  'colorDescription.saturation.dull': 'doffe ',
  'colorDescription.saturation.fairlyBright': 'tamelijk heldere ',
  'colorDescription.saturation.fairlyDeep': 'tamelijk diepe ',
  'colorDescription.saturation.gray': 'grijze ',
  'colorDescription.saturation.somewhatDull': 'enigszins doffe ',
  'colorDescription.saturation.somewhatWashedOut': 'enigszins fletse ',
  'colorDescription.saturation.veryBright': 'erg heldere ',
  'colorDescription.saturation.veryDeep': 'erg diepe ',
  'colorDescription.saturation.veryDull': 'erg doffe ',
  'colorDescription.saturation.veryWashedOut': 'erg fletse ',
  'colorDescription.saturation.washedOut': 'fletse ',
};

function translate(key: string): string {
  return translations[key] ?? key;
}

describe('describeColor', () => {
  describe('CSS named colors', () => {
    it('recognises red as a named color', () => {
      expect(describeColor('red', translate)).toBe('rood');
    });

    it('recognises white as a named color', () => {
      expect(describeColor('white', translate)).toBe('wit');
    });

    it('recognises black as a named color', () => {
      expect(describeColor('black', translate)).toBe('zwart');
    });

    it('recognises maroon as a named color', () => {
      expect(describeColor('maroon', translate)).toBe('kastanjebruin');
    });

    it('recognises navy as a named color', () => {
      expect(describeColor('navy', translate)).toBe('marineblauw');
    });

    it('recognises olive as a named color', () => {
      expect(describeColor('olive', translate)).toBe('olijfgroen');
    });

    it('describes blue using saturation and hue', () => {
      expect(describeColor('blue', translate)).toBe('erg diepe blauw');
    });

    it('describes green using saturation, lightness and hue', () => {
      expect(describeColor('green', translate)).toBe('erg diepe donkergroen');
    });

    it('describes gray as slightly darker gray', () => {
      expect(describeColor('gray', translate)).toBe('iets donkerder grijs');
    });

    it('describes coral as a vivid light orange', () => {
      expect(describeColor('coral', translate)).toBe('erg heldere lichtoranje');
    });
  });

  describe('hex colors', () => {
    it('describes #ff0000 the same as CSS red', () => {
      expect(describeColor('#ff0000', translate)).toBe('rood');
    });

    it('describes #ffffff as white', () => {
      expect(describeColor('#ffffff', translate)).toBe('wit');
    });

    it('describes #000000 as black', () => {
      expect(describeColor('#000000', translate)).toBe('zwart');
    });

    it('describes #0000ff using saturation and hue', () => {
      expect(describeColor('#0000ff', translate)).toBe('erg diepe blauw');
    });

    it('describes #808080 as slightly darker gray', () => {
      expect(describeColor('#808080', translate)).toBe('iets donkerder grijs');
    });

    it('describes #ff6600 as a very deep orange', () => {
      expect(describeColor('#ff6600', translate)).toBe('erg diepe oranje');
    });
  });

  describe('rgb() colors', () => {
    it('describes rgb(255, 0, 0) the same as CSS red', () => {
      expect(describeColor('rgb(255, 0, 0)', translate)).toBe('rood');
    });

    it('describes rgb(0, 0, 255) using saturation and hue', () => {
      expect(describeColor('rgb(0, 0, 255)', translate)).toBe('erg diepe blauw');
    });

    it('describes rgb(128, 128, 128) as slightly darker gray', () => {
      expect(describeColor('rgb(128, 128, 128)', translate)).toBe('iets donkerder grijs');
    });
  });

  describe('hsl() colors', () => {
    it('describes a muted light blue', () => {
      expect(describeColor('hsl(200, 50%, 75%)', translate)).toBe('enigszins fletse lichtblauw');
    });

    it('describes a vivid pure green', () => {
      expect(describeColor('hsl(120, 100%, 50%)', translate)).toBe('erg diepe groen');
    });

    it('describes a fairly deep dark orange', () => {
      expect(describeColor('hsl(30, 70%, 20%)', translate)).toBe('tamelijk diepe heel donker oranje');
    });

    it('describes a somewhat dull violet', () => {
      expect(describeColor('hsl(270, 50%, 50%)', translate)).toBe('enigszins doffe violet');
    });

    it('describes achromatic hsl(0, 0%, 50%) as slightly darker gray', () => {
      expect(describeColor('hsl(0, 0%, 50%)', translate)).toBe('iets donkerder grijs');
    });

    it('describes hsl(0, 0%, 0%) as black', () => {
      expect(describeColor('hsl(0, 0%, 0%)', translate)).toBe('zwart');
    });

    it('describes hsl(0, 0%, 100%) as white', () => {
      expect(describeColor('hsl(0, 0%, 100%)', translate)).toBe('wit');
    });

    it('describes hsl(0, 0%, 10%) as very dark gray', () => {
      expect(describeColor('hsl(0, 0%, 10%)', translate)).toBe('heel donker grijs');
    });

    it('describes hsl(0, 0%, 90%) as very light gray', () => {
      expect(describeColor('hsl(0, 0%, 90%)', translate)).toBe('heel licht grijs');
    });
  });

  describe('transparent and alpha colors', () => {
    it('describes transparent as black because the alpha channel is ignored', () => {
      expect(describeColor('transparent', translate)).toBe('zwart');
    });

    it('describes rgba(0, 0, 0, 0) as black because the alpha channel is ignored', () => {
      expect(describeColor('rgba(0, 0, 0, 0)', translate)).toBe('zwart');
    });

    it('describes rgba(255, 0, 0, 0.5) the same as CSS red because the alpha channel is ignored', () => {
      expect(describeColor('rgba(255, 0, 0, 0.5)', translate)).toBe('rood');
    });
  });

  describe('invalid colors', () => {
    it('returns an empty string for an empty string', () => {
      expect(describeColor('', translate)).toBe('');
    });

    it('returns an empty string for a non-color string', () => {
      expect(describeColor('notacolor', translate)).toBe('');
    });

    it('returns an empty string for an invalid hex code', () => {
      expect(describeColor('#xyz123', translate)).toBe('');
    });
  });

  describe('hue edge cases', () => {
    it('describes hsl(15, 50%, 80%) as salmon because hue 15 has no color name but saturation and lightness match', () => {
      expect(describeColor('hsl(15, 50%, 80%)', translate)).toBe('zalm');
    });

    it('describes hsl(345, 80%, 50%) as red because hue 345 wraps back to red', () => {
      expect(describeColor('hsl(345, 80%, 50%)', translate)).toBe('tamelijk diepe rood');
    });

    it('describes hsl(0, 100%, 25%) as maroon as a named color', () => {
      expect(describeColor('hsl(0, 100%, 25%)', translate)).toBe('kastanjebruin');
    });
  });
});

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
