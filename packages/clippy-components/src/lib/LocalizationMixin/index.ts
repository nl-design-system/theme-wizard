import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * Proper typing dictates some specific patterns as defined in Lit documentation.
 * @see https://lit.dev/docs/composition/mixins/#mixins-in-typescript
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
type Constructor<T> = new (...args: any[]) => T;

const DEFAULT_LANG = 'en' as const;

declare class LocalizationMixinInterface {
  DEFAULT_LANG: typeof DEFAULT_LANG;
  get lang(): string;
  set lang(value: string);
}

const LocalizationMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  class LocalizationMixinClass extends superClass {
    DEFAULT_LANG = DEFAULT_LANG;
    #lang?: string;

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
