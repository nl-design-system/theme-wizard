import { ERROR_CODES } from "@nl-design-system-community/design-tokens-schema"

type Key = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

const messages = {
  nl: {
    [ERROR_CODES.INSUFFICIENT_CONTRAST]: 'Onvoldoende contrast tussen {{path}} (${color}) en {{compareRef}} (${compareColor}). Huidige contrast is {compareContrast}, benodigd contrast is {minimum}.',
    [ERROR_CODES.INVALID_REF]: 'Verwijzing van {{path}} naar {{ref}} is niet mogelijk. Er is geen token genaamd {{ref}} gevonden.',
  }
} satisfies Record<'nl', Record<Key, string | unknown>>;

export default messages;
