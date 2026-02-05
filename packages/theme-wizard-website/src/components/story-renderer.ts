import { createElement } from 'react';
import './react-renderer';
import type { ReactRenderer } from './react-renderer';

export class StoryRenderer extends HTMLElement {
  private reactRenderer: ReactRenderer | null = null;

  connectedCallback() {
    this.reactRenderer = document.createElement('react-renderer') as ReactRenderer;
    this.appendChild(this.reactRenderer);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderStory(story: any, Component: any, args: any = {}) {
    if (this.reactRenderer) {
      // If the story has a custom render function, use it
      if (story.render) {
        this.reactRenderer.render(story.render(args, { component: Component }));
      } else {
        // Otherwise render the component with the args
        this.reactRenderer.render(createElement(Component, args));
      }
    }
  }
}

customElements.define('story-renderer', StoryRenderer);
