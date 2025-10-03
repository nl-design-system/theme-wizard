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

describe('get-css', () => {
  describe('<style> tags', () => {
    test.todo('happy path');
    test.todo('empty tag');
  });

  describe('<link> tags', () => {
    // Tets matrix:
    // - href: absolute | relative | base64-encoded
    // - <base> element present: yes | no
    // - media: null | string
    // - rel: stylesheet | alternate stylesheet | etc
    test.todo('rel=-stylesheet href=absolute');
  });

  describe('inline `style=".." attributes', () => {
    test.todo('happy path');
    test.todo('missing trailing ;');
    test.todo('empty attribute');
  });
});
