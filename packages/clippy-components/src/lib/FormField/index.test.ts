import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { FormField } from './index';

const tag = 'form-field';

document.body.innerHTML = `
  <form>
    <${tag} name="${tag}"></${tag}>
  </form>
`;

describe(`FormField`, () => {
  beforeAll(() => {
    // FormField is meant as a base class,
    // therefore it is not exported with a function to define it as a Custom Element.
    customElements.define(tag, FormField);
  });

  beforeEach(() => {
    document.body.innerHTML = `
    <form>
      <${tag} name="${tag}" value="${tag}"></${tag}>
    </form>`;
  });

  it('shows up as a form element', async () => {
    const component: FormField = document.querySelector(tag)!;
    const form: HTMLFormElement = document.querySelector('form')!;
    expect(form.elements).toContain(component);
  });

  it('sets a value from attribute', async () => {
    const form: HTMLFormElement = document.querySelector('form')!;
    const formData = new FormData(form);
    expect(formData.get(tag)).toContain(tag);
  });

  it('holds a form value', async () => {
    const value = 'changed';
    const component: FormField = document.querySelector(tag)!;
    component.value = value;
    const form: HTMLFormElement = document.querySelector('form')!;
    const formData = new FormData(form);
    expect(formData.get(tag)).toContain(value);
  });
});
