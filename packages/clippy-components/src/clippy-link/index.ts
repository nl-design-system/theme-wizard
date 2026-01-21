import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import { html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('clippy-link')
export class ClippyLink extends LitElement {
  @property() href = '';
  @property() target = '';
  @property() rel = '';

  @property({ attribute: 'inline-box', type: Boolean }) inlineBox = false;
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: 'aria-current' }) ariaCurrentValue: string = '';
  @property({ attribute: false }) override className = '';

  static override readonly styles = [unsafeCSS(linkCss)];

  override render() {
    const disabled = this.disabled;

    // When disabled, remove href/target/rel and keep it focusable for accessibility.
    const href = disabled ? nothing : this.href || nothing;
    const target = disabled || !this.target ? nothing : this.target;
    const rel = disabled || !this.rel ? nothing : this.rel;
    const role = disabled ? 'link' : nothing;
    const tabIndex = disabled ? 0 : nothing;
    const ariaCurrent = this.ariaCurrentValue || nothing;

    const classes = {
      'nl-link': true,
      'nl-link--current': Boolean(this.ariaCurrentValue),
      'nl-link--disabled': disabled,
      'nl-link--inline-box': this.inlineBox,
    };

    const hostClasses = (this.className || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .reduce<Record<string, boolean>>((acc, name) => {
        acc[name] = true;
        return acc;
      }, {});
    const mergedClasses = { ...classes, ...hostClasses };

    return html`
      <a
        class=${classMap(mergedClasses)}
        href=${href}
        target=${target}
        rel=${rel}
        aria-disabled=${disabled || nothing}
        aria-current=${ariaCurrent}
        role=${role}
        tabindex=${tabIndex}
      >
        <slot></slot>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'clippy-link': ClippyLink;
  }
}