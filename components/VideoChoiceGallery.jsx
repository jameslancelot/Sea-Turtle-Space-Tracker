import React from 'react';
import { Star, Play, Check } from 'lucide-react';

/**
 * VideoChoiceGallery Component
 *
 * Kid-friendly video selector with:
 * - Large, colorful thumbnails (easy to see and click)
 * - Star ratings (visual quality indicator)
 * - Simple labels (Official, Replay, Highlights)
 * - Hover previews (show video title)
 * - Sea turtle theme integration
 *
 * Designed for 9-year-old engagement and decision-making skills
 */
const VideoChoiceGallery = ({ videos, selectedVideo, onSelect }) => {
  if (!videos || videos.length <= 1) return null;

  return (
    <div className="video-choice-gallery mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-[#003366] flex items-center gap-2">
          🎬 Choose Your Launch Video!
        </h3>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Star className="w-3 h-3 fill-[#FDB913] text-[#FDB913]" />
          <span>More stars = Better quality</span>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {videos.slice(0, 5).map((video, index) => (
          <VideoCard
            key={video.id || index}
            video={video}
            isSelected={selectedVideo?.id === video.id}
            onSelect={() => onSelect(video)}
            index={index}
          />
        ))}
      </div>

      {/* Helper Text for Kids */}
      <p className="text-xs text-gray-500 mt-3 text-center">
        🐢 Click a video to watch! Look for ⭐⭐⭐⭐⭐ for the best videos!
      </p>
    </div>
  );
};

/**
 * Individual Video Card Component
 */
const VideoCard = ({ video, isSelected, onSelect, index }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // Sea turtle colors for variety (hue rotation)
  const turtleHues = [0, 120, 180, 240, 300];
  const hue = turtleHues[index % turtleHues.length];

  return (
    <button
      onClick={onSelect}
      className={`
        video-card group relative rounded-lg overflow-hidden
        transition-all duration-300 transform
        ${isSelected
          ? 'ring-4 ring-[#F7941D] scale-105 shadow-2xl'
          : 'hover:scale-105 hover:shadow-xl ring-2 ring-gray-200 hover:ring-[#FDB913]'
        }
      `}
      aria-label={`Select video: ${video.title}`}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-cyan-100 to-teal-100 relative">
        {!imageError ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        ) : (
          // Fallback: Sea turtle icon with gradient
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg,
                hsl(${hue}, 70%, 85%) 0%,
                hsl(${hue + 30}, 70%, 75%) 100%)`
            }}
          >
            <span className="text-4xl">🐢</span>
          </div>
        )}

        {/* Play Overlay */}
        <div
          className={`
            absolute inset-0 flex items-center justify-center
            bg-black/40 transition-opacity duration-200
            ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          `}
        >
          <div className="bg-[#F7941D] rounded-full p-3 transform group-hover:scale-110 transition">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>

        {/* Selected Checkmark */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-[#F7941D] rounded-full p-1 shadow-lg animate-scale-in">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Video Type Badge */}
        <div className="absolute top-2 left-2">
          <VideoBadge type={video.type} isOfficial={video.isOfficial} />
        </div>
      </div>

      {/* Video Info */}
      <div className="p-2 bg-white border-t border-gray-200">
        {/* Star Rating */}
        <div className="flex items-center justify-center gap-0.5 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < (video.rating || 3)
                  ? 'fill-[#FDB913] text-[#FDB913]'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Title (truncated for small cards) */}
        <p className="text-xs font-semibold text-gray-800 text-center line-clamp-2 leading-tight">
          {video.title || 'Launch Video'}
        </p>

        {/* Channel (optional, very small) */}
        {video.channel && (
          <p className="text-[10px] text-gray-500 text-center mt-1 truncate">
            {video.channel}
          </p>
        )}
      </div>
    </button>
  );
};

/**
 * Video Type Badge Component
 */
const VideoBadge = ({ type, isOfficial }) => {
  const badges = {
    'Official Video': {
      emoji: '✅',
      bg: 'bg-green-500',
      text: 'Official'
    },
    'Educational Pick': {
      emoji: '🎓',
      bg: 'bg-purple-500',
      text: 'Teacher Pick'
    },
    'Community Video': {
      emoji: '📹',
      bg: 'bg-blue-500',
      text: 'Community'
    },
    'Similar Launch': {
      emoji: '🔍',
      bg: 'bg-orange-500',
      text: 'Similar'
    }
  };

  const badge = badges[type] || {
    emoji: isOfficial ? '✅' : '📹',
    bg: isOfficial ? 'bg-green-500' : 'bg-blue-500',
    text: isOfficial ? 'Official' : 'Video'
  };

  return (
    <div className={`
      ${badge.bg} text-white text-[10px] font-bold
      px-2 py-0.5 rounded-full
      flex items-center gap-1
      shadow-md
    `}>
      <span>{badge.emoji}</span>
      <span className="hidden sm:inline">{badge.text}</span>
    </div>
  );
};

/**
 * Loading State Component
 */
export const VideoGalleryLoading = () => {
  return (
    <div className="video-choice-gallery mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-[#003366]">
          🔍 Finding videos for you...
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg animate-pulse"
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-4xl opacity-50 animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>
                🐢
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Swimming through YouTube to find the best launch videos... 🌊
      </p>
    </div>
  );
};

/**
 * No Videos State Component
 */
export const VideoGalleryEmpty = ({ launch }) => {
  return (
    <div className="video-choice-gallery mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 text-center">
      <div className="text-6xl mb-3">🎥</div>
      <h3 className="text-lg font-black text-gray-700 mb-2">
        No Videos Found Yet
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        We couldn't find any videos for this launch right now.
      </p>

      {/* Educational alternative */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border-2 border-[#FDB913] mt-4">
        <p className="text-xs font-bold text-[#F7941D] mb-2">
          🐢 Sea Turtle Tip:
        </p>
        <p className="text-xs text-gray-700">
          Check back closer to launch time - videos are often added a few days before!
          Or explore the Mission and Details tabs to learn more about this launch.
        </p>
      </div>
    </div>
  );
};

export default VideoChoiceGallery;
