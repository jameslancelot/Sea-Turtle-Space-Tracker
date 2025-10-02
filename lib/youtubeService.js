/**
 * YouTube Video Discovery Service for Sea Turtle Space Tracker
 *
 * 3-Tier Video Discovery System:
 * 1. Launch Library 2 API videos (vid_urls) - Most reliable
 * 2. YouTube Data API search - Auto-discovery for missing videos
 * 3. Curated video library - Hand-picked educational content
 */

import curatedVideos from './curatedVideos.json';

/**
 * Official space agency and launch provider YouTube channels
 * Used for ranking and safety filtering
 */
const OFFICIAL_CHANNELS = [
  'NASA',
  'SpaceX',
  'Blue Origin',
  'United Launch Alliance',
  'ULA',
  'Rocket Lab',
  'European Space Agency',
  'ESA',
  'JAXA',
  'ISRO',
  'Arianespace',
  'Northrop Grumman',
  'The Space Devs',
  'Everyday Astronaut',
  'NASASpaceflight',
  'Scott Manley'
];

/**
 * Main entry point: Get videos for a launch
 * @param {Object} launch - Launch object from Launch Library 2
 * @returns {Promise<Array>} - Array of video objects
 */
export async function getLaunchVideos(launch) {
  // Tier 1: Check Launch Library API videos
  const apiVideos = extractAPIVideos(launch);
  if (apiVideos.length > 0) {
    console.log('✅ Found Launch Library videos:', apiVideos.length);
    return apiVideos;
  }

  // Tier 2: Search YouTube Data API
  try {
    const searchResults = await searchYouTubeVideos(launch);
    if (searchResults.length > 0) {
      console.log('🔍 Found YouTube search results:', searchResults.length);
      return searchResults;
    }
  } catch (error) {
    console.error('YouTube search failed:', error);
  }

  // Tier 3: Fallback to curated library
  const curatedVideo = getCuratedVideo(launch);
  if (curatedVideo) {
    console.log('📚 Found curated video');
    return [curatedVideo];
  }

  console.log('❌ No videos found for launch:', launch.name);
  return [];
}

/**
 * Extract videos from Launch Library 2 API data
 */
function extractAPIVideos(launch) {
  const videos = [];

  // Check vid_urls array (newer API format)
  if (launch.vid_urls && Array.isArray(launch.vid_urls)) {
    launch.vid_urls.forEach(vidObj => {
      const videoId = extractYouTubeId(vidObj.url);
      if (videoId) {
        videos.push({
          id: videoId,
          url: vidObj.url,
          title: vidObj.title || launch.name,
          source: 'api',
          isOfficial: true,
          rating: 5, // Official videos get max rating
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          channel: vidObj.feature_image || 'Official',
          type: 'Official Video'
        });
      }
    });
  }

  // Check vidURLs array (older API format - fallback)
  if (launch.vidURLs && Array.isArray(launch.vidURLs)) {
    launch.vidURLs.forEach(url => {
      const videoId = extractYouTubeId(url);
      if (videoId && !videos.find(v => v.id === videoId)) {
        videos.push({
          id: videoId,
          url: url,
          title: launch.name,
          source: 'api',
          isOfficial: true,
          rating: 5,
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          channel: 'Official',
          type: 'Official Video'
        });
      }
    });
  }

  return videos;
}

/**
 * Search YouTube Data API for launch videos
 */
