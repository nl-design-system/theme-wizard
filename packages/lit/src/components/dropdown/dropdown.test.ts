import './dropdown';
import { beforeEach, describe, expect, test } from 'vitest';
import { Dropdown } from './dropdown';

const tag = 'wiz-dropdown';

const OPTIONS = [
  {
    name: 'Mijn Omgeving',
    detail: [
      { name: 'Overzichtspagina', value: '/my-environment/overview' },
      { name: 'Berichten', value: '/my-environment/messages' },
    ],
    value: 'my-environment',
  },
  {
    name: 'Voorvertoning losse componenten',
    detail: [{ name: 'Collage 1', value: '/preview-components/collage-1' }],
    value: 'preview-components',
  },
];

describe(`<${tag}> integration tests`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
  });

  test('renders a select element', async () => {
    const element = document.querySelector(tag) as Dropdown;
    element.isOptgroup = true;
    element.options = OPTIONS;
    await element.updateComplete;

    const select = element?.shadowRoot?.querySelector('select');
    expect(select).toBeDefined();
    expect(select?.tagName.toLowerCase()).toBe('select');
  });

  test('renders optgroups with options', async () => {
    const element = document.querySelector(tag) as Dropdown;
    element.isOptgroup = true;
    element.options = OPTIONS;
    await element.updateComplete;

    const select = element?.shadowRoot?.querySelector('select');
    const optgroups = select?.querySelectorAll('optgroup');
    const options = select?.querySelectorAll('option');

    expect(optgroups?.length).toBeGreaterThan(0);
    expect(options?.length).toBeGreaterThan(0);

    const mijnOmgevingGroup = Array.from(optgroups || []).find((opt) => opt.getAttribute('label') === 'Mijn Omgeving');
    expect(mijnOmgevingGroup).toBeDefined();
  });

  test('dispatches change event on select change', async () => {
    const element = document.querySelector(tag) as Dropdown;
    element.isOptgroup = true;
    element.options = OPTIONS;
    element.value = OPTIONS[0].detail[0].value; // '/my-environment/overview'
    await element.updateComplete;
    expect(element.value).toBe('/my-environment/overview');

    const select = element?.shadowRoot?.querySelector('select') as HTMLSelectElement;
    // Simulate selecting another option
    select.value = OPTIONS[1].detail[0].value; // '/preview-components/collage-1'
    let changed = false;

    element.addEventListener('change', () => {
      changed = true;
    });
    select.dispatchEvent(new Event('change', { bubbles: true }));

    expect(element.value).toBe('/preview-components/collage-1');
    expect(changed).toBe(true);
  });
});
