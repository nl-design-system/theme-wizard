import { ColorSpace, HSL as HSLSpace, sRGB, parse, to } from 'colorjs.io/fn';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

ColorSpace.register(sRGB);
ColorSpace.register(HSLSpace);

const tag = 'wizard-color-description';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardColorDescription;
  }
}

interface HSL {
  hue: number;
  lightness: number;
  saturation: number;
}

function colorToHSL(colorString: string): HSL {
  const [rawHue, rawSaturation, rawLightness] = to(parse(colorString), 'hsl').coords;
  return {
    hue: rawHue !== null && !Number.isNaN(rawHue) ? Math.round(rawHue) : 0,
    lightness: Math.round(rawLightness ?? 0),
    saturation: Math.round(rawSaturation ?? 0),
  };
}

function hueLabel(hue: number): string {
  if ((hue >= 0 && hue <= 14) || hue >= 345) {
    return 'rood';
  }
  if (hue === 15) {
    return '';
  }
  if (hue <= 45) {
    return 'oranje';
  }
  if (hue <= 70) {
    return 'geel';
  }
  if (hue <= 79) {
    return 'limoengroen';
  }
  if (hue <= 163) {
    return 'groen';
  }
  if (hue <= 193) {
    return 'cyaan';
  }
  if (hue <= 240) {
    return 'blauw';
  }
  if (hue <= 260) {
    return 'indigo';
  }
  if (hue <= 270) {
    return 'violet';
  }
  if (hue <= 291) {
    return 'paars';
  }
  if (hue <= 326) {
    return 'magenta';
  }
  if (hue <= 344) {
    return 'roze';
  }
  return '';
}

function lightnessLabel(lightness: number): string {
  if (lightness <= 9) {
    return 'bijna zwarte ';
  }
  if (lightness <= 22) {
    return 'heel donker ';
  }
  if (lightness <= 30) {
    return 'donker';
  }
  if (lightness <= 60) {
    return '';
  }
  if (lightness <= 80) {
    return 'licht';
  }
  if (lightness <= 94) {
    return 'heel licht ';
  }
  return 'bijna witte ';
}

function saturationLabel(lightness: number, lightnessText: string, saturation: number): string {
  let saturationText = '';

  if (saturation <= 3) {
    saturationText = 'grijze ';
  } else if (saturation <= 10 && lightnessText !== 'bijna zwarte ') {
    saturationText = 'bijna grijze ';
  } else if (saturation <= 30) {
    saturationText = 'erg doffe ';
  } else if (saturation <= 46) {
    saturationText = 'doffe ';
  } else if (saturation <= 60) {
    saturationText = 'enigszins doffe ';
  }

  if (lightness >= 61) {
    saturationText = saturationText.replace('doffe', 'fletse');
  }

  if (saturation >= 61 && saturation <= 80) {
    saturationText = 'tamelijk diepe ';
  } else if (saturation > 80) {
    saturationText = 'erg diepe ';
  }

  if (lightness >= 61) {
    saturationText = saturationText.replace('diepe', 'heldere');
  }

  return saturationText;
}

function resolveNamedColor(hue: number, lightness: number, saturation: number): string | null {
  if (hue === 0 && saturation === 100) {
    if (lightness === 0) {
      return 'zwart';
    }
    if (lightness === 25) {
      return 'kastanjebruin';
    }
    if (lightness === 50) {
      return 'rood';
    }
    if (lightness === 100) {
      return 'wit';
    }
  }
  if (hue === 60 && saturation === 100 && lightness === 25) {
    return 'olijfgroen';
  }
  if (hue === 240 && saturation === 100 && lightness === 25) {
    return 'marineblauw';
  }
  return null;
}

function resolveAchromatic(hue: number, lightness: number, lightnessText: string, saturation: number): string | null {
  if (hue !== 0 || saturation > 1) {
    return null;
  }
  if (lightness === 0) {
    return 'zwart';
  }
  if (lightness === 100) {
    return 'wit';
  }
  const prefix = lightness >= 31 && lightness <= 60 ? 'iets donkerder ' : lightnessText;
  return `${prefix}grijs`.trim();
}

export function describeColor(colorString: string): string {
  let hsl: HSL;
  try {
    hsl = colorToHSL(colorString);
  } catch {
    return '';
  }

  const { hue, lightness, saturation } = hsl;

  const namedColor = resolveNamedColor(hue, lightness, saturation);
  if (namedColor !== null) {
    return namedColor;
  }

  const lightnessText = lightnessLabel(lightness);

  const achromatic = resolveAchromatic(hue, lightness, lightnessText, saturation);
  if (achromatic !== null) {
    return achromatic;
  }

  const saturationText = saturationLabel(lightness, lightnessText, saturation);
  const hueName = hueLabel(hue);

  if (hueName === '' && saturation >= 46 && lightness >= 70) {
    return 'zalm';
  }

  return `${saturationText} ${lightnessText}${hueName}`.replace(/\s+/g, ' ').trim();
}

/**
 * Web component that accepts a color attribute (CSS color) and shows a short description based on the color's characteristics
 *
 * @see https://www.200ok.nl/tips/kleurnamen/
 */
@customElement(tag)
export class WizardColorDescription extends LitElement {
  @property({ type: String })
  color = '';

  override render() {
    return html`${describeColor(this.color)}`;
  }
}
