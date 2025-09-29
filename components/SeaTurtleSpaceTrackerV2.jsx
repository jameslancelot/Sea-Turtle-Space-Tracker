import React, { useState, useEffect } from 'react';
import { Rocket, Calendar, Clock, MapPin, Globe, Waves, Shell, Fish, Anchor, CheckCircle, XCircle, AlertCircle, Loader, ExternalLink, Star, Zap } from 'lucide-react';

/**
 * Sea Turtle Space Tracker - PVPV/Rawlings Elementary School
 * 
 * Updated to use Launch Library 2 API for current SpaceX launch data
 * "Surfing to Success" - From the Ocean to the Stars! 🐢🚀
 */

const SeaTurtleSpaceTrackerV2 = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('upcoming');
  const [countdown, setCountdown] = useState({});

  // Fetch launch data
  useEffect(() => {
    const fetchData = async () => {
      console.log('🐢 Sea Turtle Space Tracker V2 - Starting data fetch...');
      console.log(`📍 Current time: ${new Date().toISOString()}`);
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('📦 Fetching SpaceX launches from Launch Library 2...');
        const response = await fetch('/api/spacex?resource=launches');
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const launchesData = await response.json();
        console.log(`✅ Fetched ${launchesData.length} launches`);
        
        setLaunches(launchesData);
        setLoading(false);
        console.log('✅ Data loading complete! Sea Turtles ready for launch! 🐢🚀');
        
      } catch (err) {
        console.error('❌ Critical error fetching launch data:', err);
        setError('Unable to fetch live launch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
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
            days,
            hours,
            minutes,
            seconds,
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-900">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shell className="w-12 h-12 animate-bounce text-orange-400 mr-2" />
            <Loader className="w-12 h-12 animate-spin text-blue-400" />
            <Rocket className="w-12 h-12 animate-bounce text-orange-400 ml-2" />
          </div>
          <p className="text-xl text-white">Sea Turtles preparing for launch...</p>
          <p className="text-sm text-blue-300 mt-2">Loading current SpaceX mission data 🐢🚀</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-yellow-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shell className="w-10 h-10 text-white mr-3 animate-pulse" />
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  Sea Turtle Space Tracker
                  <Rocket className="w-8 h-8 ml-3 text-white" />
                </h1>
                <p className="text-white/90 text-sm">PVPV/Rawlings Elementary - Surfing to Success! 🐢</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Waves className="w-6 h-6 text-white/80" />
              <span className="text-white font-medium">From Ocean to Orbit</span>
              <Star className="w-6 h-6 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-500/20 border-l-4 border-yellow-500 p-4 mx-4 mt-4">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-yellow-500 mr-3" />
            <p className="text-white">{error}</p>
          </div>
        </div>
      )}

      {/* View Toggle */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 inline-flex">
            <button
              onClick={() => setView('upcoming')}
              className={`px-6 py-2 rounded-md transition-all font-medium ${
                view === 'upcoming' 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              🚀 Upcoming Missions
            </button>
            <button
              onClick={() => setView('past')}
              className={`px-6 py-2 rounded-md transition-all font-medium ${
                view === 'past' 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              ✅ Past Launches
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-blue-200 flex items-center justify-center mt-1">
              <Globe className="w-4 h-4 mr-1" />
              Total Missions
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-green-400">{stats.successful}</div>
            <div className="text-sm text-green-200 flex items-center justify-center mt-1">
              <CheckCircle className="w-4 h-4 mr-1" />
              Successful
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-orange-400">{stats.upcoming}</div>
            <div className="text-sm text-orange-200 flex items-center justify-center mt-1">
              <Clock className="w-4 h-4 mr-1" />
              Upcoming
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-purple-400">{stats.rockets}</div>
            <div className="text-sm text-purple-200 flex items-center justify-center mt-1">
              <Rocket className="w-4 h-4 mr-1" />
              Rocket Types
            </div>
          </div>
        </div>

        {/* Launches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLaunches.slice(0, 30).map(launch => (
            <div
              key={launch.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-xl transition-all hover:scale-105 cursor-pointer group"
            >
              {/* Launch Image */}
              {launch.image && (
                <div className="h-48 bg-gradient-to-br from-blue-800 to-teal-700 flex items-center justify-center p-4 relative">
                  <img 
                    src={launch.image} 
                    alt={launch.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusIcon(launch)}
                  </div>
                </div>
              )}
              
              {/* Launch Info */}
              <div className="p-4 bg-gradient-to-b from-white/5 to-white/10">
                <h3 className="text-xl font-bold text-white mb-2">{launch.name}</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-blue-200">
                    <Rocket className="w-4 h-4 mr-2" />
                    <span>{launch.rocket?.configuration?.name || 'Unknown Rocket'}</span>
                  </div>
                  
                  <div className="flex items-center text-green-200">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(launch.net)}</span>
                  </div>
                  
                  {launch.pad && (
                    <div className="flex items-center text-orange-200">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="truncate">{launch.pad.name}</span>
                    </div>
                  )}
                  
                  {isUpcoming(launch) && countdown[launch.id] && (
                    <div className="mt-3 p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded text-center">
                      <div className="text-xs text-white/90 mb-1">🐢 Countdown to Launch 🚀</div>
                      <div className="font-mono text-white font-bold">
                        {countdown[launch.id].formatted}
                      </div>
                    </div>
                  )}
                  
                  {!isUpcoming(launch) && (
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        launch.status?.id === 3
                          ? 'bg-green-500 text-white' 
                          : launch.status?.id === 4
                          ? 'bg-red-500 text-white'
                          : 'bg-yellow-500 text-white'
                      }`}>
                        {getStatusText(launch)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Links */}
                {launch.vidURLs && launch.vidURLs.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/20 flex gap-2">
                    <a
                      href={launch.vidURLs[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-200 flex items-center text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Watch
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Educational Footer */}
        <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-lg">
          <h3 className="text-2xl font-bold mb-4 text-center text-white flex items-center justify-center">
            <Shell className="w-6 h-6 mr-2 text-orange-400" />
            Sea Turtle Space Facts
            <Rocket className="w-6 h-6 ml-2 text-orange-400" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start">
              <Fish className="w-5 h-5 mr-2 mt-1 text-blue-400 flex-shrink-0" />
              <p className="text-blue-100">
                Just like sea turtles navigate vast oceans, SpaceX rockets navigate through space to deliver satellites and astronauts to orbit!
              </p>
            </div>
            <div className="flex items-start">
              <Anchor className="w-5 h-5 mr-2 mt-1 text-green-400 flex-shrink-0" />
              <p className="text-green-100">
                The Falcon 9 rocket can land itself back on Earth, just like sea turtles return to the same beach where they were born!
              </p>
            </div>
            <div className="flex items-start">
              <Zap className="w-5 h-5 mr-2 mt-1 text-orange-400 flex-shrink-0" />
              <p className="text-orange-100">
                SpaceX has launched over 5,000 Starlink satellites to provide internet access worldwide - even to remote islands where sea turtles nest!
              </p>
            </div>
          </div>
          <div className="text-center mt-4 text-yellow-300 font-medium">
            "Surfing to Success" - PVPV/Rawlings Elementary Sea Turtles 🐢
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeaTurtleSpaceTrackerV2;
