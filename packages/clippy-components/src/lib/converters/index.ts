import type { ComplexAttributeConverter } from 'lit';

type AttributeConverterFrom<T> = NonNullable<ComplexAttributeConverter<T>['fromAttribute']>;

const createArrayConverter = (delimiter: string | RegExp): AttributeConverterFrom<Array<unknown> | null> => (value) => {
  if (value === null) return value;
  try {
    const json = value ? JSON.parse(value) : value;
    return Array.isArray(json) ? json : null;
  } catch {
    return value.trim().split(delimiter);
  }
};

export const arrayFromTokenList: AttributeConverterFrom<Array<unknown> | null> = createArrayConverter(/\s+/);
