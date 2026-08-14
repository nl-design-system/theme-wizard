import type { ClippyModal } from '@nl-design-system-community/clippy-components/clippy-modal';
import type { TokenCollection } from '@nl-design-system-community/clippy-components/src/clippy-token-table-color/types.js';
import '@nl-design-system-community/clippy-components/clippy-color-sample';
import '@nl-design-system-community/clippy-components/clippy-modal';
import '@nl-design-system-community/clippy-components/clippy-heading';
import {
  type ColorValue,
  type ColorToken as ColorTokenType,
  isValueObject,
  stringifyColor,
  ThemeLike,
  BaseDesignToken,
  TokenPath,
  isTokenLike,
  EXTENSION_REFERENCED_AT,
  EXTENSION_TOKEN_PATH,
  isRef,
  resolveRef,
} from '@nl-design-system-community/design-tokens-schema';
import dlv from 'dlv';
import { html, nothing } from 'lit';
import type { ColorGroup, DisplayToken } from './types';
import { t } from '../../i18n';
import { resolveColorValue } from '../wizard-colorscale-input';

export function prepareColorGroups(colors: Record<string, unknown>): ColorGroup[] {
  return Object.entries(colors)
    .filter(([key]) => !key.includes('inverse') && !key.includes('transparent'))
    .filter(([, value]) => typeof value === 'object' && value !== null)
    .map(([key, value]) => {
      const colorEntries = Object.entries(value as Record<string, unknown>)
        .filter(([, token]) => typeof token === 'object' && token !== null && '$value' in token)
        .map(([colorKey, token]) => {
          const color = resolveColorValue(token as ColorTokenType);
          const displayValue = color ? stringifyColor(color) : '#000';
          const tokenId = (token && dlv(token, ['$extensions', EXTENSION_TOKEN_PATH])) ?? '';
          const usage = (token && dlv(token, ['$extensions', EXTENSION_REFERENCED_AT])) ?? [];
          const usageCount = usage.length;
          return { colorKey, displayValue, tokenId, usage, usageCount };
        })
        .filter(({ displayValue }) => displayValue !== null);
      return { colorEntries, key };
    });
}

export function getTokensByPath({ basePath, tokens }: { tokens: ThemeLike; basePath: TokenPath }): BaseDesignToken[] {
  const result: BaseDesignToken[] = [];

  const tokensAtPath = dlv(tokens, basePath);
  Object.keys(tokensAtPath).forEach((key) => {
    const token = tokensAtPath[key];
    if (isTokenLike(token)) {
      const resolvedValue = isRef(token.$value) ? resolveRef(tokens, token.$value) : token.$value;
      result.push({ ...token, $value: resolvedValue });
    }
  });

  return result;
}

export function getTokenCollectionByTokenPaths(tokens: ThemeLike, paths: TokenPath[]): TokenCollection {
  const result: TokenCollection = [];
  paths.forEach((path) => {
    const tokensByPath = getTokensByPath({ basePath: path, tokens });
    if (tokensByPath.length > 0) result.push({ name: path.join('.'), tokens: tokensByPath });
  });
  return result;
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
        style="block-size: ${['block', 'row'].includes(space) ? value : '2rem'}; inline-size: ${
          ['inline', 'column', 'text'].includes(space) ? value : '2rem'
        }; background-color: currentColor; cursor: default; forced-color-adjust: none; user-select: none;"
      ></div>
    </clippy-html-image>
  `;
}

export function renderTokenExample(token: Omit<DisplayToken, 'usage'>) {
  switch (token.tokenType) {
    case 'color':
      return html`<clippy-color-sample color=${token.displayValue}></clippy-color-sample>`;
    case 'fontSize':
      return html`<wizard-font-sample size=${token.displayValue} truncate></wizard-font-sample>`;
    case 'fontFamily':
      return html`<wizard-font-sample
        family=${token.displayValue}
        size="var(--basis-text-font-size-xl)"
        truncate
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
      ${
        activeToken
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
                ${
                  activeToken.metadata
                    ? Object.entries(activeToken.metadata).map(
                        ([key, value]) => html`
                          <dt>${key}</dt>
                          <dd>
                            <code class="nl-code">${value}</code>
                          </dd>
                        `,
                      )
                    : nothing
                }
              </dl>

              <clippy-heading level=${3}>
                ${t('styleGuide.detailsDialog.tokenReferenceList.title')}
                <data>(${activeToken.usage.length}&times;)</data>
              </clippy-heading>
              ${
                activeToken.usage.length > 0
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
                    `
              }
            `
          : nothing
      }
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
