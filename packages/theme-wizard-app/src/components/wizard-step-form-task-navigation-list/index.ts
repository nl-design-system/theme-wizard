import '../wizard-step-form-task-navigation';
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { stepsStorage } from '../../utils/wizard-steps-storage';

const STEPS = [
  {
    label: 'Lettertype voor tekst',
    path: 'basis.text.font-family.default',
  },
  {
    label: 'Kleur voor tekst',
    path: 'basis.color.default.color-document',
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
      ${STEPS.map(({ label, path }) => {
        const href = `/wizard/${path.replaceAll('.', '-')}`;
        return html`
          <wizard-step-form-task-navigation href=${href} ?done=${this.completedPaths.has(path)}>
            ${label}
          </wizard-step-form-task-navigation>
        `;
      })}
    `;
  }
}