export async function searchYouTubeVideos(launch) {
  // Check cache first (24-hour TTL)
  const cacheKey = `youtube_${launch.id}`;
  const cached = getCachedVideos(cacheKey);
  if (cached) {
    console.log('📦 Using cached YouTube results');
    return cached;
  }

  // Build search query
  const query = buildSearchQuery(launch);
  console.log('🔍 YouTube search query:', query);

  // Call our serverless API endpoint (keeps API key secure)
  try {
    const response = await fetch(
      `/api/youtube-search?q=${encodeURIComponent(query)}&maxResults=5`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    // Process and rank results
    const videos = processSearchResults(data.items || [], launch);

    // Cache for 24 hours
    cacheVideos(cacheKey, videos);

    return videos;
  } catch (error) {
    console.error('YouTube search error:', error);
    return [];
  }
}

/**
 * Build optimized search query for kid-friendly results
 */
function buildSearchQuery(launch) {
  const parts = [];

  // Add rocket name (most important)
  if (launch.rocket?.configuration?.name) {
    parts.push(launch.rocket.configuration.name);
  }

  // Add mission name if distinct from rocket
  if (launch.name && !launch.name.includes(launch.rocket?.configuration?.name)) {
    // Simplify mission name (remove | separators, extra details)
    const simpleName = launch.name.split('|')[0].trim();
    parts.push(simpleName);
  }

  // Add launch date (helps find specific launch)
  if (launch.net) {
    const date = new Date(launch.net);
    const year = date.getFullYear();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    parts.push(`${month} ${year}`);
  }

  // Add keyword for better filtering
  parts.push('launch');

  // Add "official" to prioritize official channels
  parts.push('official');

  return parts.join(' ');
}

/**
 * Process YouTube search results and rank for kids
 */
function processSearchResults(items, launch) {
  if (!items || items.length === 0) return [];

  return items
    .map(item => {
      const videoId = item.id?.videoId;
      if (!videoId) return null;

      const channel = item.snippet.channelTitle;
      const isOfficial = checkOfficialChannel(channel);
      const rating = calculateKidRating(item, launch);

      return {
        id: videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        title: simplifyTitle(item.snippet.title),
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.high?.url ||
                   item.snippet.thumbnails?.medium?.url ||
                   `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        channel: channel,
        isOfficial: isOfficial,
        rating: rating,
        source: 'youtube',
        type: isOfficial ? 'Official Video' : 'Community Video',
        publishedAt: item.snippet.publishedAt
      };
    })
    .filter(video => video !== null)
    .sort((a, b) => b.rating - a.rating); // Sort by rating (best first)
}

/**
 * Check if channel is from official space organization
 */
function checkOfficialChannel(channelName) {
  if (!channelName) return false;

  const lowerChannel = channelName.toLowerCase();
  return OFFICIAL_CHANNELS.some(official =>
    lowerChannel.includes(official.toLowerCase())
  );
}

/**
 * Calculate kid-friendly rating (1-5 stars)
 */
function calculateKidRating(item, launch) {
  let rating = 3; // Base rating

  const title = item.snippet.title.toLowerCase();
  const description = item.snippet.description?.toLowerCase() || '';
  const channel = item.snippet.channelTitle;

  // +2 stars: Official channel
  if (checkOfficialChannel(channel)) {
    rating += 2;
  }

  // +1 star: High-quality indicators
  if (title.includes('official') || title.includes('4k') || title.includes('hd')) {
    rating += 1;
  }

  // +1 star: Educational keywords
  if (title.includes('explained') || title.includes('highlights') ||
      description.includes('educational')) {
    rating += 1;
  }

  // -1 star: Too technical/long
  if (title.length > 100 || title.includes('analysis') ||
      title.includes('technical')) {
    rating -= 1;
  }

  // -1 star: Potentially low quality
  if (title.includes('fails') || title.includes('crash') ||
      title.includes('explosion') && !title.includes('controlled')) {
    rating -= 1;
  }

  // +1 star: Matches launch specifics
  const rocketName = launch.rocket?.configuration?.name?.toLowerCase() || '';
  if (rocketName && title.includes(rocketName)) {
    rating += 1;
  }

  // Cap rating between 1-5
  return Math.max(1, Math.min(5, rating));
}

/**
 * Simplify video title for kids (remove jargon)
 */
function simplifyTitle(title) {
  if (!title) return 'Launch Video';

  // Remove common prefixes
  let simplified = title
    .replace(/^(Watch|View|See|Live):\s*/i, '')
    .replace(/^\[.*?\]\s*/, '') // Remove [LIVE] tags
    .replace(/\(.*?\)/g, ''); // Remove parenthetical notes

  // Truncate if too long (kids' attention)
  if (simplified.length > 60) {
    simplified = simplified.substring(0, 57) + '...';
  }

  return simplified.trim();
}

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeId(url) {
  if (!url) return null;

  // Handle direct video ID
  if (url.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const id = match[match.length - 1] || match[1];
      if (id && id.length === 11) {
        return id;
      }
    }
  }

  return null;
}

/**
 * Get video from curated library
 */
function getCuratedVideo(launch) {
  // Try exact match by launch ID
  if (curatedVideos[launch.id]) {
    const curated = curatedVideos[launch.id];
    return {
      id: extractYouTubeId(curated.videoId || curated.url),
      url: curated.url,
      title: curated.title,
      thumbnail: curated.thumbnail ||
                 `https://img.youtube.com/vi/${curated.videoId}/maxresdefault.jpg`,
      channel: curated.channel || 'Curated',
      isOfficial: true,
      rating: 5,
      source: 'curated',
      type: 'Educational Pick',
      description: curated.description
    };
  }

  // Try fuzzy match by rocket name
  const rocketName = launch.rocket?.configuration?.name?.toLowerCase();
  if (rocketName) {
    const fuzzyMatch = Object.entries(curatedVideos).find(([key, video]) =>
      video.title.toLowerCase().includes(rocketName) ||
      video.description?.toLowerCase().includes(rocketName)
    );

    if (fuzzyMatch) {
      const [, curated] = fuzzyMatch;
      return {
        id: extractYouTubeId(curated.videoId || curated.url),
        url: curated.url,
        title: curated.title,
        thumbnail: curated.thumbnail ||
                   `https://img.youtube.com/vi/${curated.videoId}/maxresdefault.jpg`,
        channel: curated.channel || 'Curated',
        isOfficial: true,
        rating: 4, // Slightly lower for fuzzy match
        source: 'curated',
        type: 'Similar Launch',
        description: curated.description
      };
    }
  }

  return null;
}

/**
 * Cache management (localStorage)
 */
function getCachedVideos(key) {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { videos, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    const TTL = 24 * 60 * 60 * 1000; // 24 hours

    if (age < TTL) {
      return videos;
    } else {
      localStorage.removeItem(key); // Expired
      return null;
    }
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

function cacheVideos(key, videos) {
  if (typeof window === 'undefined') return;

  try {
    const data = {
      videos,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

/**
 * Clear all YouTube video caches
 */
export function clearVideoCache() {
  if (typeof window === 'undefined') return;

  try {
    const keys = Object.keys(localStorage);
    const youtubeCacheKeys = keys.filter(key => key.startsWith('youtube_'));
    youtubeCacheKeys.forEach(key => localStorage.removeItem(key));
    console.log(`🧹 Cleared ${youtubeCacheKeys.length} YouTube cache entries`);
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}
