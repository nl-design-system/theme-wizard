import './index';
import { afterEach, describe, expect, it } from 'vitest';
import type { WizardStepFormTaskNavigation } from './index';

const tag = 'wizard-step-form-task-navigation';

describe(`<${tag}>`, () => {
  let component: WizardStepFormTaskNavigation;

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders', async () => {
    document.body.innerHTML = `<${tag} href="/wizard/typography" icon="typography" label="Typography"></${tag}>`;
    component = document.querySelector(tag) as WizardStepFormTaskNavigation;
    await component.updateComplete;
    await expect.element(component).toBeInTheDocument();
  });

  it('mirrors the label into both the link and the visible header', async () => {
    document.body.innerHTML = `<${tag} href="/wizard/typography" icon="typography" label="Typography"></${tag}>`;
    component = document.querySelector(tag) as WizardStepFormTaskNavigation;
    await component.updateComplete;

    const anchor = component.shadowRoot?.querySelector('a[slot="link"]');
    const header = component.shadowRoot?.querySelector('[slot="header"]');
    expect(anchor?.textContent).toContain('Typography');
    expect(header?.textContent?.trim()).toBe('Typography');
  });

  it('reflects link-focus-visible on clippy-task-navigation when the link is keyboard-focused', async () => {
    document.body.innerHTML = `<${tag} href="/wizard/typography" icon="typography" label="Typography"></${tag}>`;
    component = document.querySelector(tag) as WizardStepFormTaskNavigation;
    await component.updateComplete;

    const taskNav = component.shadowRoot?.querySelector('clippy-task-navigation');
    const anchor = taskNav?.querySelector('a') as HTMLAnchorElement;
    anchor.focus();

    expect(anchor.matches(':focus-visible')).toBe(true);
    expect(taskNav?.hasAttribute('link-focus-visible')).toBe(true);
  });
});
