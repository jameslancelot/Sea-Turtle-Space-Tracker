import React, { useState, useEffect } from 'react';
import { X, Video, FileText, Settings } from 'lucide-react';
import { getLaunchVideos, extractYouTubeId } from '../lib/youtubeService';
import VideoChoiceGallery, { VideoGalleryLoading, VideoGalleryEmpty } from './VideoChoiceGallery';
import VideoLearningContext from './VideoLearningContext';

/**
 * Helper Functions for Launch Detail Modal
 */

// Generate kid-friendly explanations based on mission data
const generateKidFriendlyExplanation = (launch) => {
  const orbit = launch.mission?.orbit?.name?.toLowerCase() || '';
  const missionType = launch.mission?.type?.toLowerCase() || '';
  const name = launch.name?.toLowerCase() || '';

  if (orbit.includes('leo') || orbit.includes('low earth')) {
    return "This rocket is going to Low Earth Orbit - that's like swimming in the shallow end of space! It's close enough that astronauts on the Space Station can wave at us!";
  } else if (orbit.includes('geo') || orbit.includes('geostationary')) {
    return "This rocket is going way up to Geostationary Orbit - so high that it stays over the same spot on Earth all day! That's where weather satellites and TV satellites hang out.";
  } else if (orbit.includes('lunar') || orbit.includes('moon') || name.includes('moon')) {
    return "This rocket is going to the Moon! That's 238,000 miles away - sea turtles would need to swim for 238 million years to get that far!";
  } else if (missionType.includes('communication') || name.includes('starlink')) {
    return "This mission is launching a satellite that helps us talk to each other from far away - like a super-powered cell phone tower in space!";
  } else if (missionType.includes('science') || missionType.includes('research')) {
    return "This is a science mission! Scientists are sending special tools to space to learn new things about our universe. Maybe one day you'll be a space scientist too!";
  } else if (name.includes('crew') || name.includes('dragon')) {
    return "This rocket is carrying astronauts to space! Just like sea turtles travel across oceans, these space explorers travel among the stars!";
  } else {
    return "This rocket is blasting off to explore space and help us learn more about the universe! Every launch teaches us something new. 🚀";
  }
};

// Generate fun facts from launch data
const generateFunFacts = (launch) => {
  const facts = [];
  const name = launch.name?.toLowerCase() || '';
  const rocketName = launch.rocket?.configuration?.name?.toLowerCase() || '';
  const orbit = launch.mission?.orbit?.name?.toLowerCase() || '';
  const location = launch.pad?.location?.name?.toLowerCase() || '';

  // Rocket-specific facts
  if (rocketName.includes('falcon')) {
    facts.push("🦅 The Falcon rocket is named after the Millennium Falcon from Star Wars!");
  }

  if (rocketName.includes('starship')) {
    facts.push("🚀 Starship is the tallest and most powerful rocket ever built - it's taller than the Statue of Liberty!");
  }

  if (rocketName.includes('electron')) {
    facts.push("⚡ The Electron rocket is small but mighty - it can launch from New Zealand!");
  }

  // Speed fact (always relevant)
  facts.push("🏃 This rocket will travel about 17,500 mph - that's 291 times faster than a sea turtle swims!");

  // Launch site facts
  if (location.includes('florida') || location.includes('cape canaveral') || location.includes('kennedy')) {
    facts.push("🏖️ This launch is happening in Florida - the same state as our school! We're neighbors with rockets!");
  }

  if (location.includes('vandenberg')) {
    facts.push("🌊 Vandenberg launches rockets over the Pacific Ocean - sea turtles swim in those same waters!");
  }

  if (location.includes('baikonur')) {
    facts.push("🏜️ Baikonur is the oldest and largest space launch facility in the world - it's in the desert of Kazakhstan!");
  }

  // Orbit facts
  if (orbit.includes('iss') || orbit.includes('station') || name.includes('iss')) {
    facts.push("🛰️ This rocket is visiting the International Space Station where astronauts live in space!");
  }

  if (orbit.includes('leo') || orbit.includes('low earth')) {
    facts.push("🌍 Low Earth Orbit is where satellites take pictures of Earth - including photos of sea turtle habitats!");
  }

  // Mission-specific facts
  if (name.includes('starlink')) {
    facts.push("📡 Starlink satellites help bring internet to remote places - even ships tracking sea turtles in the ocean!");
  }

  if (name.includes('crew') || name.includes('astronaut')) {
    facts.push("👨‍🚀 Astronauts train underwater to prepare for spacewalks - just like our sea turtles!");
  }

  // General space fact (fallback)
  if (facts.length < 3) {
    facts.push("🌍 From space, astronauts can see 16 sunrises and sunsets every day because they orbit Earth so fast!");
  }

  // Return max 4 facts
  return facts.slice(0, 4);
};

