export const isLocalhostUrl = (url: string | URL): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname.startsWith('192.168.');
  } catch {
    return false;
  }
};
