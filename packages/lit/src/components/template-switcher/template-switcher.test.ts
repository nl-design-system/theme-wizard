import './template-switcher';
import { beforeEach, describe, expect, test } from 'vitest';
import { TemplateChangeEvent, TemplateSwitcher } from './template-switcher';

const tag = 'template-switcher';

describe(`<${tag}> integration tests`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
  });

  test('renders a select element', () => {
    const element = document.querySelector(tag) as TemplateSwitcher;
    const select = element?.shadowRoot?.querySelector('select');
    expect(select).toBeDefined();
    expect(select?.tagName.toLowerCase()).toBe('select');
  });

  test('renders optgroups with options', () => {
    const element = document.querySelector(tag) as TemplateSwitcher;
    const select = element?.shadowRoot?.querySelector('select');
    const optgroups = select?.querySelectorAll('optgroup');
    const options = select?.querySelectorAll('option');

    expect(optgroups?.length).toBeGreaterThan(0);
    expect(options?.length).toBeGreaterThan(0);

    // Check specific template structure
    const mijnOmgevingGroup = Array.from(optgroups || []).find((opt) => opt.getAttribute('label') === 'Mijn Omgeving');
    expect(mijnOmgevingGroup).toBeDefined();
  });

  test('dispatches template-change event on select change', async () => {
    const element = document.querySelector(tag) as TemplateSwitcher;
    let receivedEvent: CustomEvent<TemplateChangeEvent> | undefined;

    element?.addEventListener('template-change', (e: Event) => {
      receivedEvent = e as CustomEvent<TemplateChangeEvent>;
    });

    const select = element?.shadowRoot?.querySelector('select') as HTMLSelectElement;
    select.dispatchEvent(new Event('change', { bubbles: true }));

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(receivedEvent).toBeDefined();
    expect(receivedEvent?.detail?.type).toBeDefined();
  });
});
