import React, { createElement, type ComponentType, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { WizardStory } from '../wizard-story';

// Error boundary component
class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null, hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { error, hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught error:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return createElement(
        'div',
        { style: { color: 'red', padding: '10px' } },
        `Error rendering story: ${this.state.error?.message}`,
      );
    }

    return this.props.children;
  }
}

const tag = 'wizard-story-react';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStoryReact;
  }
}

// Global error handler for React errors that happen asynchronously
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.error?.message?.includes('Objects are not valid as a React child')) {
      console.error('Caught React invalid child error:', event.error);
      // Prevent the error from propagating
      event.preventDefault();
    }
  });
}

/**
 * React-specific CSF story renderer.
 * Extends WizardStory base class and handles both simple props and custom story render functions.
 */
export class WizardStoryReact extends WizardStory {
  protected _renderRoot: Root | null = null;
  protected _lastRenderedStory: unknown = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public React: any = React;

  override connectedCallback() {
    super.connectedCallback();
    if (!this._renderRoot) {
      const container = document.createElement('div');
      // Render into light DOM instead of shadow DOM to avoid React issues
      this.appendChild(container);
      this._renderRoot = createRoot(container);
      console.debug('Created React root in light DOM');
    }

    if (this.shadowRoot) {
      this.shadowRoot.adoptedStyleSheets.push(this.theme.stylesheet);

      // Apply story styles from property
      if (this.storyStyleSheets) {
        this.shadowRoot.adoptedStyleSheets.push(...this.storyStyleSheets);
      }
    }

    // Trigger render after connected
    this.render();
  }

  override updated() {
    // Only render if story or meta actually changed
    if (this._lastRenderedStory !== this.story) {
      this.render();
    }
  }

  override render() {
    if (!this.meta?.component || !this.story || !this._renderRoot) {
      console.debug('WizardStoryReact render skipped:', {
        hasComponent: !!this.meta?.component,
        hasRenderRoot: !!this._renderRoot,
        hasStory: !!this.story,
      });
      return;
    }

    const Component = this.meta.component as ComponentType<unknown>;
    const defaultArgs = this.meta.args || {};
    const args = {
      ...defaultArgs,
      ...this.story?.args,
    };

    let componentRendering: ReactNode;

    // Make the passed-in React available globally for story render functions that use JSX
    if (typeof globalThis !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).React = this.React;
    }

    // Check if any args contain JSX elements (which would cause issues)
    const argsWithJSX: string[] = [];
    Object.entries(args).forEach(([key, value]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (value && typeof value === 'object' && (value as any).$$typeof) {
        argsWithJSX.push(key);
      }
    });

    console.debug('Story info:', {
      args: Object.keys(args),
      argsWithJSX,
      componentName: this.story?.name,
      componentType: typeof Component,
      hasComponent: !!Component,
    });

    // Check if story has a custom render function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storyWithRender = this.story as any;
    if (storyWithRender?.render && typeof storyWithRender.render === 'function') {
      try {
        console.debug('Calling custom story render function');
        componentRendering = storyWithRender.render(args, {
          component: Component,
          React: this.React,
        });
      } catch (error) {
        componentRendering = 'Error: could not render component';
        console.error('Error in story render function:', error);
      }
    } else {
      try {
        console.debug('Creating element from component');
        componentRendering = createElement(Component as never, args);
      } catch (error) {
        componentRendering = 'Error: could not render component';
        console.error('Error creating element:', error);
      }
    }

    console.debug('Rendering:', {
      componentRendering,
      // @ts-expect-error REMOVE ME
      isReactElement: typeof componentRendering === 'object' && componentRendering?.$$typeof,
    });

    try {
      // Wrap in error boundary to catch React errors
      const wrappedComponent = createElement(ErrorBoundary, null, componentRendering);
      this._renderRoot.render(wrappedComponent);
      this._lastRenderedStory = this.story;
    } catch (error) {
      console.error('React render error:', error);
      console.error('Attempted to render:', componentRendering);
      console.error('With args:', args);
      // Try rendering an error message instead
      this._renderRoot.render(
        createElement(
          'div',
          {},
          `Error rendering component: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ),
      );
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._renderRoot?.unmount();
    this._renderRoot = null;
  }

  /**
   * Disable Lit's default rendering since we're using React
   */
  protected override createRenderRoot() {
    // Return a dummy element so Lit doesn't render into shadow DOM
    return this;
  }
}

customElements.define(tag, WizardStoryReact);
