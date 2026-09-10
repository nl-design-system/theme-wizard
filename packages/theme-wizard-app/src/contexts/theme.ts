import { ContextRoot, createContext } from '@lit/context';
import type Theme from '../lib/Theme';

/**
 * Context for sharing Theme instance across route components
 */
export const themeContext = createContext<Theme>('theme');

// Consumers (e.g. `wizard-story-matches`, loaded via its own package subpath chunk) can upgrade
// and dispatch their context-request before the `theme-wizard-app` provider chunk has registered
// its listeners — depending on script/chunk load order, that request is otherwise lost for good.
// A ContextRoot buffers unanswered requests and replays them once a matching provider announces
// itself, so consumer/provider registration order stops mattering. Guarded so re-evaluating this
// module from a second bundle chunk doesn't attach (and double-buffer) a second root.
declare global {
  interface Window {
    __themeContextRootAttached?: boolean;
  }
}
if (typeof document !== 'undefined' && !window.__themeContextRootAttached) {
  window.__themeContextRootAttached = true;
  new ContextRoot().attach(document.body);
}
