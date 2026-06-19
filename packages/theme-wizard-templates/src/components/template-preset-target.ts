import { LitElement, css } from 'lit';

export const presetTargetStyles = css`
  :host {
    cursor: pointer;
    position: relative;
    transition: background-color 120ms ease, outline-color 120ms ease;
  }

  :host(:hover),
  :host(:focus-visible),
  :host(:focus-within) {
    background-color: color-mix(in srgb, var(--basis-color-action-2-color-default, #0077c8), transparent 92%);
    outline: 2px solid var(--basis-color-action-2-border-default, #0077c8);
    outline-offset: 0.15rem;
  }
`;

export abstract class TemplatePresetTarget extends LitElement {
  protected abstract readonly presetComponentId: string;

  static override readonly styles = [presetTargetStyles];

  protected get presetDetail(): Record<string, unknown> {
    return {};
  }

  protected get presetAriaLabel(): string {
    return `${this.presetComponentId} aanpassen`;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.tabIndex = 0;
    this.role = 'button';
    this.setAttribute('aria-haspopup', 'dialog');
    if (!this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', this.presetAriaLabel);
    }

    this.addEventListener('click', this.#handleActivate);
    this.addEventListener('keydown', this.#handleKeydown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.#handleActivate);
    this.removeEventListener('keydown', this.#handleKeydown);
  }

  readonly #handleActivate = () => {
    this.dispatchEvent(
      new CustomEvent('template-preset-request', {
        bubbles: true,
        composed: true,
        detail: {
          componentId: this.presetComponentId,
          ...this.presetDetail,
        },
      }),
    );
  };

  readonly #handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.#handleActivate();
    }
  };
}
