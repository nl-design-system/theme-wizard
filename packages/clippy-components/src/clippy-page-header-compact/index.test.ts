import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippyPageHeaderCompact } from './index';

const tag = 'clippy-page-header-compact';

describe(`<${tag}>`, () => {
  let component: ClippyPageHeaderCompact;

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippyPageHeaderCompact;
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
