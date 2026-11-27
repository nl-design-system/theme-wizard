import { type BaseDesignToken, type TokenGroup } from '@nl-design-system-community/design-tokens-schema';
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

const getTokenRows = (component: ClippyTokenGroupTable) =>
  getRows(component).filter((row) => row.classList.contains('clippy-token-group-table__row'));

const NAME_CELL = 1;
const ACTIONS_CELL = 3;

const getCopyButton = (row: HTMLTableRowElement, cellIndex: number) =>
  row.cells[cellIndex].querySelector<HTMLElement>('clippy-button');

const getCopyToggletip = (row: HTMLTableRowElement, cellIndex: number) =>
  row.cells[cellIndex].querySelector('clippy-toggletip');

// Name cell also holds the copy button, so only take its own text nodes
const getTokenName = (row: HTMLTableRowElement) =>
  Array.from(row.cells[NAME_CELL].childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent)
    .join('')
    .trim();

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
      const tokenRows = getTokenRows(component);
      expect(tokenRows).toHaveLength(2);
      expect(getTokenName(tokenRows[0])).toBe('bg-default');
      expect(getTokenName(tokenRows[1])).toBe('bg-subtle');
    });

    it('renders the token name as row header', () => {
      const [tokenRow] = getTokenRows(component);
      const nameCell = tokenRow.cells[NAME_CELL];
      expect(nameCell.tagName).toBe('TH');
      expect(nameCell.getAttribute('scope')).toBe('row');
    });

    it('renders every group in its own tbody with a rowgroup header', () => {
      const groupHeader = component.shadowRoot?.querySelector('tbody th[scope="rowgroup"]');
      expect(groupHeader?.textContent?.trim()).toBe('basis.color.accent-1');
      expect(groupHeader?.closest('tbody')?.querySelectorAll('.clippy-token-group-table__row')).toHaveLength(2);
    });

    it('hides the redundant samples from assistive technology', () => {
      const samples = Array.from(
        component.shadowRoot?.querySelectorAll('.clippy-token-group-table__token-sample') ?? [],
      );
      expect(samples.length).toBeGreaterThan(0);
      for (const sample of samples) {
        expect(sample.getAttribute('aria-hidden')).toBe('true');
      }
    });

    it('includes the token path in the value copy button label', () => {
      const [tokenRow] = getTokenRows(component);
      expect(getCopyButton(tokenRow, ACTIONS_CELL)?.textContent).toContain('Copy basis.color.accent-1.bg-default');
    });

    it('includes the CSS variable in the name copy button label', () => {
      const [tokenRow] = getTokenRows(component);
      expect(getCopyButton(tokenRow, NAME_CELL)?.textContent).toContain('Copy var(--basis-color-accent-1-bg-default)');
    });

    it('shows the reference for aliased tokens as a data badge', () => {
      const [, aliasRow] = getTokenRows(component);
      const badge = aliasRow.cells[2].querySelector('.nl-data-badge');
      expect(badge?.textContent?.trim()).toBe('basis.color.accent-1.bg-default');
    });

    it('shows the value for non-aliased tokens as code', () => {
      const [valueRow] = getTokenRows(component);
      const code = valueRow.cells[2].querySelector('.nl-code');
      expect(code?.textContent?.trim()).toBe(stringifyTokenValue(firstToken));
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
      const [tokenRow] = getTokenRows(component);
      expect(getCopyButton(tokenRow, NAME_CELL)?.textContent).toContain('Kopieer');
      expect(getCopyButton(tokenRow, ACTIONS_CELL)?.textContent).toContain('Kopieer');
    });

    it('renders the copy-label and quoted value in the value toggletip', async () => {
      const component = await render();
      const [tokenRow] = getTokenRows(component);
      expect(getCopyToggletip(tokenRow, ACTIONS_CELL)?.getAttribute('text')).toBe(
        `Copy "${stringifyTokenValue(firstToken)}"`,
      );
    });

    it('renders the copy-label and quoted CSS variable in the name toggletip', async () => {
      const component = await render();
      const [tokenRow] = getTokenRows(component);
      expect(getCopyToggletip(tokenRow, NAME_CELL)?.getAttribute('text')).toBe(
        'Copy "var(--basis-color-accent-1-bg-default)"',
      );
    });

    it('renders a custom copy-label in the toggletips', async () => {
      const component = await render('path="basis.color" copy-label="Kopieer"');
      const [tokenRow] = getTokenRows(component);
      expect(getCopyToggletip(tokenRow, NAME_CELL)?.getAttribute('text')).toBe(
        'Kopieer "var(--basis-color-accent-1-bg-default)"',
      );
      expect(getCopyToggletip(tokenRow, ACTIONS_CELL)?.getAttribute('text')).toBe(
        `Kopieer "${stringifyTokenValue(firstToken)}"`,
      );
    });
  });

  describe('caption', () => {
    it('renders a custom caption', async () => {
      const component = await render('path="basis.color" caption="Colors"');
      expect(component.shadowRoot?.querySelector('caption')?.textContent?.trim()).toBe('Colors');
    });

    it('renders a custom caption without a path', async () => {
      const component = await render('caption="All tokens"');
      expect(component.shadowRoot?.querySelector('caption')?.textContent?.trim()).toBe('All tokens');
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
    const [tokenRow] = getTokenRows(component);
    getCopyButton(tokenRow, ACTIONS_CELL)?.click();
    expect(writeText).toHaveBeenCalledWith(stringifyTokenValue(firstToken));
  });

  it('copies the CSS variable to the clipboard', async () => {
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    const component = await render();
    const [tokenRow] = getTokenRows(component);
    getCopyButton(tokenRow, NAME_CELL)?.click();
    expect(writeText).toHaveBeenCalledWith('var(--basis-color-accent-1-bg-default)');
  });

  it('copies the reference as a CSS variable for ref tokens', async () => {
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    const component = await render('path="basis.color.accent-1"', themeFixture);
    const [tokenRow] = getTokenRows(component);
    getCopyButton(tokenRow, ACTIONS_CELL)?.click();
    expect(writeText).toHaveBeenCalledWith('var(--brand-color-blue-100)');
  });

  it('shows the referenced CSS variable in the value toggletip for ref tokens', async () => {
    const component = await render();
    const [, aliasRow] = getTokenRows(component);
    expect(getCopyToggletip(aliasRow, ACTIONS_CELL)?.getAttribute('text')).toBe(
      'Copy "var(--basis-color-accent-1-bg-default)"',
    );
  });
});
