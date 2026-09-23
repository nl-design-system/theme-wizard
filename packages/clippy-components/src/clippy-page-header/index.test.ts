import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippyPageHeader } from './index';

const tag = 'clippy-page-header';

describe(`<${tag}>`, () => {
  let component: ClippyPageHeader;

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippyPageHeader;
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
