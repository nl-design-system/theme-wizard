import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippyMain } from './index';

const tag = 'clippy-main';

describe(`<${tag}>`, () => {
  let component: ClippyMain;

  beforeEach(() => {
    document.body.innerHTML = `
      <${tag}></${tag}>
    `;
    component = document.querySelector(tag) as ClippyMain;
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
