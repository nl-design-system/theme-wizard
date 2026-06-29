import { describe, expect, it } from 'vitest';
import './index';
import type { ClippyCardRadioOption } from './index';

const tag = 'clippy-card-radio-option';

async function setup(html: string) {
  document.body.innerHTML = html;
  const option = document.querySelector(tag) as ClippyCardRadioOption;
  await option.updateComplete;
  return option;
}

describe(`<${tag}>`, () => {
  describe('rendering', () => {
    it('renders a hidden radio input', async () => {
      const option = await setup(`<${tag} value="light" name="theme">Light</${tag}>`);
      const input = option.shadowRoot!.querySelector('input[type="radio"]');
      expect(input).toBeTruthy();
    });

    it('input has correct name attribute', async () => {
      const option = await setup(`<${tag} value="dark" name="color">Dark</${tag}>`);
      const input = option.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.name).toBe('color');
    });

    it('input has correct value attribute', async () => {
      const option = await setup(`<${tag} value="dark" name="color">Dark</${tag}>`);
      const input = option.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('dark');
    });

    it('renders a label element', async () => {
      const option = await setup(`<${tag}>Label</${tag}>`);
      const label = option.shadowRoot!.querySelector('label');
      expect(label).toBeTruthy();
    });

    it('label is associated with the input via for/id', async () => {
      const option = await setup(`<${tag}>Label</${tag}>`);
      const input = option.shadowRoot!.querySelector('input') as HTMLInputElement;
      const label = option.shadowRoot!.querySelector('label') as HTMLLabelElement;
      expect(label.htmlFor).toBe(input.id);
    });
  });

  describe('slots', () => {
    it('default slot renders inside label', async () => {
      const option = await setup(`<${tag}>My Label</${tag}>`);
      const labelSlot = option.shadowRoot!.querySelector('label slot:not([name])');
      expect(labelSlot).toBeTruthy();
    });

    it('description slot is present', async () => {
      const option = await setup(`<${tag}>Label</${tag}>`);
      const descSlot = option.shadowRoot!.querySelector('slot[name="description"]');
      expect(descSlot).toBeTruthy();
    });

    it('description slot is linked via aria-describedby', async () => {
      const option = await setup(`<${tag}>Label</${tag}>`);
      const input = option.shadowRoot!.querySelector('input') as HTMLInputElement;
      const describedBy = input.getAttribute('aria-describedby') ?? '';
      expect(describedBy).toBeTruthy();
      const descContainer = option.shadowRoot!.getElementById(describedBy);
      expect(descContainer).toBeTruthy();
      expect(descContainer!.querySelector('slot[name="description"]')).toBeTruthy();
    });

    it('body slot is present', async () => {
      const option = await setup(`<${tag}>Label</${tag}>`);
      const bodySlot = option.shadowRoot!.querySelector('slot[name="body"]');
      expect(bodySlot).toBeTruthy();
    });

    it('footer slot is present', async () => {
      const option = await setup(`<${tag}>Label</${tag}>`);
      const footerSlot = option.shadowRoot!.querySelector('slot[name="footer"]');
      expect(footerSlot).toBeTruthy();
    });

    it('start slot absent: no --with-start class on header', async () => {
      const option = await setup(`<${tag}>Label</${tag}>`);
      await option.updateComplete;
      const header = option.shadowRoot!.querySelector('.clippy-card-radio-option__header');
      expect(header!.classList.contains('clippy-card-radio-option__header--with-start')).toBe(false);
    });

    it('start slot filled: adds --with-start class on header', async () => {
      const option = await setup(`
        <${tag}>
          <img slot="start" src="icon.png" alt="" />
          Label
        </${tag}>
      `);
      await option.updateComplete;
      const header = option.shadowRoot!.querySelector('.clippy-card-radio-option__header');
      expect(header!.classList.contains('clippy-card-radio-option__header--with-start')).toBe(true);
    });

    it('start slot filled: start content wrapped in span', async () => {
      const option = await setup(`
        <${tag}>
          <img slot="start" src="icon.png" alt="" />
          Label
        </${tag}>
      `);
      await option.updateComplete;
      const startSpan = option.shadowRoot!.querySelector('.clippy-card-radio-option__start');
      expect(startSpan).toBeTruthy();
    });

    it('start slot empty: no start span rendered', async () => {
      const option = await setup(`<${tag}>Label</${tag}>`);
      const startSpan = option.shadowRoot!.querySelector('.clippy-card-radio-option__start');
      expect(startSpan).toBeNull();
    });
  });

  describe('checked state', () => {
    it('unchecked by default', async () => {
      const option = await setup(`<${tag}>Label</${tag}>`);
      expect(option.checked).toBe(false);
    });

    it('checked attribute sets initial state', async () => {
      const option = await setup(`<${tag} checked>Label</${tag}>`);
      expect(option.checked).toBe(true);
    });

    it('checked reflects as attribute', async () => {
      const option = await setup(`<${tag}>Label</${tag}>`);
      option.checked = true;
      await option.updateComplete;
      expect(option.hasAttribute('checked')).toBe(true);
    });

    it('unchecked removes attribute', async () => {
      const option = await setup(`<${tag} checked>Label</${tag}>`);
      option.checked = false;
      await option.updateComplete;
      expect(option.hasAttribute('checked')).toBe(false);
    });

    it('input checked state matches property', async () => {
      const option = await setup(`<${tag} checked>Label</${tag}>`);
      const input = option.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.checked).toBe(true);
    });
  });

  describe('change event', () => {
    it('clicking input fires change event on the option element', async () => {
      const option = await setup(`<${tag} value="light" name="theme">Light</${tag}>`);
      let fired = false;
      option.addEventListener('change', () => {
        fired = true;
      });
      option.shadowRoot!.querySelector('input')!.click();
      expect(fired).toBe(true);
    });

    it('change event bubbles', async () => {
      const option = await setup(`<${tag} value="light" name="theme">Light</${tag}>`);
      const events: Event[] = [];
      document.addEventListener('change', (e) => events.push(e), { once: true });
      option.shadowRoot!.querySelector('input')!.click();
      expect(events[0]?.bubbles).toBe(true);
    });

    it('change event is composed', async () => {
      const option = await setup(`<${tag} value="light" name="theme">Light</${tag}>`);
      const events: Event[] = [];
      option.addEventListener('change', (e) => events.push(e), { once: true });
      option.shadowRoot!.querySelector('input')!.click();
      expect(events[0]?.composed).toBe(true);
    });

    it('clicking input sets checked=true', async () => {
      const option = await setup(`<${tag} value="light" name="theme">Light</${tag}>`);
      option.shadowRoot!.querySelector('input')!.click();
      expect(option.checked).toBe(true);
    });
  });

  describe('tabindex', () => {
    it('input tabindex defaults to -1', async () => {
      const option = await setup(`<${tag}>Label</${tag}>`);
      const input = option.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.tabIndex).toBe(-1);
    });

    it('inputTabIndex=0 sets input tabindex to 0', async () => {
      const option = await setup(`<${tag}>Label</${tag}>`);
      option.inputTabIndex = 0;
      await option.updateComplete;
      const input = option.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.tabIndex).toBe(0);
    });

    it('inputTabIndex=-1 keeps input out of tab order', async () => {
      const option = await setup(`<${tag}>Label</${tag}>`);
      option.inputTabIndex = -1;
      await option.updateComplete;
      const input = option.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.tabIndex).toBe(-1);
    });
  });

  describe('focusInput()', () => {
    it('focusInput() makes option match :focus-within', async () => {
      const option = await setup(`<${tag}>Label</${tag}>`);
      option.inputTabIndex = 0;
      await option.updateComplete;
      option.focusInput();
      expect(option.matches(':focus-within')).toBe(true);
    });
  });
});
