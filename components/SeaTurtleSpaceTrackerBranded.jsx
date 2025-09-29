import React, { useState, useEffect } from 'react';
import { Rocket, Calendar, Clock, MapPin, Globe, Waves, Shell, Anchor, CheckCircle, XCircle, AlertCircle, Loader, ExternalLink, Star, Zap, Palmtree } from 'lucide-react';

/**
 * Sea Turtle Space Tracker - PVPV/Rawlings Elementary School
 * 
 * Branded with official school colors and mascot
 * "Surfing to Success" - From the Ocean to the Stars! 🐢🚀
 */

const SeaTurtleSpaceTrackerBranded = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('upcoming');
  const [countdown, setCountdown] = useState({});

  // Fetch launch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/spacex?resource=launches');
        if (!response.ok) throw new Error(`API returned status ${response.status}`);
        
        const launchesData = await response.json();
        setLaunches(launchesData);
        setLoading(false);
        
      } catch (err) {
        console.error('❌ Critical error fetching launch data:', err);
        setError('Unable to fetch live launch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const newCountdown = {};
      
      launches.filter(launch => isUpcoming(launch)).forEach(launch => {
        const launchTime = new Date(launch.net).getTime();
        const diff = launchTime - now;
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          newCountdown[launch.id] = {
            days, hours, minutes, seconds,
            formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`
          };
        } else {
          newCountdown[launch.id] = { formatted: 'Launched! 🚀' };
        }
      });
      
      setCountdown(newCountdown);
    }, 1000);

    return () => clearInterval(timer);
  }, [launches]);

  const isUpcoming = (launch) => {
    return launch.status?.id === 1 || launch.status?.id === 2 || new Date(launch.net) > new Date();
  };

  const formatDate = (netDate) => {
    const date = new Date(netDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getStatusIcon = (launch) => {
    const upcoming = isUpcoming(launch);
    if (upcoming) return <Clock className="w-5 h-5 text-blue-400" />;
    if (launch.status?.id === 3) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (launch.status?.id === 4) return <XCircle className="w-5 h-5 text-red-400" />;
    return <AlertCircle className="w-5 h-5 text-yellow-400" />;
  };

  const getStatusText = (launch) => {
    return launch.status?.name || 'Unknown';
  };

  const filteredLaunches = launches.filter(launch => 
    view === 'upcoming' ? isUpcoming(launch) : !isUpcoming(launch)
  );

  const stats = {
    total: launches.length,
    successful: launches.filter(l => l.status?.id === 3).length,
    upcoming: launches.filter(l => isUpcoming(l)).length,
    rockets: [...new Set(launches.map(l => l.rocket?.configuration?.name).filter(Boolean))].length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#003366] via-[#2B5F87] to-[#1a4d6f]">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Palmtree className="w-12 h-12 animate-bounce text-[#6BA539] mr-2" />
            <Loader className="w-12 h-12 animate-spin text-[#F7941D]" />
            <Rocket className="w-12 h-12 animate-bounce text-[#FDB913] ml-2" />
          </div>
          <p className="text-xl text-white font-bold">Sea Turtles preparing for launch...</p>
          <p className="text-sm text-[#FDB913] mt-2">Loading SpaceX mission data 🐢🚀</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003366] via-[#2B5F87] to-[#1a4d6f] relative overflow-hidden">
      {/* Decorative palm trees */}
      <div className="absolute top-0 left-0 opacity-5 pointer-events-none">
        <Palmtree className="w-64 h-64 text-[#6BA539]" />
      </div>
      <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
        <Palmtree className="w-96 h-96 text-[#6BA539]" />
      </div>
      
      {/* Floating stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Star 
            key={i}
            className="absolute text-[#FDB913] opacity-30 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 12 + 8}px`,
              height: `${Math.random() * 12 + 8}px`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header with School Logo */}
      <div className="relative z-10 bg-gradient-to-r from-[#F7941D] to-[#FDB913] shadow-2xl border-b-4 border-[#003366]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {/* School Logo */}
              <div className="bg-white rounded-full p-2 shadow-lg">
                <img 
                  src="/images/NEW-LOGO.png" 
                  alt="PVPV Rawlings Elementary Sea Turtle" 
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    // Fallback if logo doesn't load
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-[#003366] flex items-center gap-3">
                  Sea Turtle Space Tracker
                  <Rocket className="w-8 h-8 text-[#003366]" />
                </h1>
                <p className="text-[#003366] text-sm md:text-base font-bold mt-1">
                  PVPV/Rawlings Elementary - Surfing to Success! 🐢🏄‍♂️
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-[#003366] px-4 py-2 rounded-full shadow-lg">
              <Waves className="w-5 h-5 text-[#FDB913]" />
              <span className="text-white font-bold text-sm">From Ocean to Orbit</span>
              <Star className="w-5 h-5 text-[#FDB913] fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/20 border-l-4 border-red-500 p-4 mx-4 mt-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
            <p className="text-white font-semibold">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* View Toggle - Surfboard Style! */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-full p-1.5 inline-flex shadow-xl border-2 border-[#FDB913]">
            <button
              onClick={() => setView('upcoming')}
              className={`px-6 py-3 rounded-full transition-all font-bold text-sm ${
                view === 'upcoming' 
                  ? 'bg-gradient-to-r from-[#F7941D] to-[#FDB913] text-[#003366] shadow-lg transform scale-105' 
                  : 'text-white hover:text-[#FDB913]'
              }`}
            >
              🚀 Upcoming Missions
            </button>
            <button
              onClick={() => setView('past')}
              className={`px-6 py-3 rounded-full transition-all font-bold text-sm ${
                view === 'past' 
                  ? 'bg-gradient-to-r from-[#F7941D] to-[#FDB913] text-[#003366] shadow-lg transform scale-105' 
                  : 'text-white hover:text-[#FDB913]'
              }`}
            >
              ✅ Past Launches
            </button>
          </div>
        </div>

        {/* Stats Bar - Shell Shaped! */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-5 text-center transform hover:scale-105 transition-all shadow-xl border-2 border-[#FDB913]/30">
            <div className="text-4xl font-black text-white drop-shadow-lg">{stats.total}</div>
            <div className="text-sm text-[#FDB913] font-bold flex items-center justify-center mt-2 gap-1">
              <Globe className="w-4 h-4" />
              Total Missions
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-5 text-center transform hover:scale-105 transition-all shadow-xl border-2 border-[#6BA539]/30">
            <div className="text-4xl font-black text-[#6BA539] drop-shadow-lg">{stats.successful}</div>
            <div className="text-sm text-[#6BA539] font-bold flex items-center justify-center mt-2 gap-1">
              <CheckCircle className="w-4 h-4" />
              Successful
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-5 text-center transform hover:scale-105 transition-all shadow-xl border-2 border-[#F7941D]/30">
            <div className="text-4xl font-black text-[#F7941D] drop-shadow-lg">{stats.upcoming}</div>
            <div className="text-sm text-[#F7941D] font-bold flex items-center justify-center mt-2 gap-1">
              <Clock className="w-4 h-4" />
              Upcoming
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-5 text-center transform hover:scale-105 transition-all shadow-xl border-2 border-white/30">
            <div className="text-4xl font-black text-white drop-shadow-lg">{stats.rockets}</div>
            <div className="text-sm text-white font-bold flex items-center justify-center mt-2 gap-1">
              <Rocket className="w-4 h-4" />
              Rocket Types
            </div>
          </div>
        </div>

        {/* Launches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLaunches.slice(0, 30).map(launch => (
            <div
              key={launch.id}
              className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:scale-105 cursor-pointer group border-2 border-[#FDB913]/30"
            >
              {/* Launch Image */}
              {launch.image && (
                <div className="h-48 bg-gradient-to-br from-[#003366] to-[#2B5F87] flex items-center justify-center p-4 relative overflow-hidden">
                  <img 
                    src={launch.image} 
                    alt={launch.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-[#003366]/80 backdrop-blur-sm rounded-full p-2">
                    {getStatusIcon(launch)}
                  </div>
                  {/* Palm tree decoration */}
                  <Palmtree className="absolute bottom-2 left-2 w-8 h-8 text-[#6BA539] opacity-50" />
                </div>
              )}
              
              {/* Launch Info */}
              <div className="p-5 bg-gradient-to-b from-[#003366]/80 to-[#003366]/60">
                <h3 className="text-xl font-black text-white mb-3 leading-tight">{launch.name}</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-[#FDB913] font-semibold">
                    <Rocket className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{launch.rocket?.configuration?.name || 'Unknown Rocket'}</span>
                  </div>
                  
                  <div className="flex items-start text-[#6BA539] font-semibold">
                    <Calendar className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="leading-tight">{formatDate(launch.net)}</span>
                  </div>
                  
                  {launch.pad && (
                    <div className="flex items-start text-white/90 font-semibold">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="truncate leading-tight">{launch.pad.name}</span>
                    </div>
                  )}
                  
                  {isUpcoming(launch) && countdown[launch.id] && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-[#F7941D] to-[#FDB913] rounded-xl text-center shadow-lg">
                      <div className="text-xs text-[#003366] font-black mb-1 flex items-center justify-center gap-1">
                        <Waves className="w-3 h-3" />
                        COUNTDOWN TO LAUNCH
                        <Rocket className="w-3 h-3" />
                      </div>
                      <div className="font-mono text-[#003366] font-black text-lg">
                        {countdown[launch.id].formatted}
                      </div>
                    </div>
                  )}
                  
                  {!isUpcoming(launch) && (
                    <div className="mt-3">
                      <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black shadow-lg ${
                        launch.status?.id === 3
                          ? 'bg-[#6BA539] text-white' 
                          : launch.status?.id === 4
                          ? 'bg-red-500 text-white'
                          : 'bg-[#FDB913] text-[#003366]'
                      }`}>
                        {getStatusText(launch)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Links */}
                {launch.vidURLs && launch.vidURLs.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/20 flex gap-2">
                    <a
                      href={launch.vidURLs[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FDB913] hover:text-white flex items-center text-xs font-bold transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Watch Launch
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Educational Footer with School Branding */}
        <div className="mt-12 p-8 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-[#FDB913]/30">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Palmtree className="w-8 h-8 text-[#6BA539]" />
            <h3 className="text-3xl font-black text-center text-white">
              Sea Turtle Space Facts
            </h3>
            <Rocket className="w-8 h-8 text-[#F7941D]" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-start bg-[#003366]/40 p-4 rounded-xl">
              <Waves className="w-6 h-6 mr-3 mt-1 text-[#FDB913] flex-shrink-0" />
              <p className="text-white/90 leading-relaxed">
                Just like sea turtles navigate vast oceans, SpaceX rockets navigate through space to deliver satellites and astronauts to orbit!
              </p>
            </div>
            <div className="flex items-start bg-[#003366]/40 p-4 rounded-xl">
              <Anchor className="w-6 h-6 mr-3 mt-1 text-[#6BA539] flex-shrink-0" />
              <p className="text-white/90 leading-relaxed">
                The Falcon 9 rocket can land itself back on Earth, just like sea turtles return to the same beach where they were born!
              </p>
            </div>
            <div className="flex items-start bg-[#003366]/40 p-4 rounded-xl">
              <Zap className="w-6 h-6 mr-3 mt-1 text-[#F7941D] flex-shrink-0" />
              <p className="text-white/90 leading-relaxed">
                SpaceX has launched over 5,000 Starlink satellites to provide internet access worldwide - even to remote islands where sea turtles nest!
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8 p-4 bg-gradient-to-r from-[#F7941D] to-[#FDB913] rounded-xl shadow-lg">
            <p className="text-[#003366] font-black text-lg flex items-center justify-center gap-2">
              <Shell className="w-5 h-5" />
              "Surfing to Success" - PVPV/Rawlings Elementary Sea Turtles
              <Palmtree className="w-5 h-5" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeaTurtleSpaceTrackerBranded;
