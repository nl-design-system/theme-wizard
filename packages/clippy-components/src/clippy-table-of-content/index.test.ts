import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippyTableOfContent } from './index';

const tag = 'clippy-table-of-content';

describe(`<${tag}>`, () => {
  let component: ClippyTableOfContent;

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippyTableOfContent;
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
