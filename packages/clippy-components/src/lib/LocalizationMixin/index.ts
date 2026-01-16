import {LitElement} from 'lit';
import { property } from 'lit/decorators.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Constructor<T> = new (...args: any[]) => T;

const DEFAULT_LANG = 'en';

const LocalizationMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  class LocalizationMixinClass extends superClass {
    #lang?: string;

    @property()
    override get lang() {
      return this.#lang || DEFAULT_LANG;
    }

    override set lang(value: string) {
      if (value && this.#lang !== value) {
        this.#lang = value;
      }
    }

    override connectedCallback(): void {
      super.connectedCallback();
      // we need a language to use the correct translation, look for closest ancestor with lang attribute.
      const LANG_ATTR = 'lang';
      let lang = this.#lang || this.getAttribute(LANG_ATTR);
      if (!lang) {
        let element = this.parentElement;
        while (element) {
          if (element.hasAttribute(LANG_ATTR)) {
            lang = element.getAttribute(LANG_ATTR) || lang;
            break;
          }
          element = element.parentElement;
        }
      }
      this.lang = lang || DEFAULT_LANG;
    }
  };

  return LocalizationMixinClass as T;
}

export default LocalizationMixin;
