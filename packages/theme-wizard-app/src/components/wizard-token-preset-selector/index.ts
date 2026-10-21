import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './styles';

const tag = 'wizard-token-preset-selector';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenPresetSelector;
  }
}

@customElement(tag)
export class WizardTokenPresetSelector extends LitElement {
  static override readonly styles = [styles];

  // TODO: figure out if current theme $values are equal to one of the presets
  // TODO: What to show if the current theme values don't match a preset?
  // TODO: decide on how to decide which story to show
  // TODO: where are we going to get the presets from?

  override render() {
    // render previous/next buttons
    // render clippy-story-preview + clippy-html-image
    // const themeWithPreset = applyPreset(this.theme, this.currentPreset)
    // render(
    //  <clippy-theme-context theme={themeWithPreset}>
    //    <clippy-html-image>
    //      <clippy-react-story .story={}></clippy-react-story>
    //    </clippy-html-image>
    //  <clippy-theme-context>
    // )
    return html`PRESET SELECTOR`;
  }
}
