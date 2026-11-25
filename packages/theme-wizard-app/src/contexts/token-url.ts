import { ContextProvider, createContext } from '@lit/context';

/**
 * Resolves a token path (e.g. `basis.color.accent-1`) to the URL of the page documenting it.
 * Return `undefined` when no such page exists — consumers should then not render a link.
 */
export type TokenUrlResolver = (tokenPath: string) => string | undefined;

/**
 * Context for sharing the TokenUrlResolver from the host application (e.g. an Astro website)
 * with wizard components. The app itself has no knowledge of the host's routing or pages.
 */
export const tokenUrlContext = createContext<TokenUrlResolver>('token-url');

/**
 * Hosts call this once, on an ancestor of the wizard components (e.g. `document.body`), to
 * provide the resolver. Context requests made before this call are buffered by the
 * ContextRoot (attached in `contexts/theme.ts`) and answered once the provider is attached.
 */
export const provideTokenUrlResolver = (host: HTMLElement, resolver: TokenUrlResolver): void => {
  new ContextProvider(host, { context: tokenUrlContext, initialValue: resolver });
};
