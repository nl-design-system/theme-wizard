import '@nl-design-system-community/clippy-components/clippy-token-combobox';
import {
  type ColorToken,
  type BaseDesignToken,
  EXTENSION_TOKEN_STAGED,
} from '@nl-design-system-community/design-tokens-schema';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { WizardFormColorscale } from '.';
import type Theme from '../../lib/Theme';
import type { StagedDesignToken } from '../../utils';
import { t } from '../../i18n';
import { INVERSE_SUFFIX } from '../../lib/ColorScale';
import { UPDATE_DESIGN_TOKENS_EVENT, type UpdateDesignTokensDetail } from '../../utils/events';

const tag = 'wizard-form-colorscale';

// Mock color tokens for testing
const createColorToken = (r: number, g: number, b: number): ColorToken => ({
  $type: 'color',
  $value: { alpha: 1, colorSpace: 'srgb', components: [r, g, b] },
});

const mockColorToken1 = createColorToken(0.8, 0.1, 0.1);

// Helper to create a mock Theme
const createMockTheme = (tokens: Record<string, unknown> = {}) => ({
  at: vi.fn((path: string) => {
    const result = tokens[path];
    return result !== undefined ? result : undefined;
  }),
  tokens,
});

// Helper to create mock scraped tokens with the required staged extension
const createStagedToken = (token: BaseDesignToken, path: string) =>
  ({
    ...token,
    $extensions: {
      [EXTENSION_TOKEN_STAGED]: true,
    },
    path,
  }) as unknown as StagedDesignToken;

const mount = async (
  path: string = '',
  profile: string = 'neutral',
  label: string = '',
  scrapedTokens: StagedDesignToken[] = [],
  themeTokens: Record<string, unknown> = {},
) => {
  const attrs = [path ? `path="${path}"` : '', profile ? `profile="${profile}"` : '', label ? `label="${label}"` : '']
    .filter(Boolean)
    .join(' ');

  document.body.innerHTML = `<${tag} ${attrs}></${tag}>`;
  const el = document.querySelector(tag) as WizardFormColorscale;

  // Mock the consumed contexts
  (el as unknown as { scrapedTokens: StagedDesignToken[] }).scrapedTokens = scrapedTokens;
  (el as unknown as { theme: Theme }).theme = createMockTheme(themeTokens) as unknown as Theme;

  await el.updateComplete;
  return el;
};

