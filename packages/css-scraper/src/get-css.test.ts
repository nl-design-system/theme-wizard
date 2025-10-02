import { test, expect, describe } from 'vitest';
import { isLocalhostUrl } from './get-css';

describe('isLocalhostUrl', () => {
  test('localhost', () => {
    expect(isLocalhostUrl('http://localhost')).toBeTruthy();
    expect(isLocalhostUrl('http://localhost:8080')).toBeTruthy();
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
});
