/**
 * YouTube Data API v3 Search Proxy
 *
 * Serverless endpoint to search YouTube for launch videos
 * - Keeps API key secure (server-side only)
 * - Filters for embeddable, kid-safe videos
 * - Caches results at edge for performance
 *
 * Free tier: 10,000 requests/day (100 searches @ 100 units each)
 */

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for API key
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error('❌ YOUTUBE_API_KEY not configured');
    return res.status(500).json({
      error: 'YouTube API not configured',
      message: 'Please add YOUTUBE_API_KEY to environment variables'
    });
  }

  // Get query parameters
  const {
    q,                        // Search query
    maxResults = 5,           // Max videos to return (default 5)
    order = 'relevance',      // Sort order
    videoDuration = 'any',    // Video length (any, short, medium, long)
    type = 'video'            // Resource type
  } = req.query;

  // Validate query
  if (!q) {
    return res.status(400).json({
      error: 'Missing query parameter',
      message: 'Please provide a search query (?q=...)'
    });
  }

  try {
    // Build YouTube API URL
    const params = new URLSearchParams({
      part: 'snippet',
      q: q,
      type: type,
      videoEmbeddable: 'true',      // CRITICAL: Only embeddable videos (kid-safe)
      maxResults: Math.min(parseInt(maxResults), 10), // Cap at 10
      order: order,
      safeSearch: 'strict',          // Enable strict safe search
      key: apiKey
    });

    // Add video duration filter if specified
    if (videoDuration !== 'any') {
      params.append('videoDuration', videoDuration);
    }

    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;

    console.log('🔍 YouTube API search:', q);

    // Fetch from YouTube
    const response = await fetch(youtubeUrl);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API error:', errorData);

      // Handle quota exceeded
      if (response.status === 403 && errorData.error?.errors?.[0]?.reason === 'quotaExceeded') {
        return res.status(503).json({
          error: 'API quota exceeded',
          message: 'YouTube API daily limit reached. Try again tomorrow!',
          retryAfter: 86400 // 24 hours
        });
      }

      return res.status(response.status).json({
        error: 'YouTube API error',
        message: errorData.error?.message || 'Unknown error',
        details: errorData
      });
    }

    const data = await response.json();

    console.log(`✅ Found ${data.items?.length || 0} videos for: ${q}`);

    // Cache response for 24 hours (edge caching)
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

    // Return results
    return res.status(200).json({
      items: data.items || [],
      pageInfo: data.pageInfo || { totalResults: 0, resultsPerPage: 0 },
      query: q,
      cached: false
    });

  } catch (error) {
    console.error('YouTube search error:', error);

    return res.status(500).json({
      error: 'Search failed',
      message: error.message,
      query: q
    });
  }
}

/**
 * API Usage Notes:
 *
 * 1. Get your API key:
 *    - Go to https://console.cloud.google.com/apis/credentials
 *    - Create new API key
 *    - Enable YouTube Data API v3
 *    - Restrict key to YouTube Data API only
 *
 * 2. Add to environment:
 *    - Vercel: Add YOUTUBE_API_KEY in project settings
 *    - Local: Create .env.local with YOUTUBE_API_KEY=your_key
 *
 * 3. Quota management:
 *    - Free tier: 10,000 units/day
 *    - Search: 100 units per request
 *    - Daily capacity: ~100 searches
 *    - Monitor at: https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas
 *
 * 4. Caching strategy:
 *    - Edge cache: 24 hours (Vercel)
 *    - Client cache: 24 hours (localStorage in youtubeService.js)
 *    - Reduces API calls by ~90%
 *
 * 5. Safety features:
 *    - videoEmbeddable=true: Only videos that can be embedded
 *    - safeSearch=strict: Filter inappropriate content
 *    - Server-side only: API key never exposed to client
 */
