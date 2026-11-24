import {
  type BaseDesignToken,
  stringifyToken,
  type TokenGroup,
} from '@nl-design-system-community/design-tokens-schema';
import { stringifyTokenValue } from '@src/lib/tokens';
import dlv from 'dlv';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { themeFixture } from './fixtures';
import './index';
import { ClippyTokenGroupTable } from './index';

const tag = 'clippy-token-group-table';

const theme: TokenGroup = {
  basis: {
    color: {
      'accent-1': {
        'bg-default': { $type: 'color', $value: '#ff0000' },
        'bg-subtle': { $type: 'color', $value: '{basis.color.accent-1.bg-default}' },
      },
    },
  },
} as unknown as TokenGroup;

const labels: Array<[string, string]> = [
  ['example-label', 'Example'],
  ['name-label', 'Name'],
  ['value-label', 'Value'],
  ['actions-label', 'Actions'],
];

const render = async (attributes = 'path="basis.color"', tokens: TokenGroup | null | undefined = theme) => {
  document.body.innerHTML = `<${tag} ${attributes}></${tag}>`;
  const component = document.querySelector(tag) as ClippyTokenGroupTable;
  component.theme = tokens;
  await component.updateComplete;
  return component;
};

const firstToken: BaseDesignToken = dlv(theme, 'basis.color.accent-1.bg-default');

const getRows = (component: ClippyTokenGroupTable) =>
  Array.from(component.shadowRoot?.querySelectorAll<HTMLTableRowElement>('tbody tr') ?? []);