// Import after defining mocks to avoid circular issues
import '.';

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('registers itself as a custom element', () => {
    expect(customElements.get(tag)).toBeTruthy();
  });

  describe('properties', () => {
    it('has type property set to "color"', async () => {
      const el = await mount();
      expect(el.type).toBe('color');
    });

    it('tokenAt returns the token at the path', async () => {
      const tokenValue = { alpha: 1, colorSpace: 'srgb', components: [0.5, 0.5, 0.5] };
      const themeTokens = {
        'test.path': { $type: 'color', $value: tokenValue },
      };
      const el = await mount('test.path', 'neutral', '', [], themeTokens);
      expect(el.tokenAt).toEqual({ $type: 'color', $value: tokenValue });
    });

    it('tokens returns an array', async () => {
      const el = await mount();
      expect(Array.isArray(el.tokens)).toBe(true);
    });
  });

  describe('rendering', () => {
    it('renders a message when no recommendations are available', async () => {
      const themeTokens = {
        'test.path': { $type: 'color', $value: '{basis.color.accent-1}' },
      };
      const el = await mount('test.path', 'neutral', '', [], themeTokens);
      const paragraph = el.shadowRoot?.querySelector('.nl-paragraph') as HTMLElement;
      expect(paragraph).toBeTruthy();
      expect(paragraph?.textContent).toContain(t('wizard.stepForm.noRecommendations'));
    });

    it('renders a form with clippy-token-combobox', async () => {
      const stagedTokens = [createStagedToken(mockColorToken1, 'test.path.color-default')];
      const themeTokens = {
        'test.path': {
          $type: 'color',
          color: {
            default: mockColorToken1,
          },
        },
      };
      const el = await mount('test.path', 'neutral', '', stagedTokens, themeTokens);

      const form = el.shadowRoot?.querySelector('form');
      expect(form).toBeTruthy();

      const combobox = el.shadowRoot?.querySelector('clippy-token-combobox');
      expect(combobox).toBeTruthy();
    });

    it('uses the path as label when no label property is set', async () => {
      const stagedTokens = [createStagedToken(mockColorToken1, 'test.path.color-default')];
      const themeTokens = {
        'test.path': {
          $type: 'color',
          color: {
            default: mockColorToken1,
          },
        },
      };
      const el = await mount('test.path', 'neutral', '', stagedTokens, themeTokens);
      const labelSlot = el.shadowRoot?.querySelector('clippy-token-combobox [slot="label"]');
      expect(labelSlot?.textContent).toBe('test.path');
    });

    it('uses the label property when set', async () => {
      const stagedTokens = [createStagedToken(mockColorToken1, 'test.path.color-default')];
      const themeTokens = {
        'test.path': {
          $type: 'color',
          color: {
            default: mockColorToken1,
          },
        },
      };
      const el = await mount('test.path', 'neutral', 'Custom Label', stagedTokens, themeTokens);
      const labelSlot = el.shadowRoot?.querySelector('clippy-token-combobox [slot="label"]');
      expect(labelSlot?.textContent).toBe('Custom Label');
    });

    it('sets combobox name to the path', async () => {
      const stagedTokens = [createStagedToken(mockColorToken1, 'test.path.color-default')];
      const themeTokens = {
        'test.path': {
          $type: 'color',
          color: {
            default: mockColorToken1,
          },
        },
      };
      const el = await mount('test.path', 'neutral', '', stagedTokens, themeTokens);
      const combobox = el.shadowRoot?.querySelector('clippy-token-combobox');
      expect(combobox?.getAttribute('name')).toBe('test.path');
    });

    it('sets combobox type to color', async () => {
      const stagedTokens = [createStagedToken(mockColorToken1, 'test.path.color-default')];
      const themeTokens = {
        'test.path': {
          $type: 'color',
          color: {
            default: mockColorToken1,
          },
        },
      };
      const el = await mount('test.path', 'neutral', '', stagedTokens, themeTokens);
      const combobox = el.shadowRoot?.querySelector('clippy-token-combobox');
      expect(combobox?.getAttribute('type')).toBe('color');
    });
  });

  describe('seed color detection', () => {
    it('falls back to bg-default for inverse paths', async () => {
      const inversePath = `test.path${INVERSE_SUFFIX}`;
      const bgDefaultColor = createColorToken(0, 1, 0);
      const themeTokens = {
        [inversePath]: {
          $type: 'color',
          'bg-default': bgDefaultColor,
        },
      };

      const el = await mount(inversePath, 'neutral', '', [], themeTokens);
      await el.updateComplete;

      expect(el['selectedColorToken']).toEqual(bgDefaultColor);
    });

    it('falls back to color-default for regular paths', async () => {
      const path = 'test.path';
      const colorDefault = createColorToken(0, 0, 1);
      const themeTokens = {
        [path]: {
          $type: 'color',
          'color-default': colorDefault,
        },
      };

      const el = await mount(path, 'neutral', '', [], themeTokens);
      await el.updateComplete;

      expect(el['selectedColorToken']).toEqual(colorDefault);
    });
  });

  describe('form submission', () => {
    it('does not submit without a selected color token', async () => {
      const themeTokens = {
        'test.path': { $type: 'color', $value: '#ff0000' },
      };
      const el = await mount('test.path', 'neutral', '', [], themeTokens);

      let detail: UpdateDesignTokensDetail | undefined;
      el.addEventListener(UPDATE_DESIGN_TOKENS_EVENT, (event) => {
        detail = (event as CustomEvent<UpdateDesignTokensDetail>).detail;
      });

      const form = el.shadowRoot?.querySelector('form') as HTMLFormElement;
      form?.dispatchEvent(new SubmitEvent('submit', { cancelable: true }));

      expect(detail).toBeUndefined();
    });

    it('does not submit without a form element', async () => {
      const el = await mount('nonexistent-path', 'neutral', '', [], {});

      let detail: UpdateDesignTokensDetail | undefined;
      el.addEventListener(UPDATE_DESIGN_TOKENS_EVENT, (event) => {
        detail = (event as CustomEvent<UpdateDesignTokensDetail>).detail;
      });

      // No form in the shadow root for error state
      expect(detail).toBeUndefined();
    });

    it('dispatches update-design-tokens event with correct data on form submit', async () => {
      const stagedTokens = [createStagedToken(mockColorToken1, 'test.path.color-default')];
      const themeTokens = {
        'test.path': {
          $type: 'color',
          'color-default': mockColorToken1,
        },
      };
      const el = await mount('test.path', 'neutral', '', stagedTokens, themeTokens);

      // Set selected color token directly
      el['selectedColorToken'] = mockColorToken1;
      await el.updateComplete;

      let detail: UpdateDesignTokensDetail | undefined;
      el.addEventListener(UPDATE_DESIGN_TOKENS_EVENT, (event) => {
        detail = (event as CustomEvent<UpdateDesignTokensDetail>).detail;
      });

      const form = el.shadowRoot?.querySelector('form') as HTMLFormElement;
      form?.dispatchEvent(new SubmitEvent('submit', { cancelable: true }));

      await el.updateComplete;

      expect(detail).toBeDefined();
      expect(detail?.groupSeeds).toHaveLength(2);
      expect(detail?.groupSeeds?.[0]).toEqual({
        groupPath: 'test.path',
        seed: mockColorToken1.$value,
      });
      expect(detail?.groupSeeds?.[1]).toEqual({
        groupPath: 'test.path-inverse',
        seed: mockColorToken1.$value,
      });
    });
  });

  describe('path property', () => {
    it('defaults to empty string', async () => {
      const el = await mount();
      expect(el.path).toBe('');
    });

    it('can be set via attribute', async () => {
      const el = await mount('basis.color.accent-1', 'neutral');
      expect(el.path).toBe('basis.color.accent-1');
    });
  });

  describe('profile property', () => {
    it('defaults to neutral', async () => {
      const el = await mount();
      expect(el.profile).toBe('neutral');
    });

    it('can be set via attribute', async () => {
      const el = await mount('test.path', 'accent');
      expect(el.profile).toBe('accent');
    });
  });

  describe('label property', () => {
    it('defaults to empty string', async () => {
      const el = await mount();
      expect(el.label).toBe('');
    });

    it('can be set via attribute', async () => {
      const el = await mount('test.path', 'neutral', 'My Label');
      expect(el.label).toBe('My Label');
    });
  });
});
