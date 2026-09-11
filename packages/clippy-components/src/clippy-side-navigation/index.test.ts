import './index';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { ClippySideNavigation } from './index';

const tag = 'clippy-side-navigation';

describe(`<${tag}>`, () => {
  let component: ClippySideNavigation;

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippySideNavigation;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders', async () => {
    await component.updateComplete;
    await expect.element(component).toBeInTheDocument();
  });
});
