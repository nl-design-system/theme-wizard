import '../wizard-step-form-task-navigation';
import { LitElement, html } from 'lit';
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
  {
    icon: 'palette',
    label: 'Achtergrondkleur voor knoppen',
    path: 'basis.color.action-1.bg-default',
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
      ${STEPS.map((step) => {
        const href = `/wizard/${step.path.replaceAll('.', '-')}`;
        return html`
          <wizard-step-form-task-navigation href=${href} ?done=${this.completedPaths.has(step.path)} icon=${step.icon}>
            ${step.label}
          </wizard-step-form-task-navigation>
        `;
      })}
    `;
  }
}
