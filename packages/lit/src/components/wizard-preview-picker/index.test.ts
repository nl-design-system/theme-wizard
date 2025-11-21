import '.';
import type { Category, TemplateGroup } from '@nl-design-system-community/theme-wizard-templates';
import { beforeEach, describe, expect, it } from 'vitest';
import type { WizardPreviewPicker } from '.';

const tag = 'wizard-preview-picker';
const category: Category = 'template';

const templates = {
  name: 'My Environment',
  pages: [
    {
      name: 'Some beautiful page',
      value: '/something-beautiful/some-beautiful-page',
    },
    {
      name: 'Another beautiful page',
      value: '/another-beautiful-thing/another-beautiful-page',
    },
  ],
  type: category,
};

const mount = async () => {
  document.body.innerHTML = `<${tag}></${tag}>`;
  const el = document.querySelector(tag) as WizardPreviewPicker;
  el.templates = [templates] as TemplateGroup[];
  await el.updateComplete;
  return el;
};

describe(`<${tag}>`, () => {
  beforeEach(() => {
    const origin = globalThis.location.origin;
    globalThis.history.pushState({}, '', `${origin}/`);
    document.body.innerHTML = '';
  });

  it('renders a form with wizard-dropdown', async () => {
    const el = await mount();
    const form = el.shadowRoot?.querySelector('form');
    const dropdown = el.shadowRoot?.querySelector('wizard-dropdown');

    expect(form).toBeTruthy();
    expect(dropdown).toBeTruthy();
  });

  it('builds optgroup options with full template paths', async () => {
    const el = await mount();
    const dropdown = el.shadowRoot?.querySelector('wizard-dropdown');
    const options = dropdown?.options;
    const allValues = options?.flatMap((g) => g.detail?.map((d) => d.value));

    expect(allValues).toContain('/something-beautiful/some-beautiful-page');
    expect(allValues).toContain('/another-beautiful-thing/another-beautiful-page');
  });

  it('defaults to first option when no templatePath param', async () => {
    const el = await mount();
    const dropdown = el.shadowRoot?.querySelector('wizard-dropdown');

    expect(dropdown?.value).toBe('/something-beautiful/some-beautiful-page');
  });

  it('reads current value from ?templatePath query param', async () => {
    const origin = globalThis.location.origin;
    globalThis.history.pushState({}, '', `${origin}/?templatePath=/something-beautiful/some-beautiful-page`);
    const el = await mount();
    const dropdown = el.shadowRoot?.querySelector('wizard-dropdown');

    expect(dropdown?.value).toBe('/something-beautiful/some-beautiful-page');
  });
});
