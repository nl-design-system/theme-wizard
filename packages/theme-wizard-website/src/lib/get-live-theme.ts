// `<theme-wizard-app>` keeps a `<clippy-theme-context>` bridge in its shadow root in sync with
// its own theme state, so we can just read that instead of speaking `@lit/context`'s
// `context-request` protocol ourselves.
export async function getThemeTokens(host: Element): Promise<Record<PropertyKey, unknown> | undefined> {
  await customElements.whenDefined('theme-wizard-app');

  const app = host.closest('theme-wizard-app') ?? document.querySelector('theme-wizard-app');
  if (!app) return undefined;

  await (app as unknown as { updateComplete: Promise<boolean> }).updateComplete;

  const bridge = app.shadowRoot?.querySelector('clippy-theme-context');
  return (bridge as unknown as { tokens?: Record<PropertyKey, unknown> } | null)?.tokens;
}
