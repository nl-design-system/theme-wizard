import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippyLayoutMain } from './index';

const tag = 'clippy-layout-main';

describe(`<${tag}>`, () => {
  let component: ClippyLayoutMain;

  beforeEach(() => {
    document.body.innerHTML = `
      <${tag}></${tag}>
    `;
    component = document.querySelector(tag) as ClippyLayoutMain;
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
