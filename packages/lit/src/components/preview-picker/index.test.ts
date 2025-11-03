import '.';
import { beforeEach, describe, expect, test } from 'vitest';
import type { PreviewPicker } from '.';

const tag = 'preview-picker';

const mount = async () => {
  document.body.innerHTML = `<${tag}></${tag}>`;
  const el = document.querySelector(tag) as PreviewPicker;
  await el.updateComplete;
  return el;
};

describe(`<${tag}>`, () => {
  beforeEach(() => {
    const origin = globalThis.location.origin;
    globalThis.history.pushState({}, '', `${origin}/`);
    document.body.innerHTML = '';
  });

  test('renders a form with wiz-dropdown', async () => {
    const el = await mount();
    const form = el.shadowRoot?.querySelector('form');
    const dropdown = el.shadowRoot?.querySelector('wiz-dropdown');

    expect(form).toBeTruthy();
    expect(dropdown).toBeTruthy();
  });

  test('builds optgroup options with full template paths', async () => {
    const el = await mount();
    const dropdown = el.shadowRoot?.querySelector('wiz-dropdown');
    const options = dropdown?.options;
    const allValues = options?.flatMap((g) => g.detail?.map((d) => d.value));

    expect(allValues).toContain('/my-environment/overview');
    expect(allValues).toContain('/preview-components/collage-1');
  });

  test('defaults to first option when no templatePath param', async () => {
    const el = await mount();
    const dropdown = el.shadowRoot?.querySelector('wiz-dropdown');

    expect(dropdown?.value).toBe('/my-environment/overview');
  });

  test('reads current value from ?templatePath query param', async () => {
    const origin = globalThis.location.origin;
    globalThis.history.pushState({}, '', `${origin}/?templatePath=/preview-components/collage-1`);
    const el = await mount();
    const dropdown = el.shadowRoot?.querySelector('wiz-dropdown');

    expect(dropdown?.value).toBe('/preview-components/collage-1');
  });
});
