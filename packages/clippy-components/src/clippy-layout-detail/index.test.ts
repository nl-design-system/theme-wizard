import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippyLayoutDetail } from './index';

const tag = 'clippy-main-layout';

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
  });
});
