import { full } from '@nl-design-system-community/clippy-components/src/clippy-side-navigation/fixtures.js';
import { html } from 'lit';
import '@nl-design-system-community/clippy-components/clippy-layout';
import '@nl-design-system-community/clippy-components/clippy-main';
import '@nl-design-system-community/clippy-components/clippy-side-navigation';
import '@nl-design-system-community/clippy-components/clippy-heading';
import '@nl-design-system-candidate/paragraph-css/paragraph.css';

// Prettier ignore to prevent double-quotes
// prettier-ignore
export const createOverviewTemplate = () => html`
  <clippy-layout>
    <clippy-side-navigation items='${JSON.stringify(full)}' slot="sidebar"></clippy-side-navigation>
    <mark slot="breadcrumb">Home / Blog / De titel van een artikel</mark>
    <clippy-main>
      <clippy-heading level="2" slot="header">De titel van een artikel</clippy-heading>
      <p class="nl-paragraph" slot="aside">Geschreven door: Piet Pietersen</p>
      <p class="nl-paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.</p>
    </clippy-main>
  </clippy-layout>
`;

// Prettier ignore to prevent double-quotes
// prettier-ignore
export const createDetailTemplate = () => html`
  <clippy-layout purpose="detail">
    <clippy-side-navigation items='${JSON.stringify(full)}' slot="sidebar"></clippy-side-navigation>
    <mark slot="breadcrumb">Home / Blog / De titel van een artikel</mark>
    <clippy-main purpose="detail">
      <clippy-heading level="2" slot="header">De titel van een artikel</clippy-heading>
      <p class="nl-paragraph" slot="aside">Geschreven door: Piet Pietersen</p>
      <p class="nl-paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.</p>
    </clippy-main>
  </clippy-layout>
`;

// Prettier ignore to prevent double-quotes
// prettier-ignore
export const createSingleColumnTemplate = () => html`
  <clippy-layout size="sm">
    <mark slot="breadcrumb">Home / Blog / De titel van een artikel</mark>
    <clippy-main>
      <clippy-heading level="2" slot="header">De titel van een artikel</clippy-heading>
      <p class="nl-paragraph" slot="aside">Geschreven door: Piet Pietersen</p>
      <p class="nl-paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.</p>
    </clippy-main>
  </clippy-layout>
`;
