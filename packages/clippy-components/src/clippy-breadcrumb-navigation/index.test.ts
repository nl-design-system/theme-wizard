import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippyBreadcrumbNavigation } from './index';

const tag = 'clippy-breadcrumb-navigation';

describe(`<${tag}>`, () => {
  let component: ClippyBreadcrumbNavigation;

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippyBreadcrumbNavigation;
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
