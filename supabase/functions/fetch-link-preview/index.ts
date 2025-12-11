import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching preview for URL:', url);

    // Fetch the webpage with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });
    
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();
    
    // Parse meta tags
    const getMetaContent = (name: string): string | undefined => {
      // Try Open Graph first
      const ogMatch = html.match(new RegExp(`<meta[^>]*property=["']og:${name}["'][^>]*content=["']([^"']+)["']`, 'i')) ||
                      html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:${name}["']`, 'i'));
      if (ogMatch) return ogMatch[1];
      
      // Try Twitter cards
      const twitterMatch = html.match(new RegExp(`<meta[^>]*name=["']twitter:${name}["'][^>]*content=["']([^"']+)["']`, 'i')) ||
                          html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:${name}["']`, 'i'));
      if (twitterMatch) return twitterMatch[1];
      
      // Try standard meta
      const metaMatch = html.match(new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i')) ||
                        html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${name}["']`, 'i'));
      if (metaMatch) return metaMatch[1];
      
      return undefined;
    };

    // Get title
    let title = getMetaContent('title');
    if (!title) {
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      title = titleMatch ? titleMatch[1].trim() : undefined;
    }

    // Get description
    const description = getMetaContent('description');

    // Get image
    let image = getMetaContent('image');
    if (image && !image.startsWith('http')) {
      // Make relative URLs absolute
      const urlObj = new URL(url);
      image = image.startsWith('/') 
        ? `${urlObj.protocol}//${urlObj.host}${image}`
        : `${urlObj.protocol}//${urlObj.host}/${image}`;
    }

    // Get favicon
    let favicon: string | undefined;
    const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i) ||
                         html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i);
    if (faviconMatch) {
      favicon = faviconMatch[1];
      if (!favicon.startsWith('http')) {
        const urlObj = new URL(url);
        favicon = favicon.startsWith('/') 
          ? `${urlObj.protocol}//${urlObj.host}${favicon}`
          : `${urlObj.protocol}//${urlObj.host}/${favicon}`;
      }
    } else {
      // Default to /favicon.ico
      const urlObj = new URL(url);
      favicon = `${urlObj.protocol}//${urlObj.host}/favicon.ico`;
    }

    // Get site name
    const siteName = getMetaContent('site_name') || new URL(url).hostname;

    const preview = {
      title,
      description,
      image,
      favicon,
      siteName,
      fetchedAt: new Date().toISOString(),
    };

    console.log('Preview fetched successfully:', preview);

    return new Response(
      JSON.stringify(preview),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching link preview:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to fetch preview' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
