import Color from 'colorjs.io';
import './index';
import { describe, expect, it, afterEach } from 'vitest';
import { ClippyTokenSampleSpacing } from './index';

const tag = 'clippy-token-sample-spacing';

function getComponent() {
  return document.querySelector(tag) as unknown as ClippyTokenSampleSpacing;
}

const concepts = [
  {
    color: '#f2c9dc',
    concept: 'inline',
  },
  {
    color: '#e289b1',
    concept: 'block',
  },
  {
    color: '#4ad571',
    concept: 'text',
  },
  {
    color: '#40adef',
    concept: 'row',
  },
  {
    color: '#abdbf8',
    concept: 'column',
  },
];

describe(`<${tag}>`, () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders', async () => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    const element = document.querySelector(tag);
    expect(element).toBeDefined();
  });

  it.each(concepts)('accepts concept $concept', async ({ color, concept }) => {
    document.body.innerHTML = `<${tag} concept="${concept}"></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    const backgroundColor = getComputedStyle(component, ':before').backgroundColor;
    const normalizedColor = new Color(backgroundColor);
    const expectedColor = new Color(color);

    expect(component.concept).toBe(concept);
    expect(normalizedColor.toString({ format: 'rgb' })).toBe(expectedColor.toString({ format: 'rgb' }));
  });

  // test size property
  it('accepts size property', async () => {
    document.body.innerHTML = `<${tag} size="2rem"></${tag}>`;
    const component = getComponent();
    await component.updateComplete;

    expect(component).toHaveStyle('--_clippy-internal-token-sample-spacing-size: 2rem');
    const inlineSize = getComputedStyle(component, ':before').inlineSize;
    expect(inlineSize).toBe('32px');
  });
});
