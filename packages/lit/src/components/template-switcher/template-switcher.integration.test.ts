import { page } from '@vitest/browser/context';
import { beforeEach, describe, expect, test } from 'vitest';
import './template-switcher';

const tag = 'template-switcher';

describe(`<${tag}> integration tests`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
  });

  test('renders template select by default', () => {
    const templateSwitcher = page.getByRole('combobox', { name: 'Voorvertoning Templates' });
    expect(templateSwitcher?.element()?.tagName.toLowerCase()).toBe('select');
  });

  test('renders component button when template is active', () => {
    const element = document.querySelector('template-switcher');
    const button = element?.shadowRoot?.querySelector('.component utrecht-button');
    expect(button).toBeDefined();
    expect(button?.textContent).toContain('Voorvertoning losse componenten');
  });

  test('switches to component view when button is clicked', async () => {
    const element = document.querySelector('template-switcher');
    const componentButton = element?.shadowRoot?.querySelector('.component utrecht-button') as HTMLElement;
    componentButton?.click();

    // Wait for re-render
    await new Promise((resolve) => setTimeout(resolve, 0));

    const componentSelect = page.getByRole('combobox', { name: 'Voorvertoning losse componenten' });
    expect(componentSelect?.element()?.tagName.toLowerCase()).toBe('select');

    // Should show template button
    const templateButton = element?.shadowRoot?.querySelector('.template utrecht-button');
    expect(templateButton).toBeDefined();
    expect(templateButton?.textContent).toContain('Voorvertoning Templates');

    // Click template button to switch back (covers #activateTemplate)
    (templateButton as HTMLElement)?.click();

    // Wait for re-render
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Template select should be visible again
    const templateSelect = page.getByRole('combobox', { name: 'Voorvertoning Templates' });
    expect(templateSelect?.element()?.tagName.toLowerCase()).toBe('select');
  });

  test('renders optgroups with options for templates', () => {
    const combobox = page.getByRole('combobox', { name: 'Voorvertoning Templates' }).element();
    const optgroups = combobox.querySelectorAll('optgroup');
    const options = combobox.querySelectorAll('option');

    expect(optgroups.length).toBeGreaterThan(0);
    expect(options.length).toBeGreaterThan(0);

    // Check specific template structure
    const mijnOmgevingGroup = Array.from(optgroups).find((opt) => opt.getAttribute('label') === 'Mijn Omgeving');
    expect(mijnOmgevingGroup).toBeDefined();
  });

  test('renders optgroups with options for components', async () => {
    // Switch to component view first
    const element = document.querySelector('template-switcher');
    const componentButton = element?.shadowRoot?.querySelector('.component utrecht-button') as HTMLElement;
    componentButton?.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const combobox = page.getByRole('combobox', { name: 'Voorvertoning losse componenten' }).element();
    const optgroups = combobox.querySelectorAll('optgroup');
    const options = combobox.querySelectorAll('option');

    expect(optgroups.length).toBeGreaterThan(0);
    expect(options.length).toBeGreaterThan(0);
  });

  test('applies correct CSS classes based on active state', () => {
    const element = document.querySelector('template-switcher');
    const templateDiv = element?.shadowRoot?.querySelector('.template');
    const componentDiv = element?.shadowRoot?.querySelector('.component');

    // Template should be active by default
    expect(templateDiv?.classList.contains('active')).toBe(true);
    expect(componentDiv?.classList.contains('active')).toBe(false);
  });

  test('switches CSS classes when switching views', async () => {
    const element = document.querySelector('template-switcher');
    const templateDiv = element?.shadowRoot?.querySelector('.template');
    const componentDiv = element?.shadowRoot?.querySelector('.component');

    // Initial state
    expect(templateDiv?.classList.contains('active')).toBe(true);
    expect(componentDiv?.classList.contains('active')).toBe(false);

    // Switch to component
    const componentButton = element?.shadowRoot?.querySelector('.component utrecht-button') as HTMLElement;
    componentButton?.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Component should now be active
    expect(templateDiv?.classList.contains('active')).toBe(false);
    expect(componentDiv?.classList.contains('active')).toBe(true);

    // Switch back to template
    const templateButton = element?.shadowRoot?.querySelector('.template utrecht-button') as HTMLElement;
    templateButton?.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Template should be active again
    expect(templateDiv?.classList.contains('active')).toBe(true);
    expect(componentDiv?.classList.contains('active')).toBe(false);
  });
});
