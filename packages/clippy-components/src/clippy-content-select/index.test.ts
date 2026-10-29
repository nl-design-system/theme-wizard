import { describe, expect, it, afterEach, beforeEach, vi } from 'vitest';
import { page } from 'vitest/browser';
import { ClippyContentSelect } from './index';
import './index';

const tag = 'clippy-content-select';

describe(`<${tag}>`, () => {
  let component: ClippyContentSelect;

  beforeEach(() => {
    document.body.innerHTML = `<${tag}></${tag}>`;
    component = document.querySelector(tag) as ClippyContentSelect;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Basic rendering', () => {
    it('renders', async () => {
      await component.updateComplete;
      await expect.element(component).toBeInTheDocument();
    });

    it('renders select with label and navigation buttons', async () => {
      await component.updateComplete;

      const select = page.getByRole('combobox');
      await expect.element(select).toBeInTheDocument();

      const prevButton = page.getByRole('button', { name: 'Vorige' });
      const nextButton = page.getByRole('button', { name: 'Volgende' });
      await expect.element(prevButton).toBeInTheDocument();
      await expect.element(nextButton).toBeInTheDocument();
    });

    it('renders preview with clippy-html-image', async () => {
      await component.updateComplete;
      const preview = component.shadowRoot?.querySelector('.clippy-content-select__preview');
      const htmlImage = preview?.querySelector('clippy-html-image');
      expect(preview).toBeTruthy();
      expect(htmlImage).toBeTruthy();
    });
  });

  describe('Properties', () => {
    describe('options', () => {
      it('renders options as select options', async () => {
        const testOptions = [
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' },
        ];
        component.options = testOptions;
        await component.updateComplete;

        const select = component.shadowRoot?.querySelector('select') as HTMLSelectElement;
        const options = select.querySelectorAll('option');
        expect(options.length).toBe(testOptions.length);

        options.forEach((option, index) => {
          expect(option.value).toBe(testOptions[index].value as string);
          expect(option.text).toBe(testOptions[index].label);
        });
      });

      it('accepts string array as options', async () => {
        const stringOptions = ['string1', 'string2'];
        component.options = stringOptions;
        await component.updateComplete;

        const select = component.shadowRoot?.querySelector('select') as HTMLSelectElement;
        const options = select.querySelectorAll('option');
        expect(options.length).toBe(stringOptions.length);

        options.forEach((option, index) => {
          expect(option.value).toBe(stringOptions[index]);
          expect(option.text).toBe(stringOptions[index]);
        });
      });

      it('getter returns options array', async () => {
        component.options = [
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' },
        ];
        await component.updateComplete;
        expect(component.options).toHaveLength(2);
        expect(component.options[0].label).toBe('Option 1');
        expect(component.options[1].value).toBe('opt2');
      });
    });

    describe('value', () => {
      it('sets selected option when value matches', async () => {
        component.options = [
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' },
        ];
        component.value = 'opt2';
        await component.updateComplete;

        const select = component.shadowRoot?.querySelector('select') as HTMLSelectElement;
        expect(select.value).toBe('opt2');
      });

      it('returns current value', async () => {
        component.options = [
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' },
        ];
        component.value = 'opt1';
        await component.updateComplete;
        expect(component.value).toBe('opt1');
      });

      it('returns null when no value is set', async () => {
        component.options = [{ label: 'Option 1', value: 'opt1' }];
        await component.updateComplete;
        expect(component.value).toBeNull();
      });
    });

    describe('name', () => {
      it('sets name attribute on select', async () => {
        component.name = 'test-select';
        await component.updateComplete;

        const select = component.shadowRoot?.querySelector('select') as HTMLSelectElement;
        expect(select.name).toBe('test-select');
      });

      it('sets id attribute on select', async () => {
        component.name = 'test-select';
        await component.updateComplete;

        const select = component.shadowRoot?.querySelector('select') as HTMLSelectElement;
        expect(select.id).toBe('clippy-content-select-test-select');
      });
    });

    describe('hiddenLabel', () => {
      it('renders hidden label in label slot', async () => {
        component.hiddenLabel = 'Hidden Label';
        await component.updateComplete;

        const label = component.shadowRoot?.querySelector('label');
        expect(label?.textContent?.trim()).toBe('Hidden Label');
        expect(label?.classList.contains('sr-only')).toBe(true);
      });
    });

    describe('labelPrevious and labelNext', () => {
      it('renders custom previous button label', async () => {
        component.labelPrevious = 'Previous';
        await component.updateComplete;

        const prevButton = component.shadowRoot?.querySelector('.clippy-content-select__control-button-previous');
        expect(prevButton?.textContent?.trim()).toBe('Previous');
      });

      it('renders custom next button label', async () => {
        component.labelNext = 'Next';
        await component.updateComplete;

        const nextButton = component.shadowRoot?.querySelector('.clippy-content-select__control-button-next');
        expect(nextButton?.textContent?.trim()).toBe('Next');
      });

      it('uses default labels', async () => {
        await component.updateComplete;

        const prevButton = component.shadowRoot?.querySelector('.clippy-content-select__control-button-previous');
        const nextButton = component.shadowRoot?.querySelector('.clippy-content-select__control-button-next');
        expect(prevButton?.textContent?.trim()).toBe('Vorige');
        expect(nextButton?.textContent?.trim()).toBe('Volgende');
      });
    });
  });

  describe('Methods', () => {
    describe('getOptionForValue', () => {
      beforeEach(async () => {
        component.options = [
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' },
        ];
        await component.updateComplete;
      });

      it('returns matching option for value', () => {
        const option = component.getOptionForValue('opt1');
        expect(option).toEqual({ label: 'Option 1', value: 'opt1' });
      });

      it('returns undefined for non-matching value', () => {
        const option = component.getOptionForValue('non-existent');
        expect(option).toBeUndefined();
      });

      it('returns undefined for null value', () => {
        const option = component.getOptionForValue(null);
        expect(option).toBeUndefined();
      });
    });
  });

  describe('Events', () => {
    beforeEach(async () => {
      component.options = [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' },
        { label: 'Option 3', value: 'opt3' },
      ];
      await component.updateComplete;
    });

    it('emits change and input events when select value changes', async () => {
      const changeHandler = vi.fn();
      const inputHandler = vi.fn();
      component.addEventListener('change', changeHandler);
      component.addEventListener('input', inputHandler);

      const select = component.shadowRoot?.querySelector('select') as HTMLSelectElement;
      select.value = 'opt2';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      await component.updateComplete;

      expect(changeHandler).toHaveBeenCalled();
      expect(inputHandler).toHaveBeenCalled();
      expect(component.value).toBe('opt2');
    });

    it('emits blur event when select loses focus', async () => {
      const blurHandler = vi.fn();
      component.addEventListener('blur', blurHandler);

      const select = component.shadowRoot?.querySelector('select') as HTMLSelectElement;
      select.dispatchEvent(new Event('blur', { bubbles: true }));

      expect(blurHandler).toHaveBeenCalled();
    });

    it('emits focus event when select gains focus', async () => {
      const focusHandler = vi.fn();
      component.addEventListener('focus', focusHandler);

      const select = component.shadowRoot?.querySelector('select') as HTMLSelectElement;
      select.dispatchEvent(new Event('focus', { bubbles: true }));

      expect(focusHandler).toHaveBeenCalled();
    });

    it('sets value to null when option is not found', async () => {
      const changeHandler = vi.fn();
      component.addEventListener('change', changeHandler);

      const select = component.shadowRoot?.querySelector('select') as HTMLSelectElement;
      select.value = 'non-existent';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      await component.updateComplete;

      expect(component.value).toBeNull();
    });
  });

  describe('Navigation buttons', () => {
    beforeEach(async () => {
      component.options = [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' },
        { label: 'Option 3', value: 'opt3' },
      ];
      component.value = 'opt2';
      await component.updateComplete;
    });

    it('previous button selects previous option', async () => {
      const prevButton = component.shadowRoot?.querySelector(
        '.clippy-content-select__control-button-previous',
      ) as HTMLElement;
      prevButton.click();
      await component.updateComplete;

      expect(component.value).toBe('opt1');
    });

    it('next button selects next option', async () => {
      const nextButton = component.shadowRoot?.querySelector(
        '.clippy-content-select__control-button-next',
      ) as HTMLElement;
      nextButton.click();
      await component.updateComplete;

      expect(component.value).toBe('opt3');
    });

    it('previous button wraps to last option when on first', async () => {
      component.value = 'opt1';
      await component.updateComplete;

      const prevButton = component.shadowRoot?.querySelector(
        '.clippy-content-select__control-button-previous',
      ) as HTMLElement;
      prevButton.click();
      await component.updateComplete;

      expect(component.value).toBe('opt3');
    });

    it('next button wraps to first option when on last', async () => {
      component.value = 'opt3';
      await component.updateComplete;

      const nextButton = component.shadowRoot?.querySelector(
        '.clippy-content-select__control-button-next',
      ) as HTMLElement;
      nextButton.click();
      await component.updateComplete;

      expect(component.value).toBe('opt1');
    });

    it('navigation buttons do nothing when no options', async () => {
      component.options = [];
      component.value = null;
      await component.updateComplete;

      const prevButton = component.shadowRoot?.querySelector(
        '.clippy-content-select__control-button-previous',
      ) as HTMLElement;
      const nextButton = component.shadowRoot?.querySelector(
        '.clippy-content-select__control-button-next',
      ) as HTMLElement;

      prevButton.click();
      nextButton.click();
      await component.updateComplete;

      expect(component.value).toBeNull();
    });
  });

  describe('Accessibility', () => {
    beforeEach(async () => {
      component.name = 'test-select';
      component.options = [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' },
      ];
      await component.updateComplete;
    });

    it('has label associated with select', async () => {
      const select = component.shadowRoot?.querySelector('select') as HTMLSelectElement;
      const label = component.shadowRoot?.querySelector('label') as HTMLLabelElement;
      expect(label.htmlFor).toBe(select.id);
    });

    it('select has aria-controls pointing to preview', async () => {
      const select = component.shadowRoot?.querySelector('select') as HTMLSelectElement;
      const preview = component.shadowRoot?.querySelector('.clippy-content-select__preview') as HTMLElement;
      expect(select.getAttribute('aria-controls')).toBe(preview.id);
    });

    it('buttons have controls attribute pointing to select', async () => {
      const prevButton = component.shadowRoot?.querySelector(
        '.clippy-content-select__control-button-previous',
      ) as HTMLElement;
      const nextButton = component.shadowRoot?.querySelector(
        '.clippy-content-select__control-button-next',
      ) as HTMLElement;
      const select = component.shadowRoot?.querySelector('select') as HTMLSelectElement;

      expect(prevButton.getAttribute('controls')).toBe(select.id);
      expect(nextButton.getAttribute('controls')).toBe(select.id);
    });

    it('label slot content is visible', async () => {
      document.body.innerHTML = `
        <${tag} name="test">
          <span slot="label">Custom Label</span>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyContentSelect;
      component.options = [{ label: 'Option 1', value: 'opt1' }];
      await component.updateComplete;

      const label = component.shadowRoot?.querySelector('label');
      const slot = label?.querySelector('slot[name="label"]') as HTMLSlotElement;
      expect(slot).toBeTruthy();

      const assignedNodes = slot?.assignedNodes();
      expect(assignedNodes).toHaveLength(1);
      expect(assignedNodes?.[0].textContent).toBe('Custom Label');
    });

    it('label is screen reader only when no label slot content', async () => {
      component.hiddenLabel = '';
      document.body.innerHTML = `<${tag} name="test"></${tag}>`;
      component = document.querySelector(tag) as ClippyContentSelect;
      component.options = [{ label: 'Option 1', value: 'opt1' }];
      await component.updateComplete;

      const label = component.shadowRoot?.querySelector('label');
      expect(label?.classList.contains('sr-only')).toBe(true);
    });

    it('label is visible when label slot has content', async () => {
      document.body.innerHTML = `
        <${tag} name="test">
          <span slot="label">Custom Label</span>
        </${tag}>
      `;
      component = document.querySelector(tag) as ClippyContentSelect;
      component.options = [{ label: 'Option 1', value: 'opt1' }];
      await component.updateComplete;

      const label = component.shadowRoot?.querySelector('label');
      expect(label?.classList.contains('sr-only')).toBe(false);
    });
  });

  describe('Form integration', () => {
    it('is form associated', async () => {
      document.body.innerHTML = `
        <form>
          <${tag} name="theme"></${tag}>
        </form>
      `;
      component = document.querySelector(tag) as ClippyContentSelect;
      component.options = [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' },
      ];
      await component.updateComplete;

      expect(component.form).toBe(document.querySelector('form'));
    });

    it('submits selected value with form', async () => {
      document.body.innerHTML = `
        <form>
          <${tag} name="theme"></${tag}>
        </form>
      `;
      component = document.querySelector(tag) as ClippyContentSelect;
      component.options = [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' },
      ];
      component.value = 'opt2';
      await component.updateComplete;

      const form = document.querySelector('form')!;
      const data = new FormData(form);
      expect(data.get('theme')).toBe('opt2');
    });

    it('submits null when no value selected', async () => {
      document.body.innerHTML = `
        <form>
          <${tag} name="theme"></${tag}>
        </form>
      `;
      component = document.querySelector(tag) as ClippyContentSelect;
      component.options = [{ label: 'Option 1', value: 'opt1' }];
      await component.updateComplete;

      const form = document.querySelector('form')!;
      const data = new FormData(form);
      expect(data.get('theme')).toBeNull();
    });

    it('updates form value when selection changes', async () => {
      document.body.innerHTML = `
        <form>
          <${tag} name="theme"></${tag}>
        </form>
      `;
      component = document.querySelector(tag) as ClippyContentSelect;
      component.options = [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' },
      ];
      component.value = 'opt1';
      await component.updateComplete;

      const form = document.querySelector('form')!;
      expect(new FormData(form).get('theme')).toBe('opt1');

      component.value = 'opt2';
      await component.updateComplete;

      expect(new FormData(form).get('theme')).toBe('opt2');
    });
  });

  describe('Slots', () => {
    it('renders content in preview slot', async () => {
      document.body.innerHTML = `
        <${tag} name="test"><img src="test.png" alt="Preview image" /></${tag}>
      `;
      component = document.querySelector(tag) as ClippyContentSelect;
      component.options = [{ label: 'Option 1', value: 'opt1' }];
      await component.updateComplete;

      const htmlImage = component.shadowRoot?.querySelector('clippy-html-image');
      const slot = htmlImage?.querySelector('slot') as HTMLSlotElement;
      expect(slot).toBeTruthy();

      const assignedNodes = slot?.assignedNodes();
      expect(assignedNodes).toHaveLength(1);
      expect((assignedNodes?.[0] as HTMLElement).tagName).toBe('IMG');
    });

    it('preview has correct id', async () => {
      component.name = 'test-select';
      await component.updateComplete;

      const preview = component.shadowRoot?.querySelector('.clippy-content-select__preview') as HTMLElement;
      expect(preview.id).toBe('clippy-content-select-test-select-preview');
    });
  });

  describe('Disabled state', () => {
    it('disables select when disabled property is true', async () => {
      component.disabled = true;
      await component.updateComplete;

      const select = component.shadowRoot?.querySelector('select') as HTMLSelectElement;
      expect(select.disabled).toBe(true);
    });

    it('does not disable select when disabled property is false', async () => {
      component.disabled = false;
      await component.updateComplete;

      const select = component.shadowRoot?.querySelector('select') as HTMLSelectElement;
      expect(select.disabled).toBe(false);
    });
  });
});
