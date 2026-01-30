import type { ComplexAttributeConverter } from 'lit';

type AttributeConverterFrom<T> = NonNullable<ComplexAttributeConverter<T>['fromAttribute']>;

const createArrayConverter =
  (delimiter: string | RegExp): AttributeConverterFrom<unknown[] | null> =>
  (value) => {
    if (value === null || value === '') {
      return null;
    }
    const split = (value: string) =>
      value
        .trim()
        .split(delimiter)
        .map((i) => i.trim());
    try {
      const json = value ? JSON.parse(value) : value;
      return Array.isArray(json) ? json : null;
    } catch {
      return split(value);
    }
  };

export const arrayFromTokenList: AttributeConverterFrom<Array<unknown> | null> = createArrayConverter(/\s+/);
export const arrayFromCommaList: AttributeConverterFrom<Array<unknown> | null> = createArrayConverter(',');
