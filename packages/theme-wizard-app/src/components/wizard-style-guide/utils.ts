import type { ClippyModal } from '@nl-design-system-community/clippy-components/clippy-modal';
import '@nl-design-system-community/clippy-components/clippy-modal';
import '@nl-design-system-community/clippy-components/clippy-heading';
import type { DesignTokens } from 'style-dictionary/types';
import {
  type ColorValue,
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
    const tokenId = token.$value.slice(1, -1);
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

export function renderColorSample(displayValue: string, tokenId?: string) {
  return html`
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      class="nl-color-sample"
      style="color: ${displayValue};"
      aria-labelledby=${tokenId}
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path d="M0 0H32V32H0Z" fill="currentcolor" />
    </svg>
  `;
}

export function renderFontSizeExample(displayValue: string) {
  return html`
    <clippy-html-image>
      <span slot="label">${t('styleGuide.sections.typography.sizes.sample')}</span>
      <utrecht-paragraph
        style="--utrecht-paragraph-font-size: ${displayValue}; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;"
      >
        Op brute wijze ving de schooljuf de quasi-kalme lynx.
      </utrecht-paragraph>
    </clippy-html-image>
  `;
}

export function renderFontFamilyExample(displayValue: string) {
  return html`
    <clippy-html-image>
      <span slot="label">${t('styleGuide.sections.typography.families.sample')}</span>
      <utrecht-paragraph
        style="--utrecht-paragraph-font-size: var(--basis-text-font-size-2xl); --utrecht-paragraph-font-family: ${displayValue}; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;"
      >
        Op brute wijze ving de schooljuf de quasi-kalme lynx.
      </utrecht-paragraph>
    </clippy-html-image>
  `;
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

export function renderFontWeightExample(displayValue: string | number) {
  return html`
    <clippy-html-image>
      <span slot="label">${t('styleGuide.sections.typography.fontWeight.sample')}</span>
      <utrecht-paragraph
        style="--utrecht-paragraph-font-size: var(--basis-text-font-size-2xl); --utrecht-paragraph-font-weight: ${displayValue}; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;"
      >
        Op brute wijze ving de schooljuf de quasi-kalme lynx.
      </utrecht-paragraph>
    </clippy-html-image>
  `;
}

export function renderLineHeightExample(displayValue: string | number) {
  return html`
    <clippy-html-image>
      <span slot="label">${t('styleGuide.sections.typography.fontWeight.sample')}</span>
      <utrecht-paragraph
        style="--utrecht-paragraph-font-size: var(--basis-text-font-size-xl); --utrecht-paragraph-line-height: ${displayValue}; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; outline: 1px solid"
      >
        Op brute wijze ving de schooljuf de quasi-kalme lynx.
      </utrecht-paragraph>
    </clippy-html-image>
  `;
}

export function renderTokenExample(token: Omit<DisplayToken, 'usage'>) {
  switch (token.tokenType) {
    case 'color':
      return renderColorSample(token.displayValue);
    case 'fontSize':
      return renderFontSizeExample(token.displayValue);
    case 'fontFamily':
      return renderFontFamilyExample(token.displayValue);
    case 'dimension':
      return renderSpacingExample(token.displayValue, token.metadata?.['space']);
    case 'fontWeight':
      return renderFontWeightExample(token.displayValue);
    case 'lineHeight':
      return renderLineHeightExample(token.displayValue);
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
