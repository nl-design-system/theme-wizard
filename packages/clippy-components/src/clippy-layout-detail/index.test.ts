import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippyLayoutDetail } from './index';

const tag = 'clippy-layout-detail';

/**
 * clippy-layout-detail extends clippy-layout-overview so we don’t need to test the same things twice
 */
describe(`<${tag}>`, () => {
  let component: ClippyLayoutDetail;

  beforeEach(() => {
    document.body.innerHTML = `
      <${tag}></${tag}>
    `;
    component = document.querySelector(tag) as ClippyLayoutDetail;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Basic rendering', () => {
    it('renders', async () => {
      await component.updateComplete;
      await expect.element(component).toBeInTheDocument();
    });

    it('has the correct tag name', () => {
      expect(component.tagName.toLowerCase()).toBe(tag);
    });
  });
});
