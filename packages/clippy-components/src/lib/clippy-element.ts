import { LitElement } from 'lit';

type ClippyElementType = typeof ClippyElement;

export class ClippyElement extends LitElement {
  static readonly dependencies: Record<string, ClippyElementType> = {};

  static readonly tagName: string;

  constructor() {
    super();
    Object.entries((this.constructor as ClippyElementType).dependencies).forEach(([name, component]) => {
      (this.constructor as ClippyElementType).define(name, component);
    });
  }

  static define(tagName = this.tagName, elementConstructor = this, options: ElementDefinitionOptions = {}) {
    if (!tagName) {
      throw new Error(`${this.name} does not have a defined tag name.`);
    }

    const currentlyRegisteredConstructor = customElements.get(tagName) as ClippyElementType | CustomElementConstructor;

    if (!currentlyRegisteredConstructor) {
      // We try to register as the actual class first. If for some reason that fails, we fall back to anonymous classes.
      // customElements can only have 1 class of the same "object id" per registry, so that is why the try {} catch {} exists.
      // Some tools like Jest Snapshots and if you import the constructor and call `new ClippyButton()` they will fail with
      //   the anonymous class version.
      try {
        customElements.define(tagName, elementConstructor, options);
      } catch (_err) {
        customElements.define(tagName, class extends elementConstructor {}, options);

        console.error(_err);
      }
    }
  }
}
