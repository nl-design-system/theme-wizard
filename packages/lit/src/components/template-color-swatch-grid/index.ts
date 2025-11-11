// packages/lit/src/components/color-swatch-grid/index.ts
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';
import '../template-color-swatch';

@customElement('template-color-swatch-grid')
export class TemplateColorSwatchGrid extends LitElement {
  @property({ type: Array }) references: string[] = [];

  static override readonly styles = [styles];

  #sanitizeReference(reference: string): string {
    return reference.replaceAll('{', '').replaceAll('}', '');
  }

  #extractScale(reference: string): string {
    const segments = reference.split('.');
    return segments[2] ?? 'default';
  }

  #groupReferences(): Record<string, string[]> {
    const grouped: Record<string, string[]> = {};

    for (const reference of this.references) {
      const sanitized = this.#sanitizeReference(reference);
      const scale = this.#extractScale(sanitized);
      if (!grouped[scale]) {
        grouped[scale] = [];
      }
      grouped[scale].push(sanitized);
    }

    return grouped;
  }

  override render() {
    return html`
      <div class="template-color-swatch-grid">
        ${Object.entries(this.#groupReferences()).map(([scale, references]) => {
          const rowLabel = scale.replaceAll('-', ' ');
          const swatchCount = references.length || 1;
          return html`
            <section class="template-color-swatch-grid__row">
              <h3 class="template-color-swatch-grid__label">${rowLabel}</h3>
              <div class="template-color-swatch-grid__swatches" style=${`--swatch-count: ${swatchCount}`}>
                ${references.map(
                  (reference) => html`<template-color-swatch reference=${reference}></template-color-swatch>`,
                )}
              </div>
            </section>
          `;
        })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'template-color-swatch-grid': TemplateColorSwatchGrid;
  }
}
