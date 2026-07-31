// Prototype: grab the live Theme instance provided by `<theme-wizard-app>` without depending on
// Lit/`@lit/context` from this package — we just speak the context-request protocol directly.
// See https://github.com/lit/lit/tree/main/packages/context, `createContext('theme')` is just the string 'theme'.
// One-shot fetch, not a subscription: matched stories are computed once on load and
// won't refresh if the user edits which basis token a story's colors reference —
// reload the page to recompute.
export async function getLiveTheme(host: Element): Promise<any> {
  // The provider (`<theme-wizard-app>`) has to be upgraded before it can answer a
  // context-request — there's no ContextRoot buffering unanswered requests in this app.
  await customElements.whenDefined('theme-wizard-app');

  return new Promise((resolve) => {
    const event = new Event('context-request', { bubbles: true, composed: true }) as Event & {
      context: string;
      contextTarget: Element;
      callback: (theme: unknown, unsubscribe?: () => void) => void;
      subscribe: boolean;
    };

    event.context = 'theme';
    event.contextTarget = host;
    event.callback = (theme) => resolve(theme);
    event.subscribe = false;

    host.dispatchEvent(event);
  });
}
