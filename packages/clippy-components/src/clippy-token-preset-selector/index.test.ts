import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippyTokenPresetSelector } from './index';

const tag = 'clippy-token-preset-selector';

describe(`<${tag}>`, () => {
  let component: ClippyTokenPresetSelector;

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippyTokenPresetSelector;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Basic rendering', () => {
    it('renders', async () => {
      await component.updateComplete;
      await expect.element(component).toBeInTheDocument();
    });
  });
});
