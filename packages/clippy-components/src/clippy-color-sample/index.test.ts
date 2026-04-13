import { describe, expect, it, afterEach } from 'vitest';
import { page } from 'vitest/browser';
import { ClippyColorSample } from './index';

const tag = 'clippy-color-sample';

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
    const element = document.querySelector(tag);
    const imgElement = element?.shadowRoot?.querySelector('[role="img"]');
    expect(imgElement).toBeDefined();
  });

  it('renders an svg element', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as ClippyColorSample;
    await component?.updateComplete;

    const svg = component.shadowRoot?.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('applies color property as inline style', async () => {
    document.body.innerHTML = `<${tag} color="red"></${tag}>`;
    const component = document.querySelector(tag) as ClippyColorSample;
    await component?.updateComplete;

    const svg = component.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('style')).toContain('color: red');
  });

  it('defaults to empty color', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = document.querySelector(tag) as ClippyColorSample;
    await component?.updateComplete;

    const svg = component.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('style')).toContain('color: ;');
  });

  it('updates color when property changes', async () => {
    document.body.innerHTML = `<${tag} color="blue"></${tag}>`;
    const component = document.querySelector(tag) as ClippyColorSample;
    await component?.updateComplete;

    component.color = 'green';
    await component?.updateComplete;

    const svg = component.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('style')).toContain('color: green');
  });

  it('renders multiple instances independently', async () => {
    document.body.innerHTML = `
      <${tag} color="red"></${tag}>
      <${tag} color="blue"></${tag}>
    `;

    const [first, second] = Array.from(document.querySelectorAll(tag)) as ClippyColorSample[];
    await first?.updateComplete;
    await second?.updateComplete;

    const firstSvg = first.shadowRoot?.querySelector('svg');
    const secondSvg = second.shadowRoot?.querySelector('svg');

    expect(firstSvg?.getAttribute('style')).toContain('color: red');
    expect(secondSvg?.getAttribute('style')).toContain('color: blue');
  });
});
