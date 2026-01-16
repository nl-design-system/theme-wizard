const PX_PER_REM = 16;
const MIN_FONT_SIZE_PX = 16;

/**
 * @returns True if valid, false if invalid
 */
export const validateFontSize = ({ unit, value }: { value: number; unit: string }): boolean => {
  const isTooSmall =
    (unit === 'px' && value < MIN_FONT_SIZE_PX) || (unit === 'rem' && value * PX_PER_REM < MIN_FONT_SIZE_PX);
  return !isTooSmall;
};
