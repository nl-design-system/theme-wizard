export const isWaybackUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'web.archive.org' && /web\/\d{14}\/.+/.test(parsed.pathname);
  } catch {
    return false;
  }
};

const TOOLBAR_START_COMMENT = '<!-- BEGIN WAYBACK TOOLBAR INSERT -->';
const TOOLBAR_END_COMMENT = '<!-- END WAYBACK TOOLBAR INSERT -->';
const END_REWRITE_COMMENT = '<!-- End Wayback Rewrite JS Include -->';

/**
 * @description Remove the Wayback Machine toolbar, if present
 */
export const removeWaybackToolbar = (html: string): string => {
  const startInsert = html.indexOf(TOOLBAR_START_COMMENT);
  const endInsert = html.indexOf(TOOLBAR_END_COMMENT);
  const endRewrite = html.indexOf(END_REWRITE_COMMENT);

  if (startInsert !== -1 && endInsert !== -1 && endRewrite !== -1) {
    const cleanHtml = [];

    // Start with everyting until the `<head>` tag, after which Wayback inserts scripts and links
    // This usually includes <!doctype>, <html>, comments, etc.
    const openHeadTagStartIndex = html.indexOf('<head');
    // Find the '>' after '<head' (because of possible attributes like <head data-attr="whatever">)
    const openHeadTagEndIndex = html.indexOf('>', openHeadTagStartIndex);
    cleanHtml.push(html.substring(0, openHeadTagEndIndex + 1));

    // Then everything between Rewrite and toolbar comments:
    // <!-- End Wayback Rewrite JS Include -->
    //            everything here
    // <!-- BEGIN WAYBACK TOOLBAR INSERT -->
    cleanHtml.push(html.substring(endRewrite + END_REWRITE_COMMENT.length, startInsert));

    // Finally, everyting after <!-- END WAYBACK TOOLBAR INSERT -->
    cleanHtml.push(html.substring(endInsert + TOOLBAR_END_COMMENT.length));

    return cleanHtml.join('');
  }

  return html;
};
