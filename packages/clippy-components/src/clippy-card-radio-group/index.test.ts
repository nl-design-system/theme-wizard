import { describe, expect, it } from 'vitest';
import '../clippy-card-radio-option/index';
import './index';
import type { ClippyCardRadioOption } from '../clippy-card-radio-option/index';
import type { ClippyCardRadioGroup } from './index';

const groupTag = 'clippy-card-radio-group';
const optionTag = 'clippy-card-radio-option';

function getGroup() {
  return document.querySelector(groupTag) as ClippyCardRadioGroup;
}

function getOptions() {
  return Array.from(document.querySelectorAll(optionTag)) as ClippyCardRadioOption[];
}

async function setup(html: string) {
  document.body.innerHTML = html;
  const group = getGroup();
  await group.updateComplete;
  const options = getOptions();
  for (const option of options) {
    await option.updateComplete;
  }
  return { group, options };
}

const defaultHtml = `
  <${groupTag} name="theme">
    <${optionTag} value="light">Light</${optionTag}>
    <${optionTag} value="dark">Dark</${optionTag}>
    <${optionTag} value="system">System</${optionTag}>
  </${groupTag}>
`;

describe(`<${groupTag}>`, () => {
  describe('accessibility', () => {
    it('has role="radiogroup"', async () => {
      const { group } = await setup(defaultHtml);
      expect(group.internals_.role).toBe('radiogroup');
    });
  });

  describe('name propagation', () => {
    it('propagates name attribute to all child options', async () => {
      const { options } = await setup(defaultHtml);
      for (const option of options) {
        expect(option.name).toBe('theme');
      }
    });

    it('propagates updated name to all children', async () => {
      const { group, options } = await setup(defaultHtml);
      group.name = 'color';
      await group.updateComplete;
      for (const option of options) {
        expect(option.name).toBe('color');
      }
    });

    it('propagates name to children added via slot', async () => {
      const { group } = await setup(defaultHtml);
      const newOption = document.createElement(optionTag) as ClippyCardRadioOption;
      newOption.value = 'custom';
      group.appendChild(newOption);
      await newOption.updateComplete;
      await group.updateComplete;
      expect(newOption.name).toBe('theme');
    });
  });

  describe('selection via user interaction', () => {
    it('clicking an option sets group value', async () => {
      const { group, options } = await setup(defaultHtml);
      options[1].shadowRoot!.querySelector('input')!.click();
      await group.updateComplete;
      expect(group.value).toBe('dark');
    });

    it('clicking an option checks that option', async () => {
      const { group, options } = await setup(defaultHtml);
      options[2].shadowRoot!.querySelector('input')!.click();
      await group.updateComplete;
      expect(options[2].checked).toBe(true);
    });

    it('clicking an option unchecks all others', async () => {
      const { group, options } = await setup(defaultHtml);
      options[1].shadowRoot!.querySelector('input')!.click();
      await group.updateComplete;
      expect(options[0].checked).toBe(false);
      expect(options[1].checked).toBe(true);
      expect(options[2].checked).toBe(false);
    });

    it('switching selection moves checked to new option', async () => {
      const { group, options } = await setup(defaultHtml);
      options[0].shadowRoot!.querySelector('input')!.click();
      await group.updateComplete;
      options[2].shadowRoot!.querySelector('input')!.click();
      await group.updateComplete;
      expect(options[0].checked).toBe(false);
      expect(options[2].checked).toBe(true);
    });
  });

  describe('programmatic value', () => {
    it('setting value checks the matching option', async () => {
      const { group, options } = await setup(defaultHtml);
      group.value = 'system';
      await group.updateComplete;
      expect(options[2].checked).toBe(true);
    });

    it('setting value unchecks non-matching options', async () => {
      const { group, options } = await setup(defaultHtml);
      group.value = 'dark';
      await group.updateComplete;
      expect(options[0].checked).toBe(false);
      expect(options[2].checked).toBe(false);
    });

    it('setting value to unrecognised string leaves selection unchanged', async () => {
      const { group, options } = await setup(defaultHtml);
      group.value = 'neon';
      await group.updateComplete;
      for (const option of options) {
        expect(option.checked).toBe(false);
      }
    });
  });

  describe('roving tabindex', () => {
    it('first option has tabindex=0 when nothing is checked', async () => {
      const { options } = await setup(defaultHtml);
      expect(options[0].inputTabIndex).toBe(0);
      expect(options[1].inputTabIndex).toBe(-1);
      expect(options[2].inputTabIndex).toBe(-1);
    });

    it('checked option gets tabindex=0, others get -1', async () => {
      const { group, options } = await setup(defaultHtml);
      group.value = 'dark';
      await group.updateComplete;
      expect(options[0].inputTabIndex).toBe(-1);
      expect(options[1].inputTabIndex).toBe(0);
      expect(options[2].inputTabIndex).toBe(-1);
    });

    it('tabindex follows selection change', async () => {
      const { group, options } = await setup(defaultHtml);
      group.value = 'light';
      await group.updateComplete;
      expect(options[0].inputTabIndex).toBe(0);

      group.value = 'system';
      await group.updateComplete;
      expect(options[0].inputTabIndex).toBe(-1);
      expect(options[2].inputTabIndex).toBe(0);
    });
  });

  describe('keyboard navigation', () => {
    it('ArrowDown selects next option', async () => {
      const { group, options } = await setup(defaultHtml);
      options[0].focusInput();
      group.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
      expect(options[1].checked).toBe(true);
      expect(group.value).toBe('dark');
    });

    it('ArrowRight selects next option', async () => {
      const { group, options } = await setup(defaultHtml);
      options[0].focusInput();
      group.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
      expect(options[1].checked).toBe(true);
      expect(group.value).toBe('dark');
    });

    it('ArrowUp selects previous option', async () => {
      const { group, options } = await setup(defaultHtml);
      options[1].focusInput();
      group.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp' }));
      expect(options[0].checked).toBe(true);
      expect(group.value).toBe('light');
    });

    it('ArrowLeft selects previous option', async () => {
      const { group, options } = await setup(defaultHtml);
      options[2].focusInput();
      group.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowLeft' }));
      expect(options[1].checked).toBe(true);
      expect(group.value).toBe('dark');
    });

    it('ArrowDown wraps from last to first', async () => {
      const { group, options } = await setup(defaultHtml);
      options[2].focusInput();
      group.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
      expect(options[0].checked).toBe(true);
    });

    it('ArrowUp wraps from first to last', async () => {
      const { group, options } = await setup(defaultHtml);
      options[0].focusInput();
      group.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp' }));
      expect(options[2].checked).toBe(true);
    });

    it('arrow keys prevent default to stop page scroll', async () => {
      const { group, options } = await setup(defaultHtml);
      options[0].focusInput();
      const event = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'ArrowDown',
      });
      group.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('non-arrow keys do not change selection', async () => {
      const { group, options } = await setup(defaultHtml);
      options[0].focusInput();
      group.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
      for (const option of options) {
        expect(option.checked).toBe(false);
      }
    });

    it('arrow keys do nothing when no option is focused', async () => {
      const { group, options } = await setup(defaultHtml);
      group.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
      for (const option of options) {
        expect(option.checked).toBe(false);
      }
    });

    it('ArrowDown moves focus to next option', async () => {
      const { group, options } = await setup(defaultHtml);
      options[0].focusInput();
      group.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
      expect(options[1].matches(':focus-within')).toBe(true);
    });
  });

  describe('form integration', () => {
    it('submits selected value under the group name', async () => {
      document.body.innerHTML = `
        <form>
          <${groupTag} name="theme">
            <${optionTag} value="light">Light</${optionTag}>
            <${optionTag} value="dark">Dark</${optionTag}>
          </${groupTag}>
        </form>
      `;
      const group = document.querySelector(groupTag) as ClippyCardRadioGroup;
      await group.updateComplete;
      for (const option of getOptions()) {
        await option.updateComplete;
      }

      group.value = 'dark';
      await group.updateComplete;

      const form = document.querySelector('form')!;
      const data = new FormData(form);
      expect(data.get('theme')).toBe('dark');
    });

    it('form value updates when selection changes', async () => {
      document.body.innerHTML = `
        <form>
          <${groupTag} name="color">
            <${optionTag} value="red">Red</${optionTag}>
            <${optionTag} value="blue">Blue</${optionTag}>
          </${groupTag}>
        </form>
      `;
      const group = document.querySelector(groupTag) as ClippyCardRadioGroup;
      await group.updateComplete;
      for (const option of getOptions()) {
        await option.updateComplete;
      }

      group.value = 'red';
      await group.updateComplete;
      expect(new FormData(document.querySelector('form')!).get('color')).toBe('red');

      group.value = 'blue';
      await group.updateComplete;
      expect(new FormData(document.querySelector('form')!).get('color')).toBe('blue');
    });

    it('submits no value when nothing is selected', async () => {
      document.body.innerHTML = `
        <form>
          <${groupTag} name="theme">
            <${optionTag} value="light">Light</${optionTag}>
          </${groupTag}>
        </form>
      `;
      const group = document.querySelector(groupTag) as ClippyCardRadioGroup;
      await group.updateComplete;
      const form = document.querySelector('form')!;
      const data = new FormData(form);
      expect(data.get('theme')).toBeNull();
    });

    it('is associated with the parent form', async () => {
      document.body.innerHTML = `
        <form>
          <${groupTag} name="theme">
            <${optionTag} value="light">Light</${optionTag}>
          </${groupTag}>
        </form>
      `;
      const group = document.querySelector(groupTag) as ClippyCardRadioGroup;
      await group.updateComplete;
      expect(group.form).toBe(document.querySelector('form'));
    });
  });
});
