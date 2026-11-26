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
});
