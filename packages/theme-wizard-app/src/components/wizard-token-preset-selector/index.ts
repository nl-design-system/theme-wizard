import { consume } from '@lit/context';
import { isTokenGroup, isTokenGroupOfType } from '@nl-design-system-community/design-tokens-schema';
import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
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

  @consume({ context: themeContext, subscribe: true })
  private readonly theme!: Theme;

  @property()
  path: string = '';

  // TODO: figure out if current theme $values are equal to one of the presets
  // TODO: What to show if the current theme values don't match a preset?
  // TODO: decide on how to decide which story to show
  // TODO: where are we going to get the presets from?

  override render() {
    const group = this.theme.at(this.path);
    if (isTokenGroup(group) && isTokenGroupOfType(group, 'color')) {
      return html`COLOR TOKEN GROUP`;
    }
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
    return nothing;
  }
}
