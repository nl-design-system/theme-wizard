import './app';
import '../wizard-colorscale-input';
import '../wizard-token-combobox';
import '../wizard-token-input';
import '../wizard-token-presets';
import { parseColor } from '@nl-design-system-community/design-tokens-schema';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type Theme from '../../lib/Theme';
import type { WizardColorscaleInput } from '../wizard-colorscale-input';
import type { WizardTokenInput } from '../wizard-token-input';
import type { WizardTokenPreset } from '../wizard-token-presets';
import type { App } from './app';

const appTag = 'theme-wizard-app';
const presetTag = 'wizard-token-preset';
const getTheme = (app: App) => (app as App & { theme: Theme }).theme;
type PresetName = 'button' | 'dataBadge' | 'lead' | 'paragraph';
type PresetMap = Record<PresetName, WizardTokenPreset>;
type ThemeExpectations = {
  buttonBorderRadius: string;
  dataBadgeBorderRadius: string;
  leadFontSize: string;
  paragraphFontSize: string;
};

const createSelectedPreset = (options: WizardTokenPreset['options']) => {
  const preset = document.createElement(presetTag) as WizardTokenPreset;
  preset.setAttribute('selected', '');
  preset.options = options;
  return preset;
};

const selectPresetByName = (preset: WizardTokenPreset, name: string) => {
  const index = preset.options.findIndex((option) => option.name === name);

  if (index === -1) {
    throw new Error(`Preset option "${name}" not found`);
  }

  preset.selectIndex(index);
};

const selectPresetNames = (presets: PresetMap, names: Record<PresetName, string>) => {
  selectPresetByName(presets.button, names.button);
  selectPresetByName(presets.dataBadge, names.dataBadge);
  selectPresetByName(presets.lead, names.lead);
  selectPresetByName(presets.paragraph, names.paragraph);
};

const expectThemeValues = (app: App, expected: ThemeExpectations) => {
  expect(getTheme(app).at('nl.button.border-radius')?.$value).toBe(expected.buttonBorderRadius);
  expect(getTheme(app).at('nl.data-badge.border-radius')?.$value).toBe(expected.dataBadgeBorderRadius);
  expect(getTheme(app).at('nl.paragraph.font-size')?.$value).toBe(expected.paragraphFontSize);
  expect(getTheme(app).at('nl.paragraph.lead.font-size')?.$value).toBe(expected.leadFontSize);
};

const paragraphSizeOptions = [
  {
    name: 'Aanbevolen',
    tokens: {
      nl: {
        paragraph: {
          'font-size': { $value: '{basis.text.font-size.md}' },
        },
      },
    },
  },
  {
    name: 'Ruim',
    tokens: {
      nl: {
        paragraph: {
          'font-size': { $value: '{basis.text.font-size.lg}' },
        },
      },
    },
  },
];

const buttonShapeOptions = [
  {
    name: 'Licht hoekig',
    tokens: {
      nl: {
        button: {
          'border-radius': { $value: '{basis.border-radius.sm}' },
        },
      },
    },
  },
  {
    name: 'Licht afgerond',
    tokens: {
      nl: {
        button: {
          'border-radius': { $value: '{basis.border-radius.md}' },
        },
      },
    },
  },
];

const dataBadgeShapeOptions = [
  {
    name: 'Afgerond',
    tokens: {
      nl: {
        'data-badge': {
          'border-radius': { $value: '{basis.border-radius.md}' },
        },
      },
    },
  },
  {
    name: 'Rechthoekig',
    tokens: {
      nl: {
        'data-badge': {
          'border-radius': { $value: '0' },
        },
      },
    },
  },
];

const leadSizeOptions = [
  {
    name: 'Aanbevolen',
    tokens: {
      nl: {
        paragraph: {
          lead: {
            'font-size': { $value: '{basis.text.font-size.md}' },
          },
        },
      },
    },
  },
  {
    name: 'Ruim',
    tokens: {
      nl: {
        paragraph: {
          lead: {
            'font-size': { $value: '{basis.text.font-size.lg}' },
          },
        },
      },
    },
  },
];

const changedPresetNames: Record<PresetName, string> = {
  button: 'Licht afgerond',
  dataBadge: 'Rechthoekig',
  lead: 'Ruim',
  paragraph: 'Ruim',
};

const defaultPresetNames: Record<PresetName, string> = {
  button: 'Licht hoekig',
  dataBadge: 'Afgerond',
  lead: 'Aanbevolen',
  paragraph: 'Aanbevolen',
};

const mount = async (): Promise<{
  app: App;
  presets: PresetMap;
}> => {
  document.body.innerHTML = `<${appTag}></${appTag}>`;
  const app = document.querySelector<App>(appTag)!;

  const buttonPreset = createSelectedPreset(buttonShapeOptions);
  const dataBadgePreset = createSelectedPreset(dataBadgeShapeOptions);
  const paragraphPreset = createSelectedPreset(paragraphSizeOptions);
  const leadPreset = createSelectedPreset(leadSizeOptions);

  app.append(buttonPreset, dataBadgePreset, paragraphPreset, leadPreset);

  await Promise.all(
    [buttonPreset, dataBadgePreset, paragraphPreset, leadPreset].map((preset) => preset.updateComplete),
  );

  return {
    app,
    presets: {
      button: buttonPreset,
      dataBadge: dataBadgePreset,
      lead: leadPreset,
      paragraph: paragraphPreset,
    },
  };
};

const themeStorageKey = 'v0:theme-wizard:JSON:_';
const scrapedTokensStorageKey = 'v0:scraped-tokens:JSON:_';

