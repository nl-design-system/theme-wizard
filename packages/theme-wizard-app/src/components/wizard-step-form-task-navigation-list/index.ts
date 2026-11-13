import { consume } from '@lit/context';
import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import '@nl-design-system-community/clippy-components/clippy-stack';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { completedStepsContext } from '../../contexts/completed-steps';
import '../wizard-step-form-task-navigation';

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
  {
    icon: 'palette',
    label: 'Kleur voor knoppen',
    path: 'basis.color.action-1-inverse.bg-default',
  },
  {
    icon: 'palette',
    label: 'Kleur voor links',
    path: 'basis.color.action-2.color-default',
  },
  {
    icon: 'palette',
    label: 'Kleur voor negatief signaal',
    path: 'basis.color.negative-inverse.bg-default',
  },
  {
    icon: 'palette',
    label: 'Kleur voor positief signaal',
    path: 'basis.color.positive-inverse.bg-default',
  },
  {
    icon: 'palette',
    label: 'Kleur voor waarschuwend signaal',
    path: 'basis.color.warning-inverse.bg-default',
  },
  {
    icon: 'palette',
    label: 'Kleur voor informatief signaal',
    path: 'basis.color.info-inverse.bg-default',
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
  @consume({ context: completedStepsContext, subscribe: true })
  completedSteps: string[] = [];

  override render() {
    const completedPaths = new Set(this.completedSteps);
    return html`
      <clippy-stack size="3xl">
        <div>
          ${STEPS.map((step) => {
            const href = `/wizard/${step.path.replaceAll('.', '-')}`;
            return html`
              <wizard-step-form-task-navigation
                href=${href}
                ?done=${completedPaths.has(step.path)}
                icon=${step.icon}
                label=${step.label}
              ></wizard-step-form-task-navigation>
            `;
          })}
        </div>
        ${
          completedPaths.size > 0
            ? html`
                <div class="utrecht-action-group utrecht-action-group--row">
                  <a href="/design-tokens/basis" class="nl-button nl-button--primary">
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
