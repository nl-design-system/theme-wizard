// Prototype: grab the live Theme instance provided by `<theme-wizard-app>` without depending on
// Lit/`@lit/context` from this package — we just speak the context-request protocol directly.
// See https://github.com/lit/lit/tree/main/packages/context, `createContext('theme')` is just the string 'theme'.
export async function subscribeToLiveTheme(host: Element, callback: (theme: any) => void): Promise<void> {
  // The provider (`<theme-wizard-app>`) has to be upgraded before it can answer a
  // context-request — there's no ContextRoot buffering unanswered requests in this app.
  await customElements.whenDefined('theme-wizard-app');

  const event = new Event('context-request', { bubbles: true, composed: true }) as Event & {
    context: string;
    contextTarget: Element;
    callback: (theme: unknown, unsubscribe?: () => void) => void;
    subscribe: boolean;
  };

  event.context = 'theme';
  event.contextTarget = host;
  event.callback = (theme) => callback(theme);
  event.subscribe = true;

  host.dispatchEvent(event);
}
