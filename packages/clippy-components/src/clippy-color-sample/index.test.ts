import { describe, expect, it, afterEach } from 'vitest';
import './index';

const tag = 'clippy-color-sample';

type ComponentElement = { shadowRoot: ShadowRoot; updateComplete: Promise<boolean> };

function getComponent() {
  return document.querySelector(tag) as unknown as ComponentElement;
}

/**
 * @returns An rgb() string because that is what getComputedStyle() always returns
 */
function getSvgComputedColor(component: ComponentElement) {
  const svg = component.shadowRoot.querySelector('svg');
  return getComputedStyle(svg!).color;
}

describe(`<${tag}>`, () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a svg with role="img"', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    expect(component.shadowRoot.querySelector('[role="img"]')).toBeTruthy();
  });

  it('applies the color attribute as the SVG computed color', async () => {
    document.body.innerHTML = `<${tag} color="red"></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    expect(getSvgComputedColor(component)).toBe('rgb(255, 0, 0)');
  });

  it('updates the SVG computed color when the color property changes', async () => {
    document.body.innerHTML = `<${tag} color="rgb(0, 0, 255)"></${tag}>`;
    const component = getComponent() as ComponentElement & { color: string };
    await component.updateComplete;

    component.color = 'green';
    await component.updateComplete;

    expect(getSvgComputedColor(component)).toBe('rgb(0, 128, 0)');
  });

  it('renders multiple instances with independent colors', async () => {
    document.body.innerHTML = `
      <${tag} color="rgb(255, 0, 0)"></${tag}>
      <${tag} color="rgb(0, 0, 255)"></${tag}>
    `;

    const [first, second] = Array.from(document.querySelectorAll(tag)) as unknown as ComponentElement[];
    await first.updateComplete;
    await second.updateComplete;

    expect(getSvgComputedColor(first)).toBe('rgb(255, 0, 0)');
    expect(getSvgComputedColor(second)).toBe('rgb(0, 0, 255)');
  });
});
