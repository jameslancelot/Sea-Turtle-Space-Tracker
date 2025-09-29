import React, { useState, useEffect } from 'react';
import { Rocket, Calendar, Clock, MapPin, Globe, Waves, Shell, Fish, Anchor, CheckCircle, XCircle, AlertCircle, Loader, ExternalLink, Star, Zap } from 'lucide-react';

/**
 * Sea Turtle Space Tracker - PVPV/Rawlings Elementary School
 * 
 * A SpaceX launch tracker themed for the Sea Turtles!
 * Combining ocean exploration with space exploration.
 * "Surfing to Success" - From the Ocean to the Stars! 🐢🚀
 */

const SeaTurtleSpaceTracker = () => {
  const [launches, setLaunches] = useState([]);
  const [rockets, setRockets] = useState({});
  const [launchPads, setLaunchPads] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('upcoming');
  const [countdown, setCountdown] = useState({});

  // Fetch SpaceX data using CORS proxy for deployment
  useEffect(() => {
    const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
    
    const fetchWithProxy = async (url) => {
      try {
        // First try direct fetch (works in many deployment environments)
        const directResponse = await fetch(url);
        if (directResponse.ok) {
          return directResponse.json();
        }
      } catch (e) {
        // If direct fails, use proxy
        console.log('Using CORS proxy...');
      }
      
      const proxyUrl = CORS_PROXY + encodeURIComponent(url);
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    };
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [launchesData, rocketsData, launchPadsData] = await Promise.all([
          fetchWithProxy('https://api.spacexdata.com/v5/launches'),
          fetchWithProxy('https://api.spacexdata.com/v5/rockets'),
          fetchWithProxy('https://api.spacexdata.com/v5/launchpads')
        ]);
        
        const rocketsMap = {};
        rocketsData.forEach(rocket => {
          rocketsMap[rocket.id] = rocket;
        });
        
        const launchPadsMap = {};
        launchPadsData.forEach(pad => {
          launchPadsMap[pad.id] = pad;
        });
        
        setLaunches(launchesData.sort((a, b) => b.date_unix - a.date_unix));
        setRockets(rocketsMap);
        setLaunchPads(launchPadsMap);
        setLoading(false);
        
      } catch (err) {
        console.error('Error fetching SpaceX data:', err);
        setError('Unable to load live data. Please check your connection.');
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
      
      launches.filter(launch => launch.upcoming).forEach(launch => {
        const launchTime = launch.date_unix * 1000;
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

  const formatDate = (dateUnix) => {
    const date = new Date(dateUnix * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getStatusIcon = (success, upcoming) => {
    if (upcoming) return <Clock className="w-5 h-5 text-cyan-400" />;
    if (success === null) return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    return success ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />;
  };

  const getStatusText = (success, upcoming) => {
    if (upcoming) return 'Upcoming';
    if (success === null) return 'Unknown';
    return success ? 'Success' : 'Failed';
  };

  const filteredLaunches = launches.filter(launch => 
    view === 'upcoming' ? launch.upcoming : !launch.upcoming
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Waves className="w-16 h-16 text-teal-600 animate-pulse mx-auto" />
            <Rocket className="w-8 h-8 text-orange-500 absolute top-0 right-0 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-teal-800 mt-4">Swimming to the Stars...</h2>
          <p className="text-teal-600 mt-2">Loading launch data for our Sea Turtles!</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-cyan-50 to-teal-50 p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-teal-200">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-teal-800 text-center mb-3">Connection Issue</h2>
            <p className="text-gray-600 text-center">{error}</p>
            <div className="mt-6 p-4 bg-teal-50 rounded-lg">
              <p className="text-sm text-teal-700 text-center">
                Don't worry Sea Turtles! Try refreshing the page or check back later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-cyan-50 to-teal-50">
      {/* Ocean wave decoration */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400"></div>
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 left-10 text-6xl opacity-20 animate-pulse">🐢</div>
          <div className="absolute top-0 right-10 text-6xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}>🚀</div>
          
          <h1 className="text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Sea Turtle 
            </span>
            <span className="text-orange-500"> Space </span>
            <span className="bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent">
              Tracker
            </span>
          </h1>
          <p className="text-xl text-teal-700 font-medium">PVPV/Rawlings Elementary School</p>
          <p className="text-lg text-teal-600 italic mt-1">"Surfing to Success - From the Ocean to the Stars!"</p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-full p-1.5 shadow-lg inline-flex border-2 border-teal-200">
            <button
              onClick={() => setView('upcoming')}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                view === 'upcoming' 
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-teal-600'
              }`}
            >
              🚀 Future Launches
            </button>
            <button
              onClick={() => setView('past')}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                view === 'past' 
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-teal-600'
              }`}
            >
              ⭐ Past Missions
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 text-center transform hover:scale-105 transition-transform border-2 border-teal-100">
            <Rocket className="w-8 h-8 mx-auto mb-2 text-teal-500" />
            <div className="text-3xl font-bold text-teal-700">{launches.length}</div>
            <div className="text-sm text-gray-600">Total Launches</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center transform hover:scale-105 transition-transform border-2 border-emerald-100">
            <Star className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
            <div className="text-3xl font-bold text-emerald-600">
              {launches.filter(l => l.success).length}
            </div>
            <div className="text-sm text-gray-600">Successful</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center transform hover:scale-105 transition-transform border-2 border-orange-100">
            <Zap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-3xl font-bold text-orange-600">
              {launches.filter(l => l.upcoming).length}
            </div>
            <div className="text-sm text-gray-600">Coming Soon</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center transform hover:scale-105 transition-transform border-2 border-sky-100">
            <Globe className="w-8 h-8 mx-auto mb-2 text-sky-500" />
            <div className="text-3xl font-bold text-sky-600">
              {Object.keys(rockets).length}
            </div>
            <div className="text-sm text-gray-600">Rocket Types</div>
          </div>
        </div>

        {/* Launches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLaunches.slice(0, 30).map(launch => {
            const rocket = rockets[launch.rocket];
            const launchpad = launchPads[launch.launchpad];
            
            return (
              <div
                key={launch.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-105 border-2 border-teal-100"
              >
                {/* Launch Image */}
                {launch.links?.patch?.small && (
                  <div className="h-48 bg-gradient-to-b from-sky-100 to-teal-50 flex items-center justify-center p-4 relative">
                    <div className="absolute top-2 left-2 text-2xl opacity-50">🐢</div>
                    <img 
                      src={launch.links.patch.small} 
                      alt={launch.name}
                      className="h-full object-contain"
                    />
                    <div className="absolute top-2 right-2">
                      {getStatusIcon(launch.success, launch.upcoming)}
                    </div>
                  </div>
                )}
                
                {/* Launch Info */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-teal-800 mb-3">{launch.name}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Rocket className="w-4 h-4 mr-2 text-orange-400" />
                      <span className="text-sm">{rocket?.name || 'Unknown Rocket'}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-cyan-400" />
                      <span className="text-sm">{formatDate(launch.date_unix)}</span>
                    </div>
                    
                    {launchpad && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-teal-400" />
                        <span className="text-sm truncate">{launchpad.full_name}</span>
                      </div>
                    )}
                    
                    {launch.upcoming && countdown[launch.id] && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg text-center border border-teal-200">
                        <div className="text-xs text-teal-600 font-semibold mb-1">🏊 Swimming Closer!</div>
                        <div className="font-mono text-lg text-teal-800 font-bold">
                          {countdown[launch.id].formatted}
                        </div>
                      </div>
                    )}
                    
                    {!launch.upcoming && (
                      <div className="mt-3">
                        <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${
                          launch.success 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : launch.success === false
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {getStatusText(launch.success, launch.upcoming)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Links */}
                  {launch.links && (launch.links.webcast || launch.links.wikipedia) && (
                    <div className="mt-4 flex gap-2">
                      {launch.links.webcast && (
                        <a
                          href={launch.links.webcast}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg text-xs font-semibold transition-all"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Watch
                        </a>
                      )}
                      {launch.links.wikipedia && (
                        <a
                          href={launch.links.wikipedia}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-xs font-semibold transition-all"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Learn
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sea Turtle Fun Facts */}
        <div className="mt-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl shadow-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-3">
            <span className="text-3xl">🐢</span>
            Sea Turtle Space Facts
            <span className="text-3xl">🚀</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Waves className="w-8 h-8 mb-2 text-cyan-200" />
              <p className="text-sm leading-relaxed">
                Just like sea turtles navigate the ocean currents, SpaceX rockets navigate through Earth's atmosphere at speeds over 17,000 mph!
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Shell className="w-8 h-8 mb-2 text-cyan-200" />
              <p className="text-sm leading-relaxed">
                Sea turtles can hold their breath for hours underwater. SpaceX Dragon capsules can support astronauts for up to 10 days in space!
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Fish className="w-8 h-8 mb-2 text-cyan-200" />
              <p className="text-sm leading-relaxed">
                Sea turtles always return to their birthplace to nest. SpaceX rockets return to Earth and land themselves for reuse!
              </p>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-cyan-100 text-sm italic">
              "From PVPV/Rawlings, we're surfing to success - reaching for the stars while protecting our seas!" 🌊⭐
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeaTurtleSpaceTracker;