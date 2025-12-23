import { describe, expect, it, afterEach } from 'vitest';
import { page } from 'vitest/browser';
import './index';

const tag = 'clippy-html-image';

describe(`<${tag}>`, () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders element', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const imgElement = page.getByRole('img');
    expect(imgElement).toBeDefined();
  });

  it('has role="img"', () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const imgElement = document.querySelector('[role="img"]');
    expect(imgElement).toBeDefined();
  });

  it('has slot for label', () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const element = document.querySelector(tag);
    const labelSlot = element?.querySelector('slot[name="label"]');
    expect(labelSlot).toBeDefined();
  });

  it('returns component via page.getByRole("img")', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const imgElement = page.getByRole('img');
    expect(imgElement).toBeDefined();
    const elementHandle = imgElement.element;
    expect(elementHandle).toBeTruthy();
  });

  it('has accessible label when label slot is present', async () => {
    document.body.innerHTML = `
      <${tag}>
        <span slot="label">my label</span>
      </${tag}>
    `;
    // Wait for component to finish updating
    const component = document.querySelector(tag) as unknown as { updateComplete: Promise<void> };
    await component?.updateComplete;

    const imgElement = page.getByRole('img');
    expect(imgElement).toHaveAccessibleName('my label');
  });

  it('does not have accessible label when label slot is not present', async () => {
    document.body.innerHTML = `
      <${tag}></${tag}>
    `;
    // Wait for component to finish updating
    const component = document.querySelector(tag) as unknown as { updateComplete: Promise<void> };
    await component?.updateComplete;

    const imgElement = page.getByRole('img');
    expect(imgElement).not.toHaveAccessibleName();
  });

  it('Sets labels correctly when rendering more than 1 html-image', async () => {
    document.body.innerHTML = `
      <${tag}>
        <span slot="label">my first label</span>
      </${tag}>

      <${tag}>
        <span slot="label">my second label</span>
      </${tag}>
    `;

    // Wait for component to finish updating
    const component = document.querySelector(tag) as unknown as { updateComplete: Promise<void> };
    await component?.updateComplete;

    // First image
    const imgElement1 = page.getByRole('img').first();
    expect(imgElement1).toHaveAccessibleName('my first label');

    // Second image
    const imgElement2 = page.getByRole('img').last();
    expect(imgElement2).toHaveAccessibleName('my second label');
  });
});
