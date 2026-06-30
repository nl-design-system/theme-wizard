import { safeCustomElement } from '@nl-design-system-community/clippy-components/src/lib/decorators/index.js';
import { ColorSpace, HSL as HSLSpace, sRGB, parse, to } from 'colorjs.io/fn';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { t } from '../../i18n';

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

type HueKey =
  | 'blue'
  | 'cyan'
  | 'green'
  | 'indigo'
  | 'limeGreen'
  | 'magenta'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'red'
  | 'violet'
  | 'yellow';

type LightnessKey =
  | 'almostBlack'
  | 'almostWhite'
  | 'dark'
  | 'light'
  | 'medium'
  | 'slightlyDarker'
  | 'veryDark'
  | 'veryLight';

type SaturationKey =
  | 'almostGray'
  | 'dull'
  | 'fairlyBright'
  | 'fairlyDeep'
  | 'gray'
  | 'somewhatDull'
  | 'somewhatWashedOut'
  | 'veryBright'
  | 'veryDeep'
  | 'veryDull'
  | 'veryWashedOut'
  | 'washedOut';

function colorToHSL(colorString: string): HSL {
  const [rawHue, rawSaturation, rawLightness] = to(parse(colorString), 'hsl').coords;
  return {
    hue: rawHue !== null && !Number.isNaN(rawHue) ? Math.round(rawHue) : 0,
    lightness: Math.round(rawLightness ?? 0),
    saturation: Math.round(rawSaturation ?? 0),
  };
}

function hueKey(hue: number): HueKey | null {
  if ((hue >= 0 && hue <= 14) || hue >= 345) {
    return 'red';
  }
  if (hue === 15) {
    return null;
  }
  if (hue <= 45) {
    return 'orange';
  }
  if (hue <= 70) {
    return 'yellow';
  }
  if (hue <= 79) {
    return 'limeGreen';
  }
  if (hue <= 163) {
    return 'green';
  }
  if (hue <= 193) {
    return 'cyan';
  }
  if (hue <= 240) {
    return 'blue';
  }
  if (hue <= 260) {
    return 'indigo';
  }
  if (hue <= 270) {
    return 'violet';
  }
  if (hue <= 291) {
    return 'purple';
  }
  if (hue <= 326) {
    return 'magenta';
  }
  if (hue <= 344) {
    return 'pink';
  }
  return null;
}

function lightnessKey(lightness: number): LightnessKey {
  if (lightness <= 9) {
    return 'almostBlack';
  }
  if (lightness <= 22) {
    return 'veryDark';
  }
  if (lightness <= 30) {
    return 'dark';
  }
  if (lightness <= 60) {
    return 'medium';
  }
  if (lightness <= 80) {
    return 'light';
  }
  if (lightness <= 94) {
    return 'veryLight';
  }
  return 'almostWhite';
}

function saturationKeyDark(lightness: number, saturation: number): SaturationKey {
  if (saturation <= 3) {
    return 'gray';
  }
  if (saturation <= 10 && lightness > 9) {
    return 'almostGray';
  }
  if (saturation <= 30) {
    return 'veryDull';
  }
  if (saturation <= 46) {
    return 'dull';
  }
  if (saturation <= 60) {
    return 'somewhatDull';
  }
  if (saturation <= 80) {
    return 'fairlyDeep';
  }
  return 'veryDeep';
}

function saturationKeyLight(lightness: number, saturation: number): SaturationKey {
  if (saturation <= 3) {
    return 'gray';
  }
  if (saturation <= 10 && lightness > 9) {
    return 'almostGray';
  }
  if (saturation <= 30) {
    return 'veryWashedOut';
  }
  if (saturation <= 46) {
    return 'washedOut';
  }
  if (saturation <= 60) {
    return 'somewhatWashedOut';
  }
  if (saturation <= 80) {
    return 'fairlyBright';
  }
  return 'veryBright';
}

function saturationKey(lightness: number, saturation: number): SaturationKey {
  if (lightness >= 61) {
    return saturationKeyLight(lightness, saturation);
  } else {
    return saturationKeyDark(lightness, saturation);
  }
}

function resolveNamedColorKey(hue: number, lightness: number, saturation: number): string | null {
  if (hue === 0 && saturation === 100) {
    if (lightness === 0) {
      return 'black';
    }
    if (lightness === 25) {
      return 'maroon';
    }
    if (lightness === 50) {
      return 'red';
    }
    if (lightness === 100) {
      return 'white';
    }
  }
  if (hue === 60 && saturation === 100 && lightness === 25) {
    return 'oliveGreen';
  }
  if (hue === 240 && saturation === 100 && lightness === 25) {
    return 'navyBlue';
  }
  return null;
}

function describeAchromatic(lightness: number, translate: (key: string) => string): string {
  if (lightness === 0) {
    return translate('colorDescription.namedColors.black');
  }
  if (lightness === 100) {
    return translate('colorDescription.namedColors.white');
  }
  const resolvedLightnessKey = lightness >= 31 && lightness <= 60 ? 'slightlyDarker' : lightnessKey(lightness);
  const prefix =
    resolvedLightnessKey === 'medium' ? '' : translate(`colorDescription.lightness.${resolvedLightnessKey}`);
  return `${prefix}${translate('colorDescription.gray')}`.trim();
}

export function describeColor(colorString: string, translate: (key: string) => string): string {
  let hsl: HSL;
  try {
    hsl = colorToHSL(colorString);
  } catch {
    return '';
  }

  const { hue, lightness, saturation } = hsl;

  const namedColorKey = resolveNamedColorKey(hue, lightness, saturation);
  if (namedColorKey !== null) {
    return translate(`colorDescription.namedColors.${namedColorKey}`);
  }

  if (hue === 0 && saturation <= 1) {
    return describeAchromatic(lightness, translate);
  }

  const saturationText = translate(`colorDescription.saturation.${saturationKey(lightness, saturation)}`);

  const resolvedLightnessKey = lightnessKey(lightness);
  const lightnessText =
    resolvedLightnessKey === 'medium' ? '' : translate(`colorDescription.lightness.${resolvedLightnessKey}`);

  const resolvedHueKey = hueKey(hue);

  if (resolvedHueKey === null && saturation >= 46 && lightness >= 70) {
    return translate('colorDescription.namedColors.salmon');
  }

  const hueName = resolvedHueKey === null ? '' : translate(`colorDescription.hue.${resolvedHueKey}`);

  return `${saturationText} ${lightnessText}${hueName}`.replace(/\s+/g, ' ').trim();
}

/**
 * Web component that accepts a color attribute (CSS color) and shows a short description based on the color's characteristics
 *
 * @see https://www.200ok.nl/tips/kleurnamen/
 */
@safeCustomElement(tag)
export class WizardColorDescription extends LitElement {
  @property({ type: String })
  color = '';

  override render() {
    return html`${describeColor(this.color, (key) => t(key) as string)}`;
  }
}
