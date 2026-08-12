import { beforeEach, describe, expect, it } from 'vitest';
import type { ClippyTokenDetail } from './index';
import './index';

const tag = 'clippy-token-detail';

describe(`<${tag}>`, () => {
  let component: ClippyTokenDetail;

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippyTokenDetail;
  });

  it('renders a dialog', async () => {
    await component.updateComplete;

    await expect.element(component).toBeInTheDocument();
  });
});
