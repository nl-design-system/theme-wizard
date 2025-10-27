import selectStyles from '@utrecht/select-css/dist/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { EVENT_NAMES } from '../../constants';
import styles from './styles.css?inline';

export interface TemplateChangeEvent {
  type: 'template' | 'collage';
  name: string;
  value: string;
  parent?: string;
}

type GroupConfig = {
  name: string;
  value: string;
  detail: { name: string; value: string; detail?: { name: string; value: string } }[];
  type: 'template' | 'collage';
};

const TEMPLATES: GroupConfig[] = [
  {
    name: 'Mijn Omgeving',
    detail: [
      { name: 'Overzichtspagina', value: 'overview' },
      { name: 'Berichten', value: 'messages' },
      { name: 'Taken', value: 'tasks' },
      {
        name: 'Mijn Zaken',
        detail: { name: 'Detailpagina', value: 'my-cases-detail' },
        value: 'my-cases',
      },
    ],
    type: 'template',
    value: 'my-environment',
  },
  {
    name: 'Meerstappenformulier',
    detail: [
      { name: '1 - Intro', value: 'step-1' },
      { name: '2 - Uw Vraag', value: 'step-2' },
      { name: '3 - Login', value: 'step-3' },
      { name: '4 - Stap 2', value: 'step-4' },
      { name: '5 - Stap 3', value: 'step-5' },
      { name: '6 - Succes', value: 'step-6' },
    ],
    type: 'template',
    value: 'multi-step-form',
  },
  {
    name: 'Voorvertoning losse componenten',
    detail: [
      { name: 'Collage 1', value: 'collage-1' },
      { name: 'Collage 2', value: 'collage-2' },
    ],
    type: 'collage',
    value: 'preview-components',
  },
];
@customElement('template-switcher')
export class TemplateSwitcher extends LitElement {
  static override readonly styles = [unsafeCSS(selectStyles), unsafeCSS(styles)];

  readonly #dispatchChange = (event: Event) => {
    const select = event.target as HTMLSelectElement;
    const selectedOption = select.options[select.selectedIndex];
    const metadata = JSON.parse(selectedOption.dataset['metadata'] || '{}');

    this.dispatchEvent(
      new CustomEvent<TemplateChangeEvent>(EVENT_NAMES.TEMPLATE_CHANGE, {
        bubbles: true,
        composed: true,
        detail: {
          name: selectedOption.text,
          parent: metadata.parent,
          type: metadata.type,
          value: metadata.value,
        },
      }),
    );
  };

  readonly #renderOption = (
    option: { name: string; value: string; detail?: { name: string; value: string } },
    group: GroupConfig,
  ) => {
    return html`
      <option
        value="${option.value}"
        data-metadata=${JSON.stringify({
          parent: group.value,
          type: group.type,
          value: option.value,
        })}
      >
        ${option.name}
      </option>
    `;
  };

  readonly #renderOptGroup = (group: GroupConfig) => {
    return html`
      <optgroup label="${group.name}">${group.detail.map((detail) => this.#renderOption(detail, group))}</optgroup>
    `;
  };

  readonly #renderSelect = (label: string, groups: GroupConfig[]) => {
    return html`<select
      class="utrecht-select utrecht-select--html-select"
      @change=${this.#dispatchChange}
      aria-label=${label}
    >
      ${groups.map(this.#renderOptGroup)}
    </select>`;
  };

  override render() {
    return html`<div class="select-container preview-theme">${this.#renderSelect('Voorvertoning', TEMPLATES)}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'template-switcher': TemplateSwitcher;
  }
}
