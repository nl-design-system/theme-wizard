import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippyLayout } from './index';

const tag = 'clippy-layout';

describe(`<${tag}>`, () => {
  let component: ClippyLayout;

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippyLayout;
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
