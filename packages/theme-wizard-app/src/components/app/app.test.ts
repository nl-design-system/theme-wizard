import './app';
import '../wizard-token-presets';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type Theme from '../../lib/Theme';
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
});
