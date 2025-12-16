import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ClippyCombobox } from '../clippy-combobox';

type Option = {
  label: string;
  value: string | Array<string>;
  cssUrl?: string;
};

const tag = 'clippy-font-combobox';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyFontCombobox;
  }
}

@customElement(tag)
export class ClippyFontCombobox extends ClippyCombobox<Option> {
  #additional?: Option[];
  #intersectionObserver?: IntersectionObserver;
  @query('[role=listbox]')
  readonly listboxElement?: Element;

  override readonly filter = (option: Option) => {
    const label = `${option.label}`; // Use as string
    return label.toLowerCase().includes(this.query.toLowerCase());
  };

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

  override valueToQuery(value: Option['value']): string {
    return Array.isArray(value) ? value[0] : value.split(',')[0];
  }

  override renderEntry(option: Option, _index: number) {
    const { cssUrl, label, value } = option;
    const styles = { fontFamily: value.toString(), fontSizeAdjust: 0.5 };

    const observeElement = (element?: Element) => {
      if (element && this.#intersectionObserver) {
        this.#intersectionObserver.observe(element);
      }
    };
    return html`<span ${ref(observeElement)} style=${styleMap(styles)} data-css-url=${cssUrl}> ${label} </span>`;
  }
}
