const STORAGE_TYPES = {
  LOCAL_STORAGE: 'localStorage',
  SESSION_STORAGE: 'sessionStorage',
} as const;

type StorageType = (typeof STORAGE_TYPES)[keyof typeof STORAGE_TYPES];

type Options = {
  type?: StorageType;
  prefix?: string;
};

const JSON_PREFIX = 'JSON';
const JSON_SUFFIX_DEFAULT = '_';

export default class PersistentStorage {
  #type: StorageType;
  #backend: Storage;
  #prefix: string;

  constructor({ prefix = '', type: requestedType = STORAGE_TYPES.LOCAL_STORAGE }: Options = {}) {
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
  }

  get length() {
    return this.#backend.length;
  }

  get type() {
    return this.#type;
  }

  path(key: string) {
    return `${this.#prefix}:${key}`;
  }

  getItem(key: string) {
    return this.#backend.getItem(this.path(key));
  }

  getJSON(key: string = JSON_SUFFIX_DEFAULT) {
    const value = this.getItem(`${JSON_PREFIX}:${key}`);
    return value && JSON.parse(value);
  }

  key(index: number) {
    return this.#backend.key(index);
  }

  removeItem(key: string) {
    this.#backend.removeItem(this.path(key));
  }

  removeJSON(key: string = JSON_SUFFIX_DEFAULT) {
    this.removeItem(`${JSON_PREFIX}:${key}`);
  }

  setItem(key: string, value: string) {
    this.#backend.setItem(this.path(key), value);
  }

  setJSON(value: Record<string, unknown>, key: string = JSON_SUFFIX_DEFAULT) {
    this.setItem(`${JSON_PREFIX}:${key}`, JSON.stringify(value));
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
