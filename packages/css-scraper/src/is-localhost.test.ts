import { test, expect } from 'vitest';
import { isLocalhostUrl } from './is-localhost';

test('localhost', () => {
  expect(isLocalhostUrl('http://localhost')).toBeTruthy();
  expect(isLocalhostUrl('http://localhost:8080')).toBeTruthy();
  expect(isLocalhostUrl('HTTP://LOCALHOST:8080')).toBeTruthy();
});

test('127.0.0.1', () => {
  expect(isLocalhostUrl('http://127.0.0.1/')).toBeTruthy();
  expect(isLocalhostUrl('http://127.0.0.1/hello-world')).toBeTruthy();
  expect(isLocalhostUrl('http://127.0.0.1:8080')).toBeTruthy();
});

test('192.168.*.*', () => {
  expect(isLocalhostUrl('http://192.168.0.0')).toBeTruthy();
  expect(isLocalhostUrl('http://192.168.1.1')).toBeTruthy();
});

test('allows a URL object', () => {
  expect(isLocalhostUrl(new URL('http://localhost'))).toBeTruthy();
});

test('example.com', () => {
  expect(isLocalhostUrl('https://example.com')).toBeFalsy();
});

test('does not throw on <empty string>', () => {
  expect(() => isLocalhostUrl('')).not.toThrow();
  expect(isLocalhostUrl('')).toBeFalsy();
});