/**
 * Enhanced Video Tab Component with YouTube API Integration
 */
const VideoTab = ({ launch }) => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load videos on mount
  useEffect(() => {
    loadVideos();
  }, [launch]);

  async function loadVideos() {
    setLoading(true);
    setError(null);

    try {
      const foundVideos = await getLaunchVideos(launch);
      setVideos(foundVideos);

      if (foundVideos.length > 0) {
        setSelectedVideo(foundVideos[0]); // Auto-select best video
      }
    } catch (err) {
      console.error('Failed to load videos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const selectedVideoId = selectedVideo ? extractYouTubeId(selectedVideo.url || selectedVideo.id) : null;

  return (
    <div className="video-tab p-6">
      {/* Live Webcast Banner */}
      {launch.webcast_live && (
        <div className="live-banner animate-pulse bg-gradient-to-r from-red-500 to-red-600 text-white font-black text-lg py-4 px-6 rounded-lg mb-4 flex items-center justify-center gap-3 shadow-lg">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
          </span>
          🔴 LIVE NOW! This launch is happening right now!
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
          </span>
        </div>
      )}

      {/* Loading State */}
      {loading && <VideoGalleryLoading />}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
          <p className="text-sm text-red-600">⚠️ {error}</p>
        </div>
      )}

      {/* No Videos State */}
      {!loading && !error && videos.length === 0 && (
        <VideoGalleryEmpty launch={launch} />
      )}

      {/* Video Player */}
      {!loading && selectedVideo && selectedVideoId && (
        <>
          {videoLoaded ? (
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideoId}`}
              className="w-full aspect-video rounded-lg shadow-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={selectedVideo.title || 'Launch Video'}
            />
          ) : (
            <div
              onClick={() => setVideoLoaded(true)}
              className="cursor-pointer relative group"
            >
              <img
                src={selectedVideo.thumbnail || `https://img.youtube.com/vi/${selectedVideoId}/maxresdefault.jpg`}
                alt="Video thumbnail"
                className="w-full aspect-video rounded-lg shadow-lg object-cover"
                onError={(e) => {
                  // Fallback to medium quality thumbnail
                  e.target.src = `https://img.youtube.com/vi/${selectedVideoId}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition rounded-lg">
                <button className="bg-[#F7941D] hover:bg-[#FDB913] text-white font-black text-2xl py-6 px-10 rounded-full shadow-2xl transform group-hover:scale-110 transition">
                  ▶ Watch Launch Video
                </button>
              </div>
            </div>
          )}

          {/* Video Source Badge */}
          {selectedVideo.source && (
            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-500">
              {selectedVideo.source === 'api' && '✅ Official Launch Library Video'}
              {selectedVideo.source === 'youtube' && '🔍 YouTube Search Result'}
              {selectedVideo.source === 'curated' && '🎓 Curated Educational Pick'}
            </div>
          )}
        </>
      )}

      {/* Video Choice Gallery (if multiple videos available) */}
      {!loading && videos.length > 1 && (
        <VideoChoiceGallery
          videos={videos}
          selectedVideo={selectedVideo}
          onSelect={(video) => {
            setSelectedVideo(video);
            setVideoLoaded(false); // Reset to show thumbnail
          }}
        />
      )}

      {/* Educational Learning Context */}
      {!loading && selectedVideo && (
        <VideoLearningContext
          video={selectedVideo}
          launch={launch}
        />
      )}
    </div>
  );
};

/**
 * Mission Tab Component
 */
const MissionTab = ({ launch }) => {
  const kidFriendlyText = generateKidFriendlyExplanation(launch);
  const funFacts = generateFunFacts(launch);

  return (
    <div className="mission-tab space-y-6 max-h-[500px] overflow-y-auto p-6">
      {/* Full Mission Description */}
      <section>
        <h3 className="text-xl font-black text-[#003366] mb-3 flex items-center gap-2">
          📋 Mission Description
        </h3>
        <p className="text-gray-700 leading-relaxed text-base">
          {launch.mission?.description || launch.name || 'No mission description available.'}
        </p>
      </section>

      {/* Kid-Friendly Explanation */}
      <section className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border-2 border-[#FDB913]">
        <h3 className="text-lg font-black text-[#F7941D] mb-2 flex items-center gap-2">
          🐢 Sea Turtle Says:
        </h3>
        <p className="text-gray-800 text-sm leading-relaxed">
          {kidFriendlyText}
        </p>
      </section>

      {/* Mission Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        {launch.mission?.type && (
          <div className="stat-card bg-teal-50 p-4 rounded-lg border border-teal-200">
            <p className="text-xs text-gray-600 font-semibold uppercase">Mission Type</p>
            <p className="text-lg font-black text-[#0f766e] break-words">
              {launch.mission.type}
            </p>
          </div>
        )}

        {launch.mission?.orbit?.name && (
          <div className="stat-card bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 font-semibold uppercase">Orbit</p>
            <p className="text-lg font-black text-[#0e7490] break-words">
              {launch.mission.orbit.name}
            </p>
          </div>
        )}

        {launch.launch_service_provider?.name && (
          <div className="stat-card bg-purple-50 p-4 rounded-lg border border-purple-200 col-span-2">
            <p className="text-xs text-gray-600 font-semibold uppercase">Launch Provider</p>
            <p className="text-base font-bold text-purple-900 break-words">
              {launch.launch_service_provider.name}
            </p>
          </div>
        )}
      </section>

      {/* Fun Facts Section */}
      <section className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-lg border-2 border-cyan-300">
        <h3 className="text-lg font-black text-[#0e7490] mb-3 flex items-center gap-2">
          ✨ Fun Facts
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {funFacts.map((fact, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-[#F7941D] font-black">•</span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Infographic Button */}
      {launch.infographic && (
        <button
          onClick={() => window.open(launch.infographic, '_blank')}
          className="w-full bg-gradient-to-r from-[#F7941D] to-[#FDB913] hover:from-[#FDB913] hover:to-[#F7941D] text-white font-black py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition flex items-center justify-center gap-3"
        >
          📊 View Mission Infographic
        </button>
      )}
    </div>
  );
};

/**
 * Details Tab Component
 */
const DetailsTab = ({ launch }) => {
  return (
    <div className="details-tab space-y-4 max-h-[500px] overflow-y-auto p-6">
      {/* Rocket Information */}
      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-black text-gray-800 mb-3">🚀 Rocket</h3>
        <div className="space-y-2 text-sm">
          {launch.rocket?.configuration?.name && (
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-semibold">Name:</span>
              <span className="text-gray-900 font-bold text-right">{launch.rocket.configuration.name}</span>
            </div>
          )}
          {launch.rocket?.configuration?.family && (
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-semibold">Family:</span>
              <span className="text-gray-900 font-bold text-right">{launch.rocket.configuration.family}</span>
            </div>
          )}
          {launch.rocket?.configuration?.variant && (
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-semibold">Variant:</span>
              <span className="text-gray-900 font-bold text-right">{launch.rocket.configuration.variant}</span>
            </div>
          )}
          {launch.rocket?.configuration?.description && (
            <p className="text-gray-700 text-xs mt-2 pt-2 border-t border-gray-300 leading-relaxed">
              {launch.rocket.configuration.description}
            </p>
          )}
        </div>
      </section>

      {/* Launch Pad */}
      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-black text-gray-800 mb-3">📍 Launch Site</h3>
        <div className="space-y-2 text-sm">
          {launch.pad?.name && (
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-semibold">Pad:</span>
              <span className="text-gray-900 font-bold text-right max-w-xs">{launch.pad.name}</span>
            </div>
          )}
          {launch.pad?.location?.name && (
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-semibold">Location:</span>
              <span className="text-gray-900 font-bold text-right max-w-xs">{launch.pad.location.name}</span>
            </div>
          )}
          {launch.pad?.latitude && launch.pad?.longitude && (
            <div className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-300">
              Coordinates: {launch.pad.latitude}°, {launch.pad.longitude}°
            </div>
          )}
        </div>
      </section>

      {/* Launch Provider */}
      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-black text-gray-800 mb-3">🏢 Provider</h3>
        <div className="space-y-2 text-sm">
          {launch.launch_service_provider?.name && (
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-semibold">Company:</span>
              <span className="text-gray-900 font-bold text-right max-w-xs">{launch.launch_service_provider.name}</span>
            </div>
          )}
          {launch.launch_service_provider?.type && (
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-semibold">Type:</span>
              <span className="text-gray-900 font-bold text-right">{launch.launch_service_provider.type}</span>
            </div>
          )}
        </div>
      </section>

      {/* Launch Date/Time */}
      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-black text-gray-800 mb-3">📅 Schedule</h3>
        <div className="space-y-2 text-sm">
          {launch.net && (
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-semibold">Launch Time:</span>
              <span className="text-gray-900 font-bold text-right">
                {new Date(launch.net).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </span>
            </div>
          )}
          {launch.window_start && launch.window_end && (
            <div className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-300">
              Launch Window: {new Date(launch.window_start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {new Date(launch.window_end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      </section>

      {/* Status Information */}
      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-black text-gray-800 mb-3">📊 Status</h3>
        <div className="space-y-2 text-sm">
          {launch.status?.name && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold">Current Status:</span>
              <span className={`font-bold px-3 py-1 rounded-full text-xs ${
                launch.status.name === 'Success' || launch.status.name === 'Launch Successful'
                  ? 'bg-green-100 text-green-800' :
                launch.status.name === 'Go' || launch.status.name === 'Go for Launch'
                  ? 'bg-blue-100 text-blue-800' :
                launch.status.name === 'TBD' || launch.status.name === 'To Be Determined'
                  ? 'bg-yellow-100 text-yellow-800' :
                launch.status.name === 'Failure' || launch.status.name === 'Launch Failure'
                  ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
              }`}>
                {launch.status.name}
              </span>
            </div>
          )}
          {launch.status?.description && (
            <p className="text-gray-700 text-xs mt-2 pt-2 border-t border-gray-300 leading-relaxed">
              {launch.status.description}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

/**
 * Main Launch Detail Modal Component
 */
const LaunchDetailModal = ({ launch, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('video');

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset to video tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('video');
    }
  }, [isOpen, launch]);

  if (!isOpen || !launch) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] animate-fade-in modal-backdrop"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto transform animate-scale-in modal-container"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2B8C74] to-[#14b8a6] text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition p-1 hover:bg-white/20 rounded"
              title="Close (ESC)"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-black mb-2 pr-12">
              {launch.name}
            </h2>

            <div className="flex items-center gap-4 text-sm flex-wrap">
              {launch.rocket?.configuration?.name && (
                <span className="flex items-center gap-1">
                  🚀 {launch.rocket.configuration.name}
                </span>
              )}
              {launch.launch_service_provider?.name && (
                <span className="flex items-center gap-1">
                  🏢 {launch.launch_service_provider.name}
                </span>
              )}
              {launch.status?.name && (
                <span className="flex items-center gap-1">
                  📊 {launch.status.name}
                </span>
              )}
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveTab('video')}
              className={`flex-1 py-4 px-6 font-bold text-sm flex items-center justify-center gap-2 transition ${
                activeTab === 'video'
                  ? 'bg-white text-[#2B8C74] border-b-4 border-[#2B8C74]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Video className="w-5 h-5" />
              Video
            </button>

            <button
              onClick={() => setActiveTab('mission')}
              className={`flex-1 py-4 px-6 font-bold text-sm flex items-center justify-center gap-2 transition ${
                activeTab === 'mission'
                  ? 'bg-white text-[#2B8C74] border-b-4 border-[#2B8C74]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-5 h-5" />
              Mission
            </button>

            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-4 px-6 font-bold text-sm flex items-center justify-center gap-2 transition ${
                activeTab === 'details'
                  ? 'bg-white text-[#2B8C74] border-b-4 border-[#2B8C74]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
              Details
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white">
            {activeTab === 'video' && <VideoTab launch={launch} />}
            {activeTab === 'mission' && <MissionTab launch={launch} />}
            {activeTab === 'details' && <DetailsTab launch={launch} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default LaunchDetailModal;
