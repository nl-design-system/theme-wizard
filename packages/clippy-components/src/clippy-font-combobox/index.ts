import { safeCustomElement } from '@lib/decorators';
import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ClippyCombobox } from '../clippy-combobox';
import { arrayFromCommaList } from '../lib/converters';

type Option = {
  label: string;
  value: string[];
  cssUrl?: string;
};

const tag = 'clippy-font-combobox';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyFontCombobox;
  }
}

@safeCustomElement(tag)
export class ClippyFontCombobox extends ClippyCombobox<Option> {
  override readonly allowOther = true;
  #additional?: Option[];
  #intersectionObserver?: IntersectionObserver;
  @query('[role=listbox]')
  readonly listboxElement?: Element;

  @property({ converter: arrayFromCommaList })
  override set value(value: Option['value'] | null) {
    super.value = value;
    this.query = this.valueToQuery(value);
  }

  override get value(): Option['value'] | null {
    return super.value;
  }

  override async fetchAdditionalOptions(query: string): Promise<Option[]> {
    this.#additional = this.#additional ?? (await import('./external').then(({ default: items }) => items));
    const options = this.#additional.filter((option) => option.label.includes(query));

    if (options.length) {
      this.#intersectionObserver =
        this.#intersectionObserver ??
        new IntersectionObserver(this.#loadFontsInView, {
          root: this.listboxElement,
        });
    }

    return options;
  }

  readonly #loadFontsInView = (entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      const { intersectionRatio, target } = entry;
      if (intersectionRatio > 0 && target instanceof HTMLElement) {
        const cssUrl = target.dataset['cssUrl'] || '';
        const stylesheets = document.querySelector(`[href="${cssUrl}"]`);
        if (cssUrl && !stylesheets) {
          const link = document.createElement('link');
          link.setAttribute('rel', 'stylesheet');
          link.setAttribute('href', cssUrl);
          document.head.appendChild(link);
        }
        this.#intersectionObserver?.unobserve(target);
      }
    }
  };

  override valueToQuery(value: Option['value'] | null): string {
    if (value === null) {
      return '';
    }
    return Array.isArray(value) ? value[0] : value;
  }

  override queryToValue(query: string): string[] | null {
    // This is different from `this.getOptionForValue` because query is a string;
    return this.options.find((option) => option.value[0] === query)?.value ?? null;
  }

  override getOptionForValue(value: Option['value'] | null): Option | undefined {
    return this.options.find((option) => option.value.every((entry, index) => value?.[index] === entry));
  }

  override renderEntry(option: Option, _index: number) {
    const { cssUrl, label, value } = option;
    const styles = { fontFamily: value.toString(), fontSizeAdjust: 0.5 };

    const observeElement = (element?: Element) => {
      if (element && this.#intersectionObserver) {
        this.#intersectionObserver.observe(element);
      }
    };
    return html`<span ${ref(observeElement)} style=${styleMap(styles)} data-css-url=${ifDefined(cssUrl)}>
      ${label}
    </span>`;
  }
}
