import selectStyles from '@utrecht/select-css/dist/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { EVENT_NAMES } from '../../constants';
import styles from './styles.css?inline';

type Category = 'template' | 'collage';

type TemplateOption = {
  name: string;
  value: string;
  detail?: {
    name: string;
    value: string;
  };
};

type TemplateGroup = {
  name: string;
  value: string;
  type: Category;
  detail: readonly TemplateOption[];
};

export interface TemplateChangeEvent {
  type: Category;
  name: string;
  value: string;
  parent?: string;
}

// TODO: get from outside source
// Placeholder for now
const TEMPLATES: TemplateGroup[] = [
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
    const { options, selectedIndex } = select;
    const { text: selectedText, value: selectedValue } = options[selectedIndex];

    const matchedTemplateGroup: TemplateGroup | undefined = TEMPLATES.find(({ detail }) =>
      detail.some(({ value }) => value === selectedValue),
    );

    if (!matchedTemplateGroup) return;

    this.dispatchEvent(
      new CustomEvent<TemplateChangeEvent>(EVENT_NAMES.TEMPLATE_CHANGE, {
        bubbles: true,
        composed: true,
        detail: {
          name: selectedText,
          parent: matchedTemplateGroup.value,
          type: matchedTemplateGroup.type,
          value: selectedValue,
        },
      }),
    );
  };

  override render() {
    return html`
      <div class="select-container preview-theme">
        <select
          class="utrecht-select utrecht-select--html-select"
          @change=${this.#dispatchChange}
          aria-label="Voorvertoning"
        >
          ${TEMPLATES.map(
            (group) => html`
              <optgroup label="${group.name}">
                ${group.detail.map((option) => html` <option value="${option.value}">${option.name}</option>`)}
              </optgroup>
            `,
          )}
        </select>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'template-switcher': TemplateSwitcher;
  }
}
