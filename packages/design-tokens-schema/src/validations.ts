export const PX_PER_REM = 16;
export const MIN_FONT_SIZE_PX = 14;
export const MIN_FONT_SIZE_REM = MIN_FONT_SIZE_PX / PX_PER_REM;

const pxToRem = (rem: number): number => {
  return rem * PX_PER_REM;
};

/**
 * @returns True if valid, false if invalid
 */
export const validateFontSize = ({ unit, value }: { value: number; unit: string }): boolean => {
  const isTooSmall =
    (unit === 'px' && value < MIN_FONT_SIZE_PX) || (unit === 'rem' && pxToRem(value) < MIN_FONT_SIZE_PX);
  return !isTooSmall;
};

export const MINIMUM_LINE_HEIGHT = 1.1;

/** @returns true if valid, false if invalid */
export const validateMinLineHeight = (lineHeight: number) => lineHeight >= MINIMUM_LINE_HEIGHT;