describe(`<${appTag}> lifecycle`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('removes event listeners on disconnectedCallback', async () => {
    const { app } = await mount();
    const themeUpdateHandler = vi.fn();

    app.addEventListener('theme-update', themeUpdateHandler);

    app.remove();

    app.dispatchEvent(new Event('reset'));
    expect(themeUpdateHandler).not.toHaveBeenCalled();
  });

  it('logs a warning and skips update for unhandled change event targets', async () => {
    const { app } = await mount();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const div = document.createElement('div');
    app.appendChild(div);
    div.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

    expect(warnSpy).toHaveBeenCalledWith('Unhandled token change event target', div);
    warnSpy.mockRestore();
  });

  it('resets the theme and dispatches theme-update on reset event', async () => {
    const { app } = await mount();
    const themeUpdateHandler = vi.fn();
    app.addEventListener('theme-update', themeUpdateHandler);

    app.dispatchEvent(new Event('reset', { bubbles: false }));

    expect(getTheme(app).modified).toBe(false);
    expect(themeUpdateHandler).toHaveBeenCalled();
  });

  it('restores persisted theme tokens and scraped tokens on connect', async () => {
    localStorage.setItem(
      themeStorageKey,
      JSON.stringify({
        basis: {
          'border-radius': {
            sm: { $value: '0.25rem' },
          },
        },
      }),
    );
    localStorage.setItem(
      scrapedTokensStorageKey,
      JSON.stringify([
        {
          name: 'basis.color.document',
          $type: 'color',
          $value: '#000000',
        },
      ]),
    );

    const { app } = await mount();

    expect(getTheme(app).at('basis.border-radius.sm')?.$value).toBe('0.25rem');
    expect(app.scrapedTokens).toHaveLength(1);
  });

  it('ignores wizard-scraper-done events from non-scraper elements', async () => {
    const { app } = await mount();
    const scrapeSuccessHandler = vi.fn();
    const otherElement = document.createElement('div');

    app.addEventListener('scrape-success', scrapeSuccessHandler);
    app.appendChild(otherElement);
    otherElement.dispatchEvent(
      new CustomEvent('wizard-scraper-done', {
        bubbles: true,
        composed: true,
        detail: {
          result: [{ name: 'ignored-token' }],
        },
      }),
    );

    expect(scrapeSuccessHandler).not.toHaveBeenCalled();
    expect(app.scrapedTokens).toEqual([]);
  });
});

describe(`<${appTag}> preset updates`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('skips theme-update when a preset change does not change any values', async () => {
    const {
      app,
      presets: { button, dataBadge, lead, paragraph },
    } = await mount();
    const themeUpdateHandler = vi.fn();

    app.addEventListener('theme-update', themeUpdateHandler);

    selectPresetNames({ button, dataBadge, lead, paragraph }, changedPresetNames);

    expectThemeValues(app, {
      buttonBorderRadius: '{basis.border-radius.md}',
      dataBadgeBorderRadius: '0',
      leadFontSize: '{basis.text.font-size.lg}',
      paragraphFontSize: '{basis.text.font-size.lg}',
    });

    selectPresetNames({ button, dataBadge, lead, paragraph }, defaultPresetNames);
    themeUpdateHandler.mockClear();

    selectPresetByName(paragraph, 'Aanbevolen');

    expect(themeUpdateHandler).not.toHaveBeenCalled();
    expectThemeValues(app, {
      buttonBorderRadius: '{basis.border-radius.sm}',
      dataBadgeBorderRadius: '{basis.border-radius.md}',
      leadFontSize: '{basis.text.font-size.md}',
      paragraphFontSize: '{basis.text.font-size.md}',
    });
  });

  it('skips theme-update when a token input change does not change the current value', async () => {
    const { app } = await mount();
    const themeUpdateHandler = vi.fn();
    const input = document.createElement('wizard-token-input') as WizardTokenInput;

    app.addEventListener('theme-update', themeUpdateHandler);
    getTheme(app).updateAt('nl.paragraph.font-size', { value: 1, unit: 'rem' });

    input.name = 'nl.paragraph.font-size';
    input.value = { value: 1, unit: 'rem' };
    app.appendChild(input);
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

    expect(themeUpdateHandler).not.toHaveBeenCalled();
  });

  it('updates the theme when a token input change changes the value', async () => {
    const { app } = await mount();
    const themeUpdateHandler = vi.fn();
    const input = document.createElement('wizard-token-input') as WizardTokenInput;

    app.addEventListener('theme-update', themeUpdateHandler);

    input.name = 'nl.paragraph.font-size';
    input.value = { value: 1.25, unit: 'rem' };
    app.appendChild(input);
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

    expect(getTheme(app).at('nl.paragraph.font-size')?.$value).toEqual({ value: 1.25, unit: 'rem' });
    expect(themeUpdateHandler).toHaveBeenCalledOnce();
  });

  it('updates colorscale tokens when a colorscale input changes', async () => {
    const { app } = await mount();
    const themeUpdateHandler = vi.fn();
    const colorscale = document.createElement('wizard-colorscale-input') as WizardColorscaleInput;

    app.addEventListener('theme-update', themeUpdateHandler);

    colorscale.name = 'basis.color.accent-1';
    colorscale.value = {
      'color-dark': { $type: 'color', $value: parseColor('#222222') },
      'color-default': { $type: 'color', $value: parseColor('#111111') },
    };
    app.appendChild(colorscale);
    colorscale.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

    expect(getTheme(app).at('basis.color.accent-1.color-default')?.$value).toMatchObject({
      colorSpace: 'srgb',
    });
    expect(getTheme(app).at('basis.color.accent-1-inverse.color-default')?.$value).toMatchObject({
      colorSpace: 'srgb',
    });
    expect(themeUpdateHandler).toHaveBeenCalledOnce();
  });
});
