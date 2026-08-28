import { stringifyToken } from '@nl-design-system-community/design-tokens-schema';
import { getTokenPath } from '@src/lib/tokens';
import './index';
import { describe, expect, it, beforeEach } from 'vitest';
import { page } from 'vitest/browser';
import { tokensFixture } from './fixtures';
import { ClippyTokenTable } from './index';

const tag = 'clippy-token-table';

const labels = [
  'example-label',
  'token-id-label',
  'value-label',
  'reference-to-label',
  'details-label',
  'show-details-label',
  'reference-title-label',
  'reference-empty-label',
  'copy-to-clipboard-label',
];

describe(`<${tag}>`, () => {
  let component: ClippyTokenTable;
  beforeEach(() => {
    document.body.innerHTML = `<${tag} tokens='${JSON.stringify(tokensFixture)}'></${tag}>`;
    component = document.querySelector(tag) as ClippyTokenTable;
  });

  it('renders', async () => {
    await component.updateComplete;

    expect(component.shadowRoot?.querySelector('[role="table"]')).toBeTruthy();
  });

  it.each(labels)('the %s is displayed correctly', async (label) => {
    document.body.innerHTML = `<${tag} ${label}="${label} label" tokens='${JSON.stringify(tokensFixture)}'></${tag}>`;
    component = document.querySelector(tag) as ClippyTokenTable;
    await component.updateComplete;
    const labelLocator = page.getByText(`${label} label`);
    expect(labelLocator).toBeDefined();
  });

  it.each(tokensFixture)('the token %s is displayed correctly', async (token) => {
    await component.updateComplete;
    const tokenId = getTokenPath(token);
    const tokenValue = stringifyToken(token);
    const tokenIdLocator = page.getByText(tokenId);
    const tokenValueLocator = page.getByText(tokenValue);
    const showDetailsLocator = page.getByText(`Show details ${tokenId}`);

    expect(tokenIdLocator).toBeDefined();
    expect(tokenValueLocator).toBeDefined();
    expect(showDetailsLocator).toBeDefined();
  });
});
