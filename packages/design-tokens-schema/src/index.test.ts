import { test, expect } from 'vitest';
import * as api from './index';

test('public API', () => {
  expect(Object.keys(api)).toEqual(['']);
});
