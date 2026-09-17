import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippyPageLayout } from './index';

const tag = 'clippy-page-layout';

describe(`<${tag}>`, () => {
  let component: ClippyPageLayout;

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippyPageLayout;
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
