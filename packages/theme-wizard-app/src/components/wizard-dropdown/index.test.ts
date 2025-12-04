import '.';
import { beforeEach, describe, expect, it } from 'vitest';
import { WizardDropdown } from '.';

const tag = 'wizard-dropdown';

const OPTIONS = [
  {
    name: 'Some name',
    detail: [
      { name: 'Some detail 1', value: '/some/path/overview' },
      { name: 'Some detail 2', value: '/some/path/messages' },
    ],
    value: 'some-path',
  },
  {
    name: 'Some other name',
    detail: [{ name: 'Some other detail', value: '/some/other/path/messages' }],
    value: 'some-other-path',
  },
];

describe(`<${tag}> integration tests`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
  });

  it('renders a select element', async () => {
    const element = document.querySelector(tag) as WizardDropdown;
    element.isOptgroup = true;
    element.options = OPTIONS;
    await element.updateComplete;

    const select = element?.shadowRoot?.querySelector('select');
    expect(select).toBeDefined();
    expect(select?.tagName.toLowerCase()).toBe('select');
  });

  it('renders optgroups with options', async () => {
    const element = document.querySelector(tag) as WizardDropdown;
    element.isOptgroup = true;
    element.options = OPTIONS;
    await element.updateComplete;

    const select = element?.shadowRoot?.querySelector('select');
    const optgroups = select?.querySelectorAll('optgroup');
    const options = select?.querySelectorAll('option');

    expect(optgroups?.length).toBeGreaterThan(0);
    expect(options?.length).toBeGreaterThan(0);

    const somePathGroup = Array.from(optgroups || []).find((opt) => opt.getAttribute('label') === 'Some name');
    expect(somePathGroup).toBeDefined();
  });

  it('dispatches change event on select change', async () => {
    const element = document.querySelector(tag) as WizardDropdown;
    element.isOptgroup = true;
    element.options = OPTIONS;
    element.value = OPTIONS[0].detail[0].value; // '/some/path/overview'
    await element.updateComplete;
    expect(element.value).toBe('/some/path/overview');

    const select = element?.shadowRoot?.querySelector('select') as HTMLSelectElement;
    // Simulate selecting another option
    select.value = OPTIONS[1].detail[0].value; // '/some/other/path/messages'
    let changed = false;

    element.addEventListener('change', () => {
      changed = true;
    });
    select.dispatchEvent(new Event('change', { bubbles: true }));

    expect(element.value).toBe('/some/other/path/messages');
    expect(changed).toBe(true);
  });
});
