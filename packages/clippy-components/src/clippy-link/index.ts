import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import { html, LitElement, unsafeCSS, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

type ForwardAttributes = 'aria-data' | 'all';

@customElement('clippy-link')
export class ClippyLink extends LitElement {
  private static readonly blockedAttributes = new Set([
    'href',
    'target',
    'rel',
    'role',
    'tabindex',
    'aria-disabled',
    'inline-box',
    'disabled',
    'forward-attributes',
    'class',
    'style',
  ]);

  private ariaCurrentValue = '';

  @property() href = '';
  @property() target = '';
  @property() rel = '';

  @property({ attribute: 'inline-box', type: Boolean }) inlineBox = false;
  @property({ type: Boolean }) disabled = false;

  @property({
    attribute: 'forward-attributes',
    converter: {
      fromAttribute: (value: string | null): ForwardAttributes => (value === 'all' ? 'all' : 'aria-data'),
    },
    type: String,
  })
  forwardAttributes: ForwardAttributes = 'aria-data';

  @property({ attribute: false }) override className = '';

  @query('a') private readonly anchorEl?: HTMLAnchorElement;
  private attributeObserver?: MutationObserver;

  static override readonly styles = [unsafeCSS(linkCss)];

  override connectedCallback() {
    super.connectedCallback();
    this.attributeObserver = new MutationObserver(() => {
      this.syncAriaCurrent();
      this.forwardNonComponentAttributes();
    });
    this.attributeObserver.observe(this, { attributes: true });
    this.syncAriaCurrent();
  }

  override disconnectedCallback() {
    this.attributeObserver?.disconnect();
    this.attributeObserver = undefined;
    super.disconnectedCallback();
  }

  override firstUpdated() {
    this.syncAriaCurrent();
    this.forwardNonComponentAttributes();
  }

  override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('forwardAttributes')) {
      this.forwardNonComponentAttributes();
    }
    this.syncAriaCurrent();
  }

  private syncAriaCurrent() {
    this.ariaCurrentValue = this.getAttribute('aria-current') ?? '';
  }

  private isAllowedToForwardAttribute(name: string) {
    if (ClippyLink.blockedAttributes.has(name)) return false;
    if (this.forwardAttributes === 'all') return true;
    const lowerName = name.toLowerCase();
    if (lowerName === 'download' || lowerName === 'hreflang' || lowerName === 'referrerpolicy' || lowerName === 'ping' || lowerName === 'type') {
      return true;
    }
    return name.startsWith('aria-') || name.startsWith('data-');
  }

  private forwardNonComponentAttributes() {
    const a = this.anchorEl;
    if (!a) return;

    // Remove all previously forwarded attributes first (keep template-owned ones set via render()).
    for (const name of a.getAttributeNames()) {
      if (name === 'class' || name === 'style') continue;

      if (!ClippyLink.blockedAttributes.has(name)) {
        a.removeAttribute(name);
      }
    }

    // Forward host attributes
    for (const name of this.getAttributeNames()) {
      if (!this.isAllowedToForwardAttribute(name)) continue;
      const value = this.getAttribute(name);
      if (value !== null) a.setAttribute(name, value);
    }
  }

  override render() {
    const disabled = this.disabled;

    const href = disabled ? undefined : this.href;
    const target = disabled || !this.target ? undefined : this.target;
    const rel = disabled || !this.rel ? undefined : this.rel;

    const ariaDisabled = disabled ? 'true' : undefined;
    const role = disabled ? 'link' : undefined;
    console.log("disabled: ", disabled);
    const tabIndex = disabled ? '0' : undefined;

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
        href=${ifDefined(href)}
        target=${ifDefined(target)}
        rel=${ifDefined(rel)}
        aria-disabled=${ifDefined(ariaDisabled)}
        role=${ifDefined(role)}
        tabindex=${ifDefined(tabIndex)}
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