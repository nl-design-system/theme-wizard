import { consume } from '@lit/context';
import '@nl-design-system-community/clippy-components/clippy-heading';
import { arrayFromCommaList } from '@nl-design-system-community/clippy-components/lib/converters';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import '@vanillawc/wc-markdown';
import dlv from 'dlv';
import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import { filterRedundantGroups } from '../../lib/ColorScale/siblings';
import { tokenDocs } from '../../lib/tokenDocs';
import '../wizard-stack';
import styles from './styles';

const tag = 'wizard-token-docs';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenDocs;
  }
}

interface ParsedGroup {
  path: string;
  key: string;
  baseSegments: string[];
  docKey: string;
}

const keyOf = (path: string) => path.split('.').at(-1)!;

/** Splits a full basis token path once and derives everything else (key, base, doc lookup key) from those segments. */
const parseGroup = (path: string): ParsedGroup => {
  const segments = path.split('.');
  return {
    baseSegments: segments.slice(0, -1),
    // e.g. "basis.color.accent-1" -> "color-accent-1", matching the doc's filename-derived key in `tokenDocs`.
    docKey: segments.slice(1).join('-'),
    key: segments.at(-1)!,
    path,
  };
};

@safeCustomElement(tag)
export class WizardTokenDocs extends LitElement {
  static override readonly styles = [styles];

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  #visibleGroups: ParsedGroup[] = [];

  /** Full basis token paths to show docs for, e.g. "basis.color.default, basis.color.accent-1". */
  @property({ converter: arrayFromCommaList })
  groups: string[] = [];

  /** Full basis token paths (e.g. "basis.color.accent-2") to drop when that group's tokens are only references to an earlier group in `groups`, e.g. accent-2 entirely re-pointing at accent-1. */
  @property({ attribute: 'skip-redundant-groups', converter: arrayFromCommaList })
  skipRedundantGroups: string[] = [];

  @property({ attribute: 'heading-level', type: Number })
  headingLevel = 2;

  protected override willUpdate(changedProperties: PropertyValues) {
    if (
      !changedProperties.has('theme') &&
      !changedProperties.has('groups') &&
      !changedProperties.has('skipRedundantGroups')
    ) {
      return;
    }

    const parsedGroups = this.groups.map(parseGroup);

    if (this.skipRedundantGroups.length === 0 || parsedGroups.length === 0) {
      this.#visibleGroups = parsedGroups;
      return;
    }

    // All groups in one <wizard-token-docs> share the same base, e.g. ["basis", "color"].
    const baseSegments = parsedGroups[0].baseSegments;
    const domain = dlv(this.theme.tokens, baseSegments);

    if (!domain || typeof domain !== 'object') {
      this.#visibleGroups = parsedGroups;
      return;
    }

    // filterRedundantGroups works on bare keys ("accent-1"), keep a way back to the parsed group for lookup after.
    const groupsByKey = new Map(parsedGroups.map((group) => [group.key, group]));
    const visibleKeys = filterRedundantGroups(
      [...groupsByKey.keys()],
      domain as Record<string, unknown>,
      this.skipRedundantGroups.map(keyOf),
      baseSegments.join('.'),
    );
    this.#visibleGroups = visibleKeys.map((key) => groupsByKey.get(key)!);
  }

  override render() {
    return html`
      <clippy-stack size="sm">
        ${this.#visibleGroups.map(({ docKey, path }) => {
          const docs = tokenDocs[docKey];
          if (!docs) return nothing;

          return html`
            <wizard-stack size="none">
              <clippy-heading level=${this.headingLevel}>${t(`tokens.fieldLabels.${path}.label`)}</clippy-heading>
              <wc-markdown class="wizard-token-docs__markdown" .textContent=${docs}></wc-markdown>
            </wizard-stack>
          `;
        })}
      </clippy-stack>
    `;
  }
}
