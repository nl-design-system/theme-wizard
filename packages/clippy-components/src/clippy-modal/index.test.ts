import { beforeEach, describe, expect, it } from 'vitest';
import './index';

const tag = 'clippy-modal';

describe(`<${tag}>`, () => {
  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
  });

  it('renders a dialog', () => {
    // TODO: use page.getByRole('dialog')
    const dialog = document.querySelector('dialog');
    expect(dialog).toBeDefined();
  });
});
