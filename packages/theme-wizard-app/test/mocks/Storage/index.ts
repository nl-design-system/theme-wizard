class MockStorage {
  #store = new Map();

  getItem(key: string) {
    const value = this.#store.get(key);
    return value !== undefined ? value : null;
  }

  setItem(key: string, value: unknown) {
    this.#store.set(key, String(value));
  }

  removeItem(key: string) {
    this.#store.delete(key);
  }

  clear() {
    this.#store.clear();
  }

  key(index: number) {
    const keys = Array.from(this.#store.keys());
    return keys[index] !== undefined ? keys[index] : null;
  }

  get length() {
    return this.#store.size;
  }

  *[Symbol.iterator]() {
    for (const [key, value] of this.#store) {
      yield [key, value];
    }
  }
}

export const mockLocalStorage = new MockStorage();
export const mockSessionStorage = new MockStorage();

export default {
  localStorage: mockLocalStorage,
  sessionStorage: mockSessionStorage,
};
