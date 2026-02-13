export const STORAGE_TYPES = {
  LOCAL_STORAGE: 'localStorage',
  SESSION_STORAGE: 'sessionStorage',
} as const;

type StorageType = (typeof STORAGE_TYPES)[keyof typeof STORAGE_TYPES];

type Options = {
  onChange?: (event: StorageEvent) => void;
  prefix?: string;
  type?: StorageType;
};

const JSON_PREFIX = 'JSON';
const JSON_SUFFIX_DEFAULT = '_';
const SEPARATOR = ':';

type ObjectOrArray = Record<string, unknown> | unknown[];

export default class PersistentStorage {
  static readonly version = 0; // Helpful for when might need to migrate persisted data
  readonly #type: StorageType;
  readonly #backend: Storage;
  readonly #prefix: string;

  constructor({ onChange, prefix = '', type: requestedType = STORAGE_TYPES.LOCAL_STORAGE }: Options = {}) {
    let type = requestedType;
    const backupType = STORAGE_TYPES.SESSION_STORAGE;

    if (!PersistentStorage.#isSupported(type)) {
      if (type !== backupType) {
        console.error(`Cannot create persistent storage, no support for ${type}.`);
      }
      type = backupType;
      if (!PersistentStorage.#isSupported(backupType)) {
        throw new Error(`Cannot create persistent storage, no support for ${backupType}.`);
      }
    }

    this.#prefix = prefix;
    this.#type = type;
    this.#backend = window[type];

    globalThis.addEventListener('storage', (event) => {
      const [version, prefix] = event.key?.split(SEPARATOR) || [];
      if (version === `v${PersistentStorage.version}` && prefix === this.#prefix) {
        onChange?.(event);
      }
    });
  }

  get length() {
    return this.#backend.length;
  }

  get type() {
    return this.#type;
  }

  path(...args: string[]) {
    const v = `v${PersistentStorage.version}`;
    return [v, this.#prefix, ...args].filter(Boolean).join(SEPARATOR);
  }

  getItem(key: string, prefix: string = '') {
    return this.#backend.getItem(this.path(prefix, key));
  }

  getJSON(key: string = JSON_SUFFIX_DEFAULT) {
    const value = this.getItem(key, JSON_PREFIX);
    return value && JSON.parse(value);
  }

  removeItem(key: string, prefix: string = '') {
    this.#backend.removeItem(this.path(prefix, key));
  }

  removeJSON(key: string = JSON_SUFFIX_DEFAULT) {
    this.removeItem(key, JSON_PREFIX);
  }

  setItem(key: string, value: string, prefix: string = '') {
    this.#backend.setItem(this.path(prefix, key), value);
  }

  setJSON(key: string, value: ObjectOrArray): void;
  setJSON(value: ObjectOrArray): void;
  setJSON(keyOrValue: string | ObjectOrArray, value?: ObjectOrArray) {
    const key = typeof keyOrValue === 'string' ? keyOrValue : JSON_SUFFIX_DEFAULT;
    const data = value !== undefined ? value : keyOrValue;
    this.setItem(key, JSON.stringify(data), JSON_PREFIX);
  }

  /** @see: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API */
  static #isSupported(type: StorageType) {
    let storage;
    try {
      storage = window[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        e.name === 'QuotaExceededError' &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }
}
