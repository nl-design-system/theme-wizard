import { beforeEach, describe, expect, it } from 'vitest';
import { mockLocalStorage, mockSessionStorage } from '../../../test/mocks/Storage';
import PersistentStorage, { STORAGE_TYPES } from './index';

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('PersistentStorage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
    });
    mockLocalStorage.clear();
  });

  it('should expose used storage type', () => {
    for (const key in STORAGE_TYPES) {
      const type = STORAGE_TYPES[key as keyof typeof STORAGE_TYPES];
      const storage = new PersistentStorage({ type });
      expect(storage.type).toBe(type);
    }
    const storage = new PersistentStorage();
    expect(storage.type).toBe(STORAGE_TYPES.LOCAL_STORAGE);
  });

  it('should support to localStorage', () => {
    const storage = new PersistentStorage({ type: 'localStorage' });
    const key = 'testKey';
    const value = 'testValue';
    storage.setItem(key, value);
    const localStorageKey = storage.path(key);
    expect(localStorage.getItem(localStorageKey)).toBe(value);
  });

  it('should support to sessionStorage', () => {
    const storage = new PersistentStorage({ type: 'sessionStorage' });
    const key = 'testKey';
    const value = 'testValue';
    storage.setItem(key, value);
    const sessionStorageKey = storage.path(key);
    expect(sessionStorage.getItem(sessionStorageKey)).toBe(value);
  });

  it('should default to localStorage', () => {
    const storage = new PersistentStorage();
    const key = 'testKey';
    const value = 'testValue';
    storage.setItem(key, value);
    const localStorageKey = storage.path(key);
    expect(localStorage.getItem(localStorageKey)).toBe(value);
  });

  it('should fallback to sessionStorage', () => {
    /** @see: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API */
    Object.defineProperty(window, 'localStorage', {
      value: {
        ...mockLocalStorage,
        setItem: () => {
          throw new Error();
        },
      },
    });
    const storage = new PersistentStorage({ type: 'localStorage' });
    const key = 'testKey';
    const value = 'testValue';
    const sessionStorageKey = storage.path(key);
    storage.setItem(key, value);
    expect(storage.type).toBe(STORAGE_TYPES.SESSION_STORAGE);
    expect(sessionStorage.getItem(sessionStorageKey)).toBe(value);
  });

  it('should expose number of items in storage', () => {
    const storage = new PersistentStorage();
    const key = 'testKey';
    const value = 'testValue';
    const length = 3;
    for (let i = 0; i < length; i++) {
      storage.setItem(`${key}-${i}`, value);
    }
    expect(storage.length).toBe(length);
  });

  it('should store and retrieve items', () => {
    const storage = new PersistentStorage();
    const key = 'testKey';
    const value = 'testValue';
    storage.setItem(key, value);
    expect(storage.getItem(key)).toBe(value);
  });

  it('should remove string items', () => {
    const storage = new PersistentStorage();
    const key = 'testKey';
    const value = 'testValue';
    storage.setItem(key, value);
    expect.soft(storage.getItem(key)).toBe(value);
    storage.removeItem(key);
    expect(storage.getItem(key)).toBeNull();
  });

  it('should allow namespacing of storage', () => {
    const key = 'testKey';
    const storages = ['A', 'B'].map((namespace) => {
      const storage = new PersistentStorage({ prefix: namespace });
      storage.setItem(key, `testValue${namespace}`);
      return storage;
    });
    const [itemA, itemB] = storages.map((storage) => storage.getItem(key));
    expect(itemA).not.toBe(itemB);
  });

  it('should store and retrieve JSON', () => {
    const storage = new PersistentStorage();
    const key = 'testKey';
    const object = { a: 'b' };
    storage.setJSON(key, object);
    expect(storage.getJSON(key)).toMatchObject(object);
  });

  it('should remove object items', () => {
    const storage = new PersistentStorage();
    const key = 'testKey';
    const object = { a: 'b' };
    storage.setJSON(key, object);
    expect.soft(storage.getJSON(key)).toMatchObject(object);
    storage.removeJSON(key);
    expect(storage.getJSON(key)).toBeNull();
  });

  it('should store and retrieve JSON without a key', () => {
    const storage = new PersistentStorage();
    const object = { a: 'b' };
    storage.setJSON(object);
    expect(storage.getJSON()).toMatchObject(object);
  });

  it('should allow namespacing with JSON', () => {
    const key = 'testKey';
    const storages = ['A', 'B'].map((namespace) => {
      const storage = new PersistentStorage({ prefix: namespace });
      storage.setJSON(key, { key, namespace });
      return storage;
    });
    const [itemA, itemB] = storages.map((storage) => storage.getJSON(key));
    expect(itemA).not.toMatchObject(itemB);
  });
});
