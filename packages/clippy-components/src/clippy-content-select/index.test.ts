import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippyContentSelect } from './index';

const tag = 'clippy-content-select';

describe(`<${tag}>`, () => {
  let component: ClippyContentSelect;

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippyContentSelect;
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
