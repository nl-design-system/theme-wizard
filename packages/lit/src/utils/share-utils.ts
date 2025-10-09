/**
 * Share current theme configuration by copying URL to clipboard
 * @private
 */
export const shareTheme = async (): Promise<void> => {
  try {
    const url = window.location.href;

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      console.warn('Clipboard API not available');
    }
  } catch (error) {
    console.error('Failed to share theme:', error);
  }
};
