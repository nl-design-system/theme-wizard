import '@nl-design-system-community/clippy-components/clippy-react-element';

import type { ClippyReactElement } from '@nl-design-system-community/clippy-components/clippy-react-element';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createElement, useEffect, useRef, useState } from 'react';

const meta: Meta = {
  id: 'clippy-react-element',
  parameters: {
    docs: {
      description: {
        component: `
\`<clippy-react-element>\` is een web component die een onafhankelijke React root host.
Het roept **imperatief** \`.render(element)\` aan om een React element te mounten of bij te werken.

Dit is handig voor het renderen van React componenten in shadow DOM contexten of Lit componenten
waar je React JSX niet simpelweg kunt nesten.`,
      },
    },
  },
  tags: ['autodocs'],
  title: 'Clippy/React Element',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `
import '@nl-design-system-community/clippy-components/clippy-react-element';
import { createElement } from 'react';

const el = document.createElement('clippy-react-element');
document.body.appendChild(el);

el.render(createElement('p', null, 'Hallo vanuit React'));
        `.trim(),
        language: 'js',
        type: 'code',
      },
    },
  },
  render: () =>
    createElement(() => {
      const ref = useRef<ClippyReactElement>(null);

      useEffect(() => {
        ref.current?.render(createElement('p', null, 'Hallo vanuit React'));
      }, []);

      return createElement('clippy-react-element', { ref });
    }),
};

export const WithUpdates: Story = {
  parameters: {
    docs: {
      source: {
        code: `
import '@nl-design-system-community/clippy-components/clippy-react-element';
import { createElement } from 'react';

const el = document.createElement('clippy-react-element');
document.body.appendChild(el);

// First render
el.render(createElement('p', null, 'Teller: 0'));

// Re-render with updated content — React reconciles, no full re-mount
el.render(createElement('p', null, 'Teller: 1'));
        `.trim(),
        language: 'js',
        type: 'code',
      },
    },
  },
  render: () =>
    createElement(() => {
      const ref = useRef<ClippyReactElement>(null);
      const [count, setCount] = useState(0);

      useEffect(() => {
        ref.current?.render(createElement('p', null, `Counter: ${count}`));
      }, [count]);

      return createElement(
        'div',
        null,
        createElement('clippy-react-element', { ref }),
        createElement('button', { onClick: () => setCount((n) => n + 1) }, 'Increment'),
      );
    }),
};

export const WithReactHooks: Story = {
  parameters: {
    docs: {
      source: {
        code: `
import '@nl-design-system-community/clippy-components/clippy-react-element';
import { createElement, useState } from 'react';

function Teller() {
  const [count, setCount] = useState(0);
  return createElement(
    'div',
    null,
    createElement('p', null, \`Counter: \${count}\`),
    createElement('button', { onClick: () => setCount((n) => n + 1) }, 'Increment'),
  );
}

const el = document.createElement('clippy-react-element');
document.body.appendChild(el);

// Initial render, the component controls its own state from here on
el.render(createElement(Teller));
        `.trim(),
        language: 'js',
        type: 'code',
      },
    },
  },
  render: () =>
    createElement(() => {
      const ref = useRef<ClippyReactElement>(null);

      useEffect(() => {
        function Teller() {
          const [count, setCount] = useState(0);
          return createElement(
            'div',
            null,
            createElement('p', null, `Counter: ${count}`),
            createElement('button', { onClick: () => setCount((n) => n + 1) }, 'Increment'),
          );
        }

        ref.current?.render(createElement(Teller));
      }, []);

      return createElement('clippy-react-element', { ref });
    }),
};

export const InsideShadowDOM: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Dit toont het patroon dat `wizard-story-react` gebruikt: een Lit component voegt `clippy-react-element` toe aan zijn shadow root en roept vervolgens `.render()` aan om een React tree te mounten, geïsoleerd van het buitenste document.',
      },
      source: {
        code: `
import '@nl-design-system-community/clippy-components/clippy-react-element';
import { LitElement, html } from 'lit';
import { createElement } from 'react';

class MyLitComponent extends LitElement {
  private reactElement = null;

  connectedCallback() {
    super.connectedCallback();
    this.reactElement = document.createElement('clippy-react-element');
    this.shadowRoot.appendChild(this.reactElement);
  }

  protected render() {
    this.reactElement?.render(createElement('p', null, 'Gerenderd door React in shadow DOM'));
    return html\`<slot></slot>\`;
  }
}

customElements.define('mijn-lit-component', MyLitComponent);
        `.trim(),
        language: 'js',
        type: 'code',
      },
    },
  },
  render: () => createElement(InsideShadowDOMDemo),
};

function InsideShadowDOMDemo() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current || hostRef.current.shadowRoot) return;

    const shadow = hostRef.current.attachShadow({ mode: 'open' });
    const element = document.createElement('clippy-react-element') as ClippyReactElement;
    shadow.appendChild(element);
    element.render(createElement('p', null, 'Gerenderd door React in shadow DOM'));
  }, []);

  return createElement('div', { ref: hostRef });
}
