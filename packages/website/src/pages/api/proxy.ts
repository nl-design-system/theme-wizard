import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  try {
    // Validate URL
    const parsedUrl = new URL(targetUrl);

    // Only allow HTTP/HTTPS protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return new Response('Invalid protocol', { status: 400 });
    }

    // Fetch the external resource
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Theme-Wizard/1.0',
        Accept: 'text/css, text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8',
      },
    });

    if (!response.ok) {
      return new Response(`Failed to fetch: ${response.status} ${response.statusText}`, {
        status: response.status,
      });
    }

    const content = await response.text();
    const contentType = response.headers.get('content-type') || 'text/plain';

    // Return the content with appropriate headers
    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
