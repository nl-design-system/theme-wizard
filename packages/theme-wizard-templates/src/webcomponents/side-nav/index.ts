import sidenavStyles from '@gemeente-denhaag/side-navigation/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('template-side-nav')
export class TemplateSideNav extends LitElement {
  static override readonly styles = [unsafeCSS(sidenavStyles)];

  override render() {
    return html`
      <nav class="denhaag-side-navigation">
        <ul class="denhaag-side-navigation__list">
          <li class="denhaag-side-navigation__item">
            <a
              aria-current="page"
              class="denhaag-side-navigation__link denhaag-side-navigation__link--current"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                fill="none"
                viewBox="0 0 24 24"
                class="denhaag-icon"
                focusable="false"
                aria-hidden="true"
                shape-rendering="auto"
              >
                <path
                  fill="currentColor"
                  d="M3 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm6 0H5v4h4zm4 0a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2zm6 0h-4v4h4zM3 15a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm6 0H5v4h4zm4 0a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2zm6 0h-4v4h4z"
                ></path>
              </svg>
              Overzicht
            </a>
          </li>
        </ul>

        <ul class="denhaag-side-navigation__list">
          <li class="denhaag-side-navigation__item">
            <a class="denhaag-side-navigation__link" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                class="denhaag-icon"
                focusable="false"
                aria-hidden="true"
                shape-rendering="auto"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                ></path>
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M22 4 12 14.01l-3-3"
                ></path>
              </svg>
              Mijn taken
            </a>
          </li>

          <li class="denhaag-side-navigation__item">
            <a class="denhaag-side-navigation__link" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                fill="none"
                viewBox="0 0 24 24"
                class="denhaag-icon"
                focusable="false"
                aria-hidden="true"
                shape-rendering="auto"
              >
                <path
                  fill="currentColor"
                  d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm2 9v5h14v-5h-2.28l-.771 2.316A1 1 0 0 1 15 17H9a1 1 0 0 1-.949-.684L7.28 14zm14-2V5H5v7h2.28a2 2 0 0 1 1.897 1.367L9.72 15h4.558l.544-1.633A2 2 0 0 1 16.721 12z"
                ></path>
              </svg>
              <span class="denhaag-side-navigation__link-label">
                Mijn berichten<span class="nl-number-badge">2</span>
              </span>
            </a>
          </li>

          <li class="denhaag-side-navigation__item">
            <a class="denhaag-side-navigation__link" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                fill="none"
                viewBox="0 0 24 24"
                class="denhaag-icon"
                focusable="false"
                aria-hidden="true"
                shape-rendering="auto"
              >
                <path
                  fill="currentColor"
                  d="M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 0 1-1.017 1.742Q21 8.868 21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9q0-.131.017-.258A2 2 0 0 1 2 7zm18 2V5H4v2zM5 9v10h14V9zm3 3a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1"
                ></path>
              </svg>
              Mijn zaken
            </a>
          </li>
        </ul>

        <ul class="denhaag-side-navigation__list">
          <li class="denhaag-side-navigation__item">
            <a class="denhaag-side-navigation__link" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                fill="none"
                viewBox="0 0 24 24"
                class="denhaag-icon"
                focusable="false"
                aria-hidden="true"
                shape-rendering="auto"
              >
                <path
                  fill="currentColor"
                  d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8M6 8a6 6 0 1 1 12 0A6 6 0 0 1 6 8m2 10a3 3 0 0 0-3 3 1 1 0 1 1-2 0 5 5 0 0 1 5-5h8a5 5 0 0 1 5 5 1 1 0 1 1-2 0 3 3 0 0 0-3-3z"
                ></path>
              </svg>
              Mijn gegevens
            </a>
          </li>
        </ul>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'template-side-nav': TemplateSideNav;
  }
}
