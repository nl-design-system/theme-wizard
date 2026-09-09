import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/src/lib/decorators/index.js';
import { generateScale, profileForName } from '@nl-design-system-community/color-scale-generator';
import '@nl-design-system-community/clippy-components/clippy-html-image';
import '@nl-design-system-community/clippy-components/clippy-token-sample-text';
import {
  BaseDesignToken,
  isColorToken,
  stringifyColor,
  stringifyToken,
} from '@nl-design-system-community/design-tokens-schema';
import IconAlertCircle from '@tabler/icons/outline/alert-circle.svg?raw';
import IconAlertTriangle from '@tabler/icons/outline/alert-triangle.svg?raw';
import IconCircleCheck from '@tabler/icons/outline/circle-check.svg?raw';
import IconInfoCircle from '@tabler/icons/outline/info-circle.svg?raw';
import alertCss from '@utrecht/alert-css/dist/index.css?raw';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { t } from '../../i18n';
import styles from './styles';

const tag = 'wizard-step-form-sample';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStepFormSample;
  }
}

interface AlertPreviewConfig {
  /** Path segment identifying the group, e.g. `negative-inverse`. */
  pathSegment: string;
  /** Utrecht alert modifier, e.g. `error` in `.utrecht-alert--error`. */
  modifier: string;
  profile: ReturnType<typeof profileForName>;
  /** i18n key for the alert heading, e.g. `wizard.stepForm.sample.preview.alert.error.heading`. */
  headingKey: string;
  icon: string;
}

const ALERT_PREVIEW_CONFIGS: AlertPreviewConfig[] = [
  {
    headingKey: 'wizard.stepForm.sample.preview.alert.error.heading',
    icon: IconAlertCircle,
    modifier: 'error',
    pathSegment: 'negative-inverse',
    profile: 'negative',
  },
  {
    headingKey: 'wizard.stepForm.sample.preview.alert.warning.heading',
    icon: IconAlertTriangle,
    modifier: 'warning',
    pathSegment: 'warning-inverse',
    profile: 'warning',
  },
  {
    headingKey: 'wizard.stepForm.sample.preview.alert.positive.heading',
    icon: IconCircleCheck,
    modifier: 'ok',
    pathSegment: 'positive-inverse',
    profile: 'positive',
  },
  {
    headingKey: 'wizard.stepForm.sample.preview.alert.info.heading',
    icon: IconInfoCircle,
    modifier: 'info',
    pathSegment: 'info-inverse',
    profile: 'accent',
  },
];

/**
 * Renders a themed UI preview (heading, button, link, or alert) for a single design token,
 * picked by matching `path` against known step-form slot conventions.
 */
@safeCustomElement(tag)
export class WizardStepFormSample extends LitElement {
  static override readonly styles = [
    unsafeCSS(alertCss),
    unsafeCSS(buttonCss),
    unsafeCSS(linkCss),
    unsafeCSS(paragraphCss),
    styles,
  ];

  @property({ type: Object })
  token!: BaseDesignToken;

  @property({ type: String })
  path: string = '';

  private renderAlertSample(stringified: string, config: AlertPreviewConfig) {
    const exampleScale = generateScale(stringified, { profile: config.profile }).data;
    const style = {
      ['--nl-heading-level-3-color']: stringifyColor(exampleScale['color-document']),
      ['--nl-paragraph-color']: stringifyColor(exampleScale['color-document']),
      ['--utrecht-alert-icon-color']: stringifyColor(exampleScale['color-default']),
      [`--utrecht-alert-${config.modifier}-background-color`]: stringifyColor(exampleScale['bg-default']),
      [`--utrecht-alert-${config.modifier}-border-color`]: stringifyColor(exampleScale['border-default']),
      [`--utrecht-alert-${config.modifier}-color`]: stringifyColor(exampleScale['color-default']),
    };

    return html`
      <clippy-html-image>
        <div class="utrecht-alert utrecht-alert--${config.modifier}" style=${styleMap(style)}>
          <div class="utrecht-alert__icon">${unsafeSVG(config.icon)}</div>
          <div class="utrecht-alert__content">
            <div class="utrecht-alert__message" role="status">
              <clippy-heading level="3">${t(config.headingKey)}</clippy-heading>
              <p class="nl-paragraph">${t('wizard.stepForm.sample.preview.alert.paragraph')}</p>
            </div>
          </div>
        </div>
      </clippy-html-image>
    `;
  }

  override render() {
    if (!this.token) {
      return nothing;
    }

    const token = this.token;
    const tokenType = token.$type;
    const stringified = stringifyToken(token);

    if (this.path.includes('heading')) {
      const color = tokenType === 'color' ? stringified : undefined;
      const fontFamily = tokenType === 'fontFamily' ? stringified : undefined;
      return html`
        <clippy-html-image>
          <clippy-heading
            style=${styleMap({
              '--nl-heading-level-2-color': color,
              '--nl-heading-level-2-font-family': fontFamily,
            })}
            level="2"
          >
            ${t('wizard.stepForm.sample.heading')}
          </clippy-heading>
        </clippy-html-image>
        <clippy-token-sample-text>${t('wizard.stepForm.sample.paragraph')}</clippy-token-sample-text>
      `;
    }

    if (isColorToken(token)) {
      if (this.path.includes('.action-1-inverse')) {
        const exampleScale = generateScale(stringified, {
          anchor: 'bg-default',
          inverse: true,
          profile: 'accent',
        }).data;
        const style = {
          '--nl-button-primary-background-color': stringifyColor(exampleScale['bg-default']),
          '--nl-button-primary-border-color': stringifyColor(exampleScale['border-default']),
          '--nl-button-primary-color': stringifyColor(exampleScale['color-default']),
        };

        return html`
          <clippy-html-image>
            <clippy-button purpose="primary" style=${styleMap(style)}>
              ${t('wizard.stepForm.sample.preview.button')}
            </clippy-button>
          </clippy-html-image>
        `;
      }

      if (this.path.includes('.action-2')) {
        const exampleScale = generateScale(stringified, {
          profile: 'accent',
        }).data;
        const style = {
          '--nl-link-color': stringifyColor(exampleScale['color-default']),
          '--nl-link-text-decoration-color': stringifyColor(exampleScale['color-default']),
        };

        return html`
          <clippy-html-image>
            <p class="nl-paragraph">
              ${t('wizard.stepForm.sample.preview.link.prefix')}
              <a href="" class="nl-link" style=${styleMap(style)}
                >${t('wizard.stepForm.sample.preview.link.linkText')}</a
              >
              ${t('wizard.stepForm.sample.preview.link.suffix')}
            </p>
          </clippy-html-image>
        `;
      }

      const alertConfig = ALERT_PREVIEW_CONFIGS.find((config) => this.path.includes(config.pathSegment));
      if (alertConfig) {
        return this.renderAlertSample(stringified, alertConfig);
      }
    }

    return html`
      <clippy-token-sample-text
        font-family=${tokenType === 'fontFamily' ? stringified : undefined}
        color=${tokenType === 'color' ? stringified : undefined}
      >
        ${t('wizard.stepForm.sample.paragraph')}
      </clippy-token-sample-text>
    `;
  }
}
