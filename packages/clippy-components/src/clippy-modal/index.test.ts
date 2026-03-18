import { beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import type { ClippyModal } from './index';
import './index';

const tag = 'clippy-modal';

describe(`<${tag}>`, () => {
  let modal: ClippyModal;

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    modal = document.querySelector(tag) as ClippyModal;
  });

  it('renders a dialog', async () => {
    modal.title = 'Test Modal Title';
    await modal.updateComplete;
    modal.open();

    const dialog = page.getByRole('dialog', { name: 'Test Modal Title' });
    await expect.element(dialog).toBeInTheDocument();
  });

  describe('actions', () => {
    it('renders only cancel button by default', async () => {
      await modal.updateComplete;

      const footer = modal.shadowRoot?.querySelector('.ams-dialog__footer');
      const cancelButton = footer?.querySelector('button[value="cancel"]');
      const confirmButton = footer?.querySelector('button[value="confirm"]');

      expect(cancelButton).toBeDefined();
      expect(confirmButton).toBeNull();
    });

    it('renders no buttons when actions is "none"', async () => {
      modal.actions = 'none';
      await modal.updateComplete;

      const footer = modal.shadowRoot?.querySelector('.ams-dialog__footer');
      const buttons = footer?.querySelectorAll('button');

      expect(buttons?.length).toBe(0);
    });

    it('renders only cancel button when actions is "cancel"', async () => {
      modal.actions = 'cancel';
      await modal.updateComplete;

      const footer = modal.shadowRoot?.querySelector('.ams-dialog__footer');
      const cancelButton = footer?.querySelector('button[value="cancel"]');
      const confirmButton = footer?.querySelector('button[value="confirm"]');

      expect(cancelButton).toBeDefined();
      expect(confirmButton).toBeNull();
      expect(cancelButton?.textContent?.trim()).toBe('Cancel');
    });

    it('renders only confirm button when actions is "confirm"', async () => {
      modal.actions = 'confirm';
      await modal.updateComplete;

      const footer = modal.shadowRoot?.querySelector('.ams-dialog__footer');
      const cancelButton = footer?.querySelector('button[value="cancel"]');
      const confirmButton = footer?.querySelector('button[value="confirm"]');

      expect(cancelButton).toBeNull();
      expect(confirmButton).toBeDefined();
      expect(confirmButton?.textContent?.trim()).toBe('OK');
    });

    it('renders both buttons when actions is "both"', async () => {
      modal.actions = 'both';
      await modal.updateComplete;

      const footer = modal.shadowRoot?.querySelector('.ams-dialog__footer');
      const cancelButton = footer?.querySelector('button[value="cancel"]');
      const confirmButton = footer?.querySelector('button[value="confirm"]');

      expect(cancelButton).toBeDefined();
      expect(confirmButton).toBeDefined();
    });

    it('uses custom confirm label', async () => {
      modal.actions = 'confirm';
      modal['confirm-label'] = 'Do it!';
      await modal.updateComplete;

      const confirmButton = modal.shadowRoot?.querySelector('button[value="confirm"]');
      expect(confirmButton?.textContent?.trim()).toBe('Do it!');
    });

    it('uses custom cancel label', async () => {
      modal.actions = 'cancel';
      modal['cancel-label'] = "Don't do it!";
      await modal.updateComplete;

      const cancelButton = modal.shadowRoot?.querySelector('button[value="cancel"]');
      expect(cancelButton?.textContent?.trim()).toBe("Don't do it!");
    });
  });

  describe('close button', () => {
    it('renders a close button in the header', async () => {
      await modal.updateComplete;

      const header = modal.shadowRoot?.querySelector('.ams-dialog__header');
      const closeButton = header?.querySelector('clippy-button[icon-only]');

      expect(closeButton).toBeDefined();
      expect(closeButton?.getAttribute('purpose')).toBe('subtle');
    });
  });

  describe('dialog behavior', () => {
    it('dialog is closed by default', async () => {
      await modal.updateComplete;

      const dialog = modal.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
      expect(dialog?.open).toBe(false);
    });

    it('dialog can be opened', async () => {
      await modal.updateComplete;

      modal.open();

      const dialog = modal.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
      expect(dialog?.open).toBe(true);
    });

    it('dialog can be closed', async () => {
      await modal.updateComplete;

      modal.open();
      modal.close();

      const dialog = modal.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
      expect(dialog?.open).toBe(false);
    });

    it('close method sets return value', async () => {
      await modal.updateComplete;

      modal.open();
      modal.close('test-value');

      expect(modal.returnValue).toBe('test-value');
    });
  });
});
