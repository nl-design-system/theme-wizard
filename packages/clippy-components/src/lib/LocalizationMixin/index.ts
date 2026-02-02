import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Constructor<T> = new (...args: any[]) => T;

const DEFAULT_LANG = 'en' as const;

/**
 * Proper typing dictates some specific patterns as defined in Lit documentation.
 * @see https://lit.dev/docs/composition/mixins/#mixins-in-typescript
 */
declare class LocalizationMixinInterface {
  static readonly DEFAULT_LANG: string;
  get DEFAULT_LANG(): typeof LocalizationMixinInterface.DEFAULT_LANG;
  get lang(): string;
  set lang(value: string);
}

/**
 * Ensures that the component has a `lang` property that can be used for other functionality.
 * On connection, it attempts to determine the language by checking:
 *   1. The component's `lang` attribute.
 *   2. The closest ancestor element with a `lang` attribute.
 *   3. `DEFAULT_LANG`.
 *
 * The `lang` property is decorated with `@property()` for Lit reactivity.
 *
 * @template T - The base class type, which must extend LitElement.
 * @param superClass - The base class to extend.
 * @param defaultLang - The default language (`en` when no value supplied).
 * @returns A new class extending the base class with localization capabilities.
 */
const LocalizationMixin = <T extends Constructor<LitElement>>(superClass: T, defaultLang = DEFAULT_LANG) => {
  class LocalizationMixinClass extends superClass {
    static readonly DEFAULT_LANG = defaultLang; // Static because not dependent on the instance
    #lang?: string;

    get DEFAULT_LANG() {
      return LocalizationMixinClass.DEFAULT_LANG; // Convenience method to abstract the exact class on which the static lives.
    }

    @property()
    override get lang() {
      return this.#lang || this.DEFAULT_LANG;
    }

    override set lang(value: string) {
      if (value && this.#lang !== value) {
        this.#lang = value;
      }
    }

    override connectedCallback(): void {
      super.connectedCallback();
      const LANG_ATTR = 'lang';
      let lang = this.#lang || this.getAttribute(LANG_ATTR);
      if (!lang) {
        // Look for closest ancestor with lang attribute if lang is not set on this component
        let element = this.parentElement;
        while (element) {
          if (element.hasAttribute(LANG_ATTR)) {
            lang = element.getAttribute(LANG_ATTR) || lang;
            break;
          }
          element = element.parentElement;
        }
      }
      this.lang = lang || this.DEFAULT_LANG;
    }
  }

  // Explicit type union is necessary here.
  return LocalizationMixinClass as Constructor<LocalizationMixinInterface> & T;
};

export default LocalizationMixin;
