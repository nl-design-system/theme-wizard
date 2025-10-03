export const isWaybackUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'web.archive.org' && /web\/\d{14}\/.+/.test(parsed.pathname);
  } catch {
    return false;
  }
};

const START_COMMENT = '<!-- BEGIN WAYBACK TOOLBAR INSERT -->';
const END_COMMENT = '<!-- END WAYBACK TOOLBAR INSERT -->';

/**
 * @description Remove the Wayback Machine toolbar, if present
 */
export const removeWaybackToolbar = (html: string): string => {
  const startInsert = html.indexOf(START_COMMENT);
  const endInsert = html.indexOf(END_COMMENT);

  if (startInsert !== -1 && endInsert !== -1) {
    return html.substring(0, startInsert) + html.substring(endInsert + END_COMMENT.length);
  }

  return html;
};
