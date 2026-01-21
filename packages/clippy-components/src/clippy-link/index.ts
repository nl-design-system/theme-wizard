import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import { html, LitElement, unsafeCSS, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

type ForwardAttributes = 'aria-data' | 'all';

type AnchorRestProps = Partial<Pick<HTMLAnchorElement, 'download' | 'hreflang' | 'referrerPolicy' | 'ping' | 'type'>>;

@customElement('clippy-link')
export class ClippyLink extends LitElement {
  private static readonly blockedAttributes = new Set([
    'href',
    'target',
    'rel',
    'current',
    'inline-box',
    'disabled',
    'forward-attributes',
    'class',
    'style',
    'download',
    'hreflang',
    'referrerPolicy',
    'ping',
    'type',
  ]);

  @property() href = '';
  @property() target = '';
  @property() rel = '';

  @property() current = '';
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

  @property({ attribute: false }) restProps: AnchorRestProps = {};

  @query('a') private readonly anchorEl?: HTMLAnchorElement;
  private attributeObserver?: MutationObserver;

  static override readonly styles = [unsafeCSS(linkCss)];

  override connectedCallback() {
    super.connectedCallback();
    this.attributeObserver = new MutationObserver(() => this.forwardNonComponentAttributes());
    this.attributeObserver.observe(this, { attributes: true });
  }

  override disconnectedCallback() {
    this.attributeObserver?.disconnect();
    this.attributeObserver = undefined;
    super.disconnectedCallback();
  }

  override firstUpdated() {
    this.forwardNonComponentAttributes();
  }

  override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('forwardAttributes')) {
      this.forwardNonComponentAttributes();
    }
  }

  private isAllowedToForwardAttribute(name: string) {
    if (ClippyLink.blockedAttributes.has(name)) return false;
    if (this.forwardAttributes === 'all') return true;
    return name.startsWith('aria-') || name.startsWith('data-');
  }

  private forwardNonComponentAttributes() {
    const a = this.anchorEl;
    if (!a) return;

    // Remove all forwarded attributes first
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
    const enabled = !this.disabled;

    const classes = {
      'nl-link': true,
      'nl-link--current': Boolean(this.current),
      'nl-link--disabled': this.disabled,
      'nl-link--inline-box': this.inlineBox,
    };

    if (this.className) {
      (classes as Record<string, boolean>)[this.className] = true;
    }

    return html`
      <a
        class=${classMap(classes)}
        href=${enabled ? this.href : undefined}
        target=${enabled && this.target ? this.target : undefined}
        rel=${enabled && this.rel ? this.rel : undefined}
        aria-current=${this.current || undefined}
        aria-disabled=${this.disabled ? 'true' : undefined}
        role=${this.disabled ? 'link' : undefined}
        tabindex=${this.disabled ? '0' : undefined}
        .download=${ifDefined(this.restProps.download)}
        .hreflang=${ifDefined(this.restProps.hreflang)}
        .referrerPolicy=${ifDefined(this.restProps.referrerPolicy)}
        .ping=${ifDefined(this.restProps.ping)}
        .type=${ifDefined(this.restProps.type)}
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