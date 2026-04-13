import type { ClippyModal } from '@nl-design-system-community/clippy-components/clippy-modal';
import '@nl-design-system-community/clippy-components/clippy-color-sample';
import '@nl-design-system-community/clippy-components/clippy-modal';
import '@nl-design-system-community/clippy-components/clippy-heading';
import type { DesignTokens } from 'style-dictionary/types';
import {
  type ColorValue,
  extractRef,
  isValueObject,
  stringifyColor,
  walkTokensWithRef,
} from '@nl-design-system-community/design-tokens-schema';
import { html, nothing } from 'lit';
import type { DisplayToken } from './types';
import { t } from '../../i18n';

export function countUsagePerToken(tokens: DesignTokens): Map<string, string[]> {
  const tokenUsage = new Map<string, string[]>();
  walkTokensWithRef(tokens, tokens, (token, path) => {
    const tokenId = extractRef(token.$value);
    if (path.includes('$extensions')) return;
    const stored = tokenUsage.get(tokenId) || [];
    stored.push(path.join('.'));
    tokenUsage.set(tokenId, stored);
  });
  return tokenUsage;
}

export function stringifyTokenValue(token: unknown): string {
  if (typeof token === 'string') return token;

  if (!isValueObject(token)) {
    return JSON.stringify(token);
  }

  const value = token['$value'];

  if (value === undefined || value === null) {
    return '';
  }

  if (Array.isArray(value)) {
    return value.map((v) => stringifyTokenValue(v)).join(', ');
  }

  if (isValueObject(value)) {
    if (token['$type'] === 'color') {
      return stringifyColor(value as ColorValue);
    }
    return JSON.stringify(value);
  }

  return value.toString();
}

export function renderSpacingExample(value: string, space: string = 'block') {
  return html`
    <clippy-html-image>
      <span slot="label">${t(`styleGuide.sections.space.${space}.sample`)}</span>
      <div
        style="block-size: ${['block', 'row'].includes(space) ? value : '2rem'}; inline-size: ${[
          'inline',
          'column',
          'text',
        ].includes(space)
          ? value
          : '2rem'}; background-color: currentColor; cursor: default; forced-color-adjust: none; user-select: none;"
      ></div>
    </clippy-html-image>
  `;
}

export function renderTokenExample(token: Omit<DisplayToken, 'usage'>) {
  switch (token.tokenType) {
    case 'color':
      return html`<clippy-color-sample color=${token.displayValue}></clippy-color-sample>`;
    case 'fontSize':
      return html`<wizard-font-sample size=${token.displayValue}></wizard-font-sample>`;
    case 'fontFamily':
      return html`<wizard-font-sample
        family=${token.displayValue}
        size="var(--basis-text-font-size-xl)"
      ></wizard-font-sample>`;
    case 'dimension':
      return renderSpacingExample(token.displayValue, token.metadata?.['space']);
    default:
      return nothing;
  }
}

export function renderTokenDialog(activeToken: DisplayToken | undefined) {
  return html`
    <clippy-modal id="token-dialog" title=${activeToken?.tokenId} open=${activeToken !== undefined} actions="none">
      ${activeToken
        ? html`
            <clippy-heading level=${3}>${t('styleGuide.sample')}</clippy-heading>
            ${renderTokenExample(activeToken)}
            <dl>
              <dt>Token type</dt>
              <dd>
                <code class="nl-code">${activeToken.tokenType}</code>
              </dd>
              <dt>Token ID</dt>
              <dd>
                <span class="nl-data-badge">${activeToken.tokenId}</span>
              </dd>
              <dt>CSS Variable</dt>
              <dd>
                <code class="nl-code">${`--${activeToken.tokenId.replaceAll('.', '-')}`}</code>
              </dd>
              <dt>${t('styleGuide.value')}</dt>
              <dd>
                <code class="nl-code">${activeToken.displayValue}</code>
              </dd>
              ${activeToken.metadata
                ? Object.entries(activeToken.metadata).map(
                    ([key, value]) => html`
                      <dt>${key}</dt>
                      <dd>
                        <code class="nl-code">${value}</code>
                      </dd>
                    `,
                  )
                : nothing}
            </dl>

            <clippy-heading level=${3}>
              ${t('styleGuide.detailsDialog.tokenReferenceList.title')}
              <data>(${activeToken.usage.length}&times;)</data>
            </clippy-heading>
            ${activeToken.usage.length > 0
              ? html`
                  <ul>
                    ${activeToken.usage.map(
                      (referrer) => html`
                        <li>
                          <span class="nl-data-badge">${referrer}</span>
                        </li>
                      `,
                    )}
                  </ul>
                `
              : html`
                  <utrecht-paragraph>${t('styleGuide.detailsDialog.tokenReferenceList.empty')}</utrecht-paragraph>
                `}
          `
        : nothing}
    </clippy-modal>
  `;
}

/**
 * Opens the token detail dialog. The dialog is always in the DOM (via `renderTokenDialog`),
 * so it can be queried immediately. `setter` updates the component's reactive state to fill
 * the dialog content on open and clear it on close.
 */
export function openTokenDialog(
  token: DisplayToken,
  renderRoot: HTMLElement | DocumentFragment,
  setter: (token: DisplayToken | undefined) => void,
) {
  setter(token);
  const dialog = renderRoot.querySelector('#token-dialog')! as ClippyModal;
  dialog.addEventListener('close', () => setter(undefined), { once: true });
  dialog.open();
}
