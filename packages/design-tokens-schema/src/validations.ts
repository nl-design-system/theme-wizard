export const validateFontSize = ({ unit, value }: { value: number; unit: string }): boolean => {
  if (unit === 'px' && value < 16) {
    return false;
  }
  if (unit === 'rem' && value < 1) {
    return false;
  }
  // Pass through dimensions that we cannot reliably validate
  return true;
};
