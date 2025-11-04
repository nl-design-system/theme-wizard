import { ColorToken, ColorTokenValidationSchema } from './color-token';

/**
 * @param data The object you want to traverse
 * @param matcherFn Predicate function that returns true when data is a T-shape object
 * @param callback Is called whenever the callback returns true
 */
export const walkObject = <T = unknown>(
  data: unknown,
  matcherFn: (data: unknown) => data is T,
  callback: (data: T, path: string[]) => void,
): void => {
  function traverse(currentData: unknown, path: string[]): void {
    // Check if current data matches
    if (matcherFn(currentData)) {
      callback(currentData, path);
    }

    // Recurse into objects
    if (typeof currentData === 'object' && currentData !== null && !Array.isArray(currentData)) {
      for (const key in currentData) {
        traverse((currentData as Record<string, unknown>)[key], [...path, key]);
      }
    }

    // Recurse into arrays
    if (Array.isArray(currentData)) {
      for (let i = 0; i < currentData.length; i++) {
        traverse(currentData[i], [...path, String(i)]);
      }
    }
  }

  traverse(data, []);
};

const isColorToken = (obj: unknown): obj is ColorToken => {
  return ColorTokenValidationSchema.safeParse(obj).success;
};

export const walkColors = (data: unknown, callback: (data: ColorToken, path: string[]) => void): void => {
  walkObject<ColorToken>(data, isColorToken, (obj, path) => callback(obj, path));
};