describe(`<${tag}>`, () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    let component: ClippyTokenGroupTable;

    beforeEach(async () => {
      component = await render();
    });

    it('renders a table', () => {
      expect(component.shadowRoot?.querySelector('table')).toBeTruthy();
    });

    it('uses the path as caption', () => {
      expect(component.shadowRoot?.querySelector('caption')?.textContent?.trim()).toBe('basis.color');
    });

    it('renders a group row with the joined path for nested groups', () => {
      const groupRow = component.shadowRoot?.querySelector('.clippy-token-group-table__group-row');
      expect(groupRow?.textContent?.trim()).toBe('basis.color.accent-1');
    });

    it('renders a row for every token in the group', () => {
      const tokenRows = getRows(component).filter((row) => row.classList.contains('clippy-token-group-table__row'));
      expect(tokenRows).toHaveLength(2);
      expect(tokenRows[0].cells[1].textContent?.trim()).toBe('bg-default');
      expect(tokenRows[1].cells[1].textContent?.trim()).toBe('bg-subtle');
    });

    it('shows the reference for aliased tokens', () => {
      const [, aliasRow] = getRows(component).filter((row) => row.classList.contains('clippy-token-group-table__row'));
      expect(aliasRow.cells[2].textContent?.trim()).toBe('{basis.color.accent-1.bg-default}');
    });

    it('shows the value for non-aliased tokens', () => {
      const [valueRow] = getRows(component).filter((row) => row.classList.contains('clippy-token-group-table__row'));
      expect(valueRow.cells[2].textContent?.trim()).toBe(stringifyTokenValue(firstToken));
    });
  });

  describe('labels', () => {
    it.each(labels)('renders the default %s', async (_attribute, defaultLabel) => {
      const component = await render();
      const headers = Array.from(component.shadowRoot?.querySelectorAll('th') ?? []).map((th) =>
        th.textContent?.trim(),
      );
      expect(headers).toContain(defaultLabel);
    });

    it.each(labels)('renders a custom %s', async (attribute) => {
      const component = await render(`path="basis.color" ${attribute}="custom ${attribute}"`);
      const headers = Array.from(component.shadowRoot?.querySelectorAll('th') ?? []).map((th) =>
        th.textContent?.trim(),
      );
      expect(headers).toContain(`custom ${attribute}`);
    });

    it('renders a custom copy-label', async () => {
      const component = await render('path="basis.color" copy-label="Kopieer"');
      const button = component.shadowRoot?.querySelector('clippy-button');
      expect(button?.textContent).toContain('Kopieer');
    });

    it('renders the copy-label and quoted value in the toggletip', async () => {
      const component = await render();
      const toggletip = component.shadowRoot?.querySelector('clippy-toggletip');
      expect(toggletip?.getAttribute('text')).toBe(`Copy "${stringifyTokenValue(firstToken)}"`);
    });

    it('renders a custom copy-label in the toggletip', async () => {
      const component = await render('path="basis.color" copy-label="Kopieer"');
      const toggletip = component.shadowRoot?.querySelector('clippy-toggletip');
      expect(toggletip?.getAttribute('text')).toBe(`Kopieer "${stringifyTokenValue(firstToken)}"`);
    });
  });

  describe('empty states', () => {
    it('renders nothing when theme is not passed', async () => {
      document.body.innerHTML = `<${tag} path="basis.color"></${tag}>`;
      const component = document.querySelector(tag) as ClippyTokenGroupTable;
      await component.updateComplete;
      expect(component.shadowRoot?.querySelector('table')).toBeNull();
    });

    it('renders nothing when theme is undefined', async () => {
      // Set explicitly: render() replaces undefined with the default fixture
      const component = await render('path="basis.color"', null);
      component.theme = undefined;
      await component.updateComplete;
      expect(component.shadowRoot?.querySelector('table')).toBeNull();
    });

    it('renders nothing when theme is null', async () => {
      const component = await render('path="basis.color"', null);
      expect(component.shadowRoot?.querySelector('table')).toBeNull();
    });

    it('removes the table when theme is reset to null', async () => {
      const component = await render();
      expect(component.shadowRoot?.querySelector('table')).toBeTruthy();
      component.theme = null;
      await component.updateComplete;
      expect(component.shadowRoot?.querySelector('table')).toBeNull();
    });

    it('renders nothing when the theme attribute is "null"', async () => {
      document.body.innerHTML = `<${tag} path="basis.color" theme="null"></${tag}>`;
      const component = document.querySelector(tag) as ClippyTokenGroupTable;
      await component.updateComplete;
      expect(component.shadowRoot?.querySelector('table')).toBeNull();
    });

    it('renders no rows for a path that does not exist', async () => {
      const component = await render('path="basis.does-not-exist"');
      expect(getRows(component)).toHaveLength(0);
    });

    it('renders the whole theme without a path', async () => {
      const component = await render('');
      expect(component.shadowRoot?.querySelector('caption')).toBeNull();
      expect(getRows(component).length).toBeGreaterThan(0);
    });
  });

  it('renders resolved samples for ref values', async () => {
    const component = await render('path="basis.color.accent-1"', themeFixture);
    const samples = Array.from(component.shadowRoot?.querySelectorAll('clippy-token-sample') ?? []);
    expect(samples).toHaveLength(4);
    await Promise.all(samples.map((sample) => sample.updateComplete));
    for (const sample of samples) {
      expect(sample.shadowRoot?.querySelector('clippy-color-sample')?.getAttribute('color')).not.toMatch(/^\{/);
    }
  });

  it('copies the token value to the clipboard', async () => {
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    const component = await render();
    const button = component.shadowRoot?.querySelector<HTMLElement>('clippy-button');
    button?.click();
    expect(writeText).toHaveBeenCalledWith(stringifyTokenValue(firstToken));
  });

  it('copies the resolved value instead of the reference for ref tokens', async () => {
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    const component = await render('path="basis.color.accent-1"', themeFixture);
    const button = component.shadowRoot?.querySelector<HTMLElement>('clippy-button');
    button?.click();
    const refToken: BaseDesignToken = dlv(themeFixture, 'basis.color.accent-1.bg-default');
    const resolvedToken: BaseDesignToken = dlv(themeFixture, 'brand.color.blue.100');
    expect(writeText).toHaveBeenCalledWith(stringifyToken(resolvedToken));
    expect(writeText).not.toHaveBeenCalledWith(refToken.$value);
  });

  describe('value-display', () => {
    const getValueCell = (component: ClippyTokenGroupTable, name: string) =>
      getRows(component)
        .find((row) => row.cells[1]?.textContent?.trim() === name)
        ?.cells[2].textContent?.trim();

    const renderButton = (valueDisplay?: string) =>
      render(valueDisplay ? `path="nl.button" value-display="${valueDisplay}"` : 'path="nl.button"', themeFixture);

    const resolved = (path: string) => stringifyTokenValue(dlv(themeFixture, path));

    it('defaults to as-authored', async () => {
      const component = await renderButton();
      expect(component.valueDisplay).toBe('as-authored');
      expect(getValueCell(component, 'background-color')).toBe('{basis.color.default.bg-default}');
    });

    it.each([
      ['background-color', '{basis.color.default.bg-default}'],
      ['border-color', '{basis.color.accent-1.border-default}'],
      ['color', '{brand.color.blue.900}'],
      ['font-size', '{basis.text.font-size.md}'],
      ['padding-block', '{basis.space.block.md}'],
      ['min-block-size', '44px'],
    ])('as-authored: shows %s as %s', async (name, expected) => {
      const component = await renderButton('as-authored');
      expect(getValueCell(component, name)).toBe(expected);
    });

    it.each([
      // Chain nl → basis → basis → brand shows the first basis token
      ['background-color', '{basis.color.default.bg-default}'],
      ['border-color', '{basis.color.accent-1.border-default}'],
      ['padding-block', '{basis.space.block.md}'],
      // Falls back to as-authored without a basis token in the chain
      ['color', '{brand.color.blue.900}'],
      ['min-block-size', '44px'],
    ])('common: shows %s as %s', async (name, expected) => {
      const component = await renderButton('common');
      expect(getValueCell(component, name)).toBe(expected);
    });

    it.each([
      ['background-color', '{brand.color.blue.100}'],
      ['border-color', '{brand.color.blue.500}'],
      ['color', '{brand.color.blue.900}'],
      ['padding-block', '{brand.space.16}'],
      // Falls back to as-authored without a brand token in the chain
      ['font-size', '{basis.text.font-size.md}'],
      ['min-block-size', '44px'],
    ])('brand: shows %s as %s', async (name, expected) => {
      const component = await renderButton('brand');
      expect(getValueCell(component, name)).toBe(expected);
    });

    it.each([
      ['background-color', 'brand.color.blue.100'],
      ['border-color', 'brand.color.blue.500'],
      ['color', 'brand.color.blue.900'],
      ['font-size', 'basis.text.font-size.md'],
      ['padding-block', 'brand.space.16'],
      ['min-block-size', 'nl.button.min-block-size'],
    ])('resolved: shows %s as the value of %s', async (name, path) => {
      const component = await renderButton('resolved');
      expect(getValueCell(component, name)).toBe(resolved(path));
    });

    it('shows brand values for basis tokens that reference brand directly', async () => {
      const component = await render('path="basis.color.accent-1" value-display="brand"', themeFixture);
      expect(getValueCell(component, 'bg-default')).toBe('{brand.color.blue.100}');
    });

    it('stops at circular references', async () => {
      const circular = {
        a: {
          one: { $type: 'color', $value: '{a.two}' },
          two: { $type: 'color', $value: '{a.one}' },
        },
      } as unknown as TokenGroup;
      const component = await render('path="a" value-display="brand"', circular);
      expect(getValueCell(component, 'one')).toBe('{a.two}');
    });

    it('keeps the breadcrumb collected before a circular reference', async () => {
      const circular = {
        basis: {
          one: { $type: 'color', $value: '{brand.one}' },
        },
        brand: {
          one: { $type: 'color', $value: '{basis.one}' },
        },
        nl: {
          button: { color: { $type: 'color', $value: '{basis.one}' } },
        },
      } as unknown as TokenGroup;
      const component = await render('path="nl.button" value-display="brand"', circular);
      // Breadcrumb is [{basis.one}, {brand.one}] before the loop back to {basis.one}
      expect(getValueCell(component, 'color')).toBe('{brand.one}');
    });

    it('updates when the value-display attribute changes', async () => {
      const component = await renderButton('as-authored');
      component.setAttribute('value-display', 'brand');
      await component.updateComplete;
      expect(getValueCell(component, 'background-color')).toBe('{brand.color.blue.100}');
    });

    it('updates when the path attribute changes', async () => {
      const component = await renderButton();
      component.setAttribute('path', 'basis.text.font-size');
      await component.updateComplete;
      expect(component.shadowRoot?.querySelector('caption')?.textContent?.trim()).toBe('basis.text.font-size');
      expect(getValueCell(component, 'xl')).toBe('1.5rem');
    });

    it('updates when the theme is replaced', async () => {
      const component = await renderButton();
      const nextTheme = structuredClone(themeFixture);
      dlv(nextTheme, 'nl.button')['background-color'].$value = '{brand.color.red.100}';
      component.theme = nextTheme;
      await component.updateComplete;
      expect(getValueCell(component, 'background-color')).toBe('{brand.color.red.100}');
    });

    it('updates when value-display changes', async () => {
      const component = await renderButton('as-authored');
      component.valueDisplay = 'brand';
      await component.updateComplete;
      expect(getValueCell(component, 'background-color')).toBe('{brand.color.blue.100}');
    });

    it.each(['as-authored', 'common', 'brand', 'resolved'])('%s: copies the resolved value', async (valueDisplay) => {
      const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
      const component = await renderButton(valueDisplay);
      component.shadowRoot?.querySelector<HTMLElement>('clippy-button')?.click();
      expect(writeText).toHaveBeenCalledWith(resolved('brand.color.blue.100'));
    });
  });
});
