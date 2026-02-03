/**
 * Custom Elements Type Definitions
 * 
 * This file provides TypeScript definitions for custom web components used in the application.
 * It extends JSX.IntrinsicElements to include both clippy-* and template-* custom elements.
 */

declare namespace JSX {
  interface IntrinsicElements {
    // Clippy Components (from @nl-design-system-community/clippy-components)
    'clippy-button': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
        class?: string;
        'aria-label'?: string;
      },
      HTMLElement
    >;

    'clippy-heading': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        level?: 1 | 2 | 3 | 4 | 5 | 6;
        appearance?: 'level-1' | 'level-2' | 'level-3' | 'level-4' | 'level-5' | 'level-6';
        id?: string;
        class?: string;
      },
      HTMLElement
    >;

    'clippy-code': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

    'clippy-color-combobox': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        value?: string;
        name?: string;
        label?: string;
      },
      HTMLElement
    >;

    'clippy-combobox': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        value?: string;
        name?: string;
        label?: string;
      },
      HTMLElement
    >;

    'clippy-font-combobox': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        value?: string;
        name?: string;
        label?: string;
      },
      HTMLElement
    >;

    'clippy-html-image': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
      },
      HTMLElement
    >;

    'clippy-icon': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        name?: string;
      },
      HTMLElement
    >;

    'clippy-modal': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        open?: boolean;
      },
      HTMLElement
    >;

    'clippy-link': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        href?: string;
        target?: '_blank' | '_self' | '_parent' | '_top';
        rel?: string;
      },
      HTMLElement
    >;

    // Template Components (local web components)
    'template-action': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        href?: string;
        label?: string;
      },
      HTMLElement
    >;

    'template-case-card': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        title?: string;
        description?: string;
        href?: string;
      },
      HTMLElement
    >;

    'template-color-swatch': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        color?: string;
        label?: string;
      },
      HTMLElement
    >;

    'template-heading': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        level?: 1 | 2 | 3 | 4 | 5 | 6;
      },
      HTMLElement
    >;

    'template-link': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        href?: string;
        target?: '_blank' | '_self' | '_parent' | '_top';
        rel?: string;
      },
      HTMLElement
    >;

    'template-link-list': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        heading?: string;
      },
      HTMLElement
    >;

    'template-page-header': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

    'template-paragraph': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

    'template-side-nav': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        items?: string;
      },
      HTMLElement
    >;

    'template-skip-link': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        href?: string;
      },
      HTMLElement
    >;
  }
}

export {};
