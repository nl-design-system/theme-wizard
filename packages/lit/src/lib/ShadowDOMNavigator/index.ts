const MAX_DOM_TRAVERSAL_DEPTH = 30;

/**
 * Utility class for navigating and manipulating Shadow DOM trees
 * Provides methods to find elements across shadow boundaries and expand collapsed details
 */
export class ShadowDOMNavigator {
  /**
   * Finds an element by recursively searching through shadow DOM boundaries
   * Optimized to check light DOM first, then recursively search shadow roots
   * @param root - Root element to start search from
   * @param selector - CSS selector to match
   * @returns Found element or null
   */
  findElement(root: Document | ShadowRoot | HTMLElement, selector: string): HTMLElement | null {
    // Try direct query first (most common case - element in light DOM)
    const directMatch = root.querySelector(selector);
    if (directMatch instanceof HTMLElement) {
      return directMatch;
    }

    // Search in nested shadow roots
    const allElements = Array.from(root.querySelectorAll('*'));
    for (const element of allElements) {
      if (!element.shadowRoot) {
        continue;
      }

      // Recursively search this shadow root
      const found = this.findElement(element.shadowRoot, selector);
      if (found) {
        return found;
      }
    }

    return null;
  }

  /**
   * Expands all parent <details> elements by traversing up through shadow DOM boundaries
   * This ensures collapsed sections are opened when navigating to a token
   * @param element - The element to start traversal from
   */
  expandParentDetails(element: HTMLElement): void {
    let current: Node | null = element;
    let depth = 0;

    while (current && depth < MAX_DOM_TRAVERSAL_DEPTH) {
      if (current instanceof HTMLDetailsElement && !current.open) {
        current.open = true;
      }

      current = this.#getParentNode(current);
      depth++;
    }
  }

  /**
   * Gets the parent node, handling shadow DOM boundaries
   * @param node - Node to get parent of
   * @returns Parent node or null if at root
   */
  #getParentNode(node: Node): Node | null {
    // Standard DOM hierarchy
    if (node.parentNode) {
      return node.parentNode;
    }

    // Shadow root boundary - jump to host element
    if (node instanceof ShadowRoot) {
      return node.host;
    }

    // Element inside shadow root - get host via getRootNode
    if (node instanceof Element) {
      const root = node.getRootNode();
      if (root instanceof ShadowRoot) {
        return root.host;
      }
    }

    return null;
  }
}
