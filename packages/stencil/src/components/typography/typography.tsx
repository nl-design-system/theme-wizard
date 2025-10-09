/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import type { EventEmitter } from '@stencil/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Event, Prop, h } from '@stencil/core';
import { DEFAULT_TYPOGRAPHY, EVENT_NAMES, FONT_OPTIONS } from '../../constants';

@Component({
  shadow: true,
  styleUrl: 'typography.css',
  tag: 'theme-wizard-typography',
})
export class TypographyComponent {
  @Prop() headingFont: string = DEFAULT_TYPOGRAPHY.headingFont;
  @Prop() bodyFont: string = DEFAULT_TYPOGRAPHY.bodyFont;

  @Event({ eventName: EVENT_NAMES.TYPOGRAPHY_CHANGE }) typographyChange!: EventEmitter<{
    [key: string]: string;
  }>;

  /**
   * Handle change event - emit to parent (sidebar)
   * @param e - Event
   */
  private readonly handleChange = (e: Event): void => {
    const { name, value } = e.target as HTMLSelectElement;
    this.typographyChange.emit({ [name]: value });
  };

  render() {
    return (
      <section class="theme-typography" aria-labelledby="typography-heading">
        <h2 class="theme-typography__heading" id="typography-heading">
          Typografie
        </h2>

        <div class="theme-form-field">
          <label htmlFor="headingFont" class="theme-form-field__label">
            Heading Font
          </label>
          <select id="headingFont" name="headingFont" class="theme-form-field__select" onChange={this.handleChange}>
            {FONT_OPTIONS.map((opt) => (
              <option value={opt.value} selected={opt.value === this.headingFont}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div class="theme-form-field">
          <label htmlFor="bodyFont" class="theme-form-field__label">
            Body Font
          </label>
          <select id="bodyFont" name="bodyFont" class="theme-form-field__select" onChange={this.handleChange}>
            {FONT_OPTIONS.map((opt) => (
              <option value={opt.value} selected={opt.value === this.bodyFont}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>
    );
  }
}
