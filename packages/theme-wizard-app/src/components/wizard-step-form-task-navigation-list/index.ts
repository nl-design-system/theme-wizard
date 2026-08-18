import '../wizard-step-form-task-navigation';
import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import '@nl-design-system-community/clippy-components/clippy-card-radio-group';
import '@nl-design-system-community/clippy-components/clippy-stack';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { stepsStorage } from '../../utils/wizard-steps-storage';

const STEPS = [
  {
    icon: 'typography',
    label: 'Lettertype voor tekst',
    path: 'basis.text.font-family.default',
  },
  {
    icon: 'palette',
    label: 'Kleur voor tekst',
    path: 'basis.color.default.color-document',
  },
  {
    icon: 'typography',
    label: 'Lettertype voor koppen',
    path: 'basis.heading.font-family',
  },
  {
    icon: 'palette',
    label: 'Kleur voor koppen',
    path: 'basis.heading.color',
  },
] as const;

const tag = 'wizard-step-form-task-navigation-list';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStepFormTaskNavigationList;
  }
}

@customElement(tag)
export class WizardStepFormTaskNavigationList extends LitElement {
  static override readonly styles = [unsafeCSS(buttonCss)];
  @state() private completedPaths: Set<string> = new Set();

  override connectedCallback() {
    super.connectedCallback();
    const stored = stepsStorage.getJSON();
    if (Array.isArray(stored)) {
      this.completedPaths = new Set(stored);
    }
  }

  override render() {
    return html`
      <clippy-stack size="3xl">
        <div>
          ${STEPS.map((step) => {
            const href = `/wizard/${step.path.replaceAll('.', '-')}`;
            return html`
              <wizard-step-form-task-navigation
                href=${href}
                ?done=${this.completedPaths.has(step.path)}
                icon=${step.icon}
              >
                ${step.label}
              </wizard-step-form-task-navigation>
            `;
          })}
        </div>
        ${
          this.completedPaths.size > 0
            ? html`
                <div class="utrecht-action-group utrecht-action-group--row">
                  <a href="/basis-tokens" class="nl-button nl-button--primary">
                    <span class="nl-button__label">Volgende stap</span>
                  </a>
                </div>
              `
            : nothing
        }
      </clippy-stack>
    `;
  }
}
