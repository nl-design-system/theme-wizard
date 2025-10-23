import selectStyles from '@utrecht/select-css/dist/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import styles from './styles.css?inline';

export interface TemplateChangeEvent {
  type: 'template' | 'component';
  name: string;
  parent?: {
    name: string;
    value: string;
  };
  detail?: {
    name: string;
    value: string;
  };
}

const TEMPLATES = [
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
    value: 'multi-step-form',
  },
];

const COMPONENTS = [
  {
    name: 'Voorvertoning losse componenten',
    detail: [
      { name: 'Collage 1', value: 'collage-1' },
      { name: 'Collage 2', value: 'collage-2' },
    ],
    value: 'preview-components',
  },
];

@customElement('template-switcher')
export class TemplateSwitcher extends LitElement {
  static override readonly styles = [unsafeCSS(selectStyles), unsafeCSS(styles)];

  @state() private activeSelect: 'template' | 'component' = 'template';

  #dispatchTemplateChange(type: 'template' | 'component', event: Event) {
    this.activeSelect = type;
    const select = event.target as HTMLSelectElement;
    const selectedOption = select.options[select.selectedIndex];
    const metadata = JSON.parse(selectedOption.dataset['metadata'] || '{}');

    this.dispatchEvent(
      new CustomEvent<TemplateChangeEvent>('template-change', {
        bubbles: true,
        composed: true,
        detail: {
          name: selectedOption.text,
          detail: metadata.detail,
          parent: metadata.parent,
          type,
        },
      }),
    );
  }

  handleTemplateChange = (e: Event) => this.#dispatchTemplateChange('template', e);
  handleComponentChange = (e: Event) => this.#dispatchTemplateChange('component', e);

  #activateSelect = (type: 'template' | 'component') => {
    this.activeSelect = type;
  };

  #renderOptGroup = (template: (typeof TEMPLATES)[number]) => html`
    <optgroup label="${template.name}">
      ${template.detail?.map(
        (detail) => html`
          <option
            value="${template.value}-${detail.value}"
            data-metadata=${JSON.stringify({
              detail: { name: detail.name, value: detail.value },
              parent: { name: template.name, value: template.value },
            })}
          >
            ${detail.name}
          </option>
        `,
      )}
    </optgroup>
  `;

  override render() {
    return html`<div class="select-container preview-theme">
      <div class="template ${this.activeSelect === 'template' ? 'active' : ''}">
        ${this.activeSelect === 'template'
          ? html`
              <select
                class="utrecht-select utrecht-select--html-select"
                @change=${this.handleTemplateChange}
                aria-label="Voorvertoning Templates"
              >
                ${TEMPLATES.map(this.#renderOptGroup)}
              </select>
            `
          : html`
              <utrecht-button appearance="primary-action-button" @click=${() => this.#activateSelect('template')}>
                Voorvertoning Templates
              </utrecht-button>
            `}
      </div>
      <div class="component ${this.activeSelect === 'component' ? 'active' : ''}">
        ${this.activeSelect === 'component'
          ? html`
              <select
                class="utrecht-select utrecht-select--html-select"
                @change=${this.handleComponentChange}
                aria-label="Voorvertoning losse componenten"
              >
                ${COMPONENTS.map(this.#renderOptGroup)}
              </select>
            `
          : html`
              <utrecht-button appearance="primary-action-button" @click=${() => this.#activateSelect('component')}>
                Voorvertoning losse componenten
              </utrecht-button>
            `}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'template-switcher': TemplateSwitcher;
  }
}
