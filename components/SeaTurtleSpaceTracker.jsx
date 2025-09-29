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

  // Fetch SpaceX data with detailed logging
  useEffect(() => {
    const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
    
    const fetchWithProxy = async (url, resourceName) => {
      console.log(`🚀 Attempting to fetch ${resourceName} from: ${url}`);
      
      try {
        // First try direct fetch
        console.log(`  📡 Trying direct fetch for ${resourceName}...`);
        const directResponse = await fetch(url);
        console.log(`  📊 Direct fetch response status for ${resourceName}: ${directResponse.status}`);
        
        if (directResponse.ok) {
          const data = await directResponse.json();
          console.log(`  ✅ Direct fetch successful for ${resourceName}! Got ${Array.isArray(data) ? data.length : 'data'} items`);
          return data;
        } else {
          console.log(`  ⚠️ Direct fetch failed for ${resourceName} with status: ${directResponse.status}`);
        }
      } catch (e) {
        console.log(`  ❌ Direct fetch error for ${resourceName}:`, e.message);
        console.log(`  🔄 Falling back to CORS proxy for ${resourceName}...`);
      }
      
      // If direct fails, use proxy
      const proxyUrl = CORS_PROXY + encodeURIComponent(url);
      console.log(`  🌐 Using proxy URL for ${resourceName}: ${proxyUrl.substring(0, 100)}...`);
      
      try {
        const proxyResponse = await fetch(proxyUrl);
        console.log(`  📊 Proxy response status for ${resourceName}: ${proxyResponse.status}`);
        
        if (!proxyResponse.ok) {
          const errorText = await proxyResponse.text();
          console.error(`  ❌ Proxy failed for ${resourceName}:`, errorText.substring(0, 200));
          throw new Error(`Proxy HTTP error! status: ${proxyResponse.status}`);
        }
        
        const data = await proxyResponse.json();
        console.log(`  ✅ Proxy fetch successful for ${resourceName}! Got ${Array.isArray(data) ? data.length : 'data'} items`);
        return data;
      } catch (proxyError) {
        console.error(`  ❌ Proxy fetch failed for ${resourceName}:`, proxyError);
        throw proxyError;
      }
    };
    
    const fetchData = async () => {
      console.log('🐢 Sea Turtle Space Tracker - Starting data fetch...');
      console.log(`📍 Current time: ${new Date().toISOString()}`);
      console.log(`🌐 Window location: ${typeof window !== 'undefined' ? window.location.href : 'Server-side'}`);
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('📦 Fetching all SpaceX data...');
        const [launchesData, rocketsData, launchPadsData] = await Promise.all([
          fetchWithProxy('https://api.spacexdata.com/v5/launches', 'Launches'),
          fetchWithProxy('https://api.spacexdata.com/v5/rockets', 'Rockets'),
          fetchWithProxy('https://api.spacexdata.com/v5/launchpads', 'Launchpads')
        ]).catch(err => {
          console.error('❌ Promise.all failed:', err);
          throw err;
        });
        
        console.log('📊 Data fetched successfully!');
        console.log(`  - Launches: ${launchesData.length}`);
        console.log(`  - Rockets: ${rocketsData.length}`);
        console.log(`  - Launchpads: ${launchPadsData.length}`);
        
        // Process the data
        console.log('🔧 Processing fetched data...');
        const rocketsMap = {};
        rocketsData.forEach(rocket => {
          rocketsMap[rocket.id] = rocket;
        });
        console.log(`  ✅ Processed ${Object.keys(rocketsMap).length} rocket types`);
        
        const launchPadsMap = {};
        launchPadsData.forEach(pad => {
          launchPadsMap[pad.id] = pad;
        });
        console.log(`  ✅ Processed ${Object.keys(launchPadsMap).length} launch pads`);
        
        // Sort launches by date
        const sortedLaunches = launchesData.sort((a, b) => b.date_unix - a.date_unix);
        console.log(`  ✅ Sorted ${sortedLaunches.length} launches by date`);
        console.log(`  📅 Latest launch: ${sortedLaunches[0]?.name || 'Unknown'}`);
        console.log(`  🚀 Upcoming launches: ${sortedLaunches.filter(l => l.upcoming).length}`);
        
        setLaunches(sortedLaunches);
        setRockets(rocketsMap);
        setLaunchPads(launchPadsMap);
        setLoading(false);
        console.log('✅ Data loading complete! Sea Turtles ready for launch! 🐢🚀');
        
      } catch (err) {
        console.error('❌ Critical error fetching SpaceX data:', err);
        console.error('Stack trace:', err.stack);
        
        // Load sample data as fallback
        console.log('🔄 Loading sample data for demonstration...');
        loadSampleData();
        
        setError('Unable to connect to SpaceX API. Loading sample data for demonstration.');
        setLoading(false);
      }
    };

    // Sample data loader for fallback
    const loadSampleData = () => {
      console.log('🎮 Loading sample/demo data...');
      
      const sampleLaunches = [
        {
          id: 'demo1',
          name: 'Starlink Group 6-77 (Demo)',
          date_unix: Math.floor(Date.now() / 1000) + 86400 * 5,
          upcoming: true,
          success: null,
          rocket: 'falcon9',
          launchpad: 'ksc_lc_39a',
          details: 'Demo launch data - actual data will load when API is available',
          links: {
            patch: { small: 'https://images2.imgbox.com/eb/d8/D1Yywp0w_o.png' },
            webcast: 'https://www.youtube.com/spacex'
          }
        },
        {
          id: 'demo2',
          name: 'Crew-5 (Demo)',
          date_unix: Math.floor(Date.now() / 1000) - 86400 * 10,
          upcoming: false,
          success: true,
          rocket: 'falcon9',
          launchpad: 'ksc_lc_39a',
          details: 'Demo successful mission',
          links: {
            patch: { small: 'https://images2.imgbox.com/33/2e/k6VE4iYl_o.png' }
          }
        },
        {
          id: 'demo3',
          name: 'Falcon Heavy Test (Demo)',
          date_unix: Math.floor(Date.now() / 1000) + 86400 * 15,
          upcoming: true,
          success: null,
          rocket: 'falconheavy',
          launchpad: 'ksc_lc_39a',
          details: 'Demo Falcon Heavy launch',
          links: {
            patch: { small: 'https://images2.imgbox.com/eb/d8/D1Yywp0w_o.png' }
          }
        }
      ];
      
      const sampleRockets = {
        'falcon9': { id: 'falcon9', name: 'Falcon 9' },
        'falconheavy': { id: 'falconheavy', name: 'Falcon Heavy' }
      };
      
      const sampleLaunchPads = {
        'ksc_lc_39a': { 
          id: 'ksc_lc_39a', 
          full_name: 'Kennedy Space Center LC-39A',
          name: 'KSC LC-39A'
        }
      };
      
      setLaunches(sampleLaunches);
      setRockets(sampleRockets);
      setLaunchPads(sampleLaunchPads);
      console.log('✅ Sample data loaded');
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
    if (upcoming) return <Clock className="w-5 h-5 text-blue-400" />;
    if (success === null) return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    return success ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />;
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-900">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shell className="w-12 h-12 animate-bounce text-orange-400 mr-2" />
            <Loader className="w-12 h-12 animate-spin text-blue-400" />
            <Rocket className="w-12 h-12 animate-bounce text-orange-400 ml-2" />
          </div>
          <p className="text-xl text-white">Sea Turtles preparing for launch...</p>
          <p className="text-sm text-blue-300 mt-2">Loading SpaceX mission data 🐢🚀</p>
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
            <div className="text-3xl font-bold text-white">{launches.length}</div>
            <div className="text-sm text-blue-200 flex items-center justify-center mt-1">
              <Globe className="w-4 h-4 mr-1" />
              Total Missions
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-green-400">
              {launches.filter(l => l.success).length}
            </div>
            <div className="text-sm text-green-200 flex items-center justify-center mt-1">
              <CheckCircle className="w-4 h-4 mr-1" />
              Successful
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-orange-400">
              {launches.filter(l => l.upcoming).length}
            </div>
            <div className="text-sm text-orange-200 flex items-center justify-center mt-1">
              <Clock className="w-4 h-4 mr-1" />
              Upcoming
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-purple-400">
              {Object.keys(rockets).length}
            </div>
            <div className="text-sm text-purple-200 flex items-center justify-center mt-1">
              <Rocket className="w-4 h-4 mr-1" />
              Rocket Types
            </div>
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
                className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-xl transition-all hover:scale-105 cursor-pointer group"
              >
                {/* Launch Image */}
                {launch.links?.patch?.small && (
                  <div className="h-48 bg-gradient-to-br from-blue-800 to-teal-700 flex items-center justify-center p-4 relative">
                    <img 
                      src={launch.links.patch.small} 
                      alt={launch.name}
                      className="h-full object-contain group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute top-2 right-2">
                      {getStatusIcon(launch.success, launch.upcoming)}
                    </div>
                  </div>
                )}
                
                {/* Launch Info */}
                <div className="p-4 bg-gradient-to-b from-white/5 to-white/10">
                  <h3 className="text-xl font-bold text-white mb-2">{launch.name}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-blue-200">
                      <Rocket className="w-4 h-4 mr-2" />
                      <span>{rocket?.name || 'Unknown Rocket'}</span>
                    </div>
                    
                    <div className="flex items-center text-green-200">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(launch.date_unix)}</span>
                    </div>
                    
                    {launchpad && (
                      <div className="flex items-center text-orange-200">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="truncate">{launchpad.name}</span>
                      </div>
                    )}
                    
                    {launch.upcoming && countdown[launch.id] && (
                      <div className="mt-3 p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded text-center">
                        <div className="text-xs text-white/90 mb-1">🐢 Countdown to Launch 🚀</div>
                        <div className="font-mono text-white font-bold">
                          {countdown[launch.id].formatted}
                        </div>
                      </div>
                    )}
                    
                    {!launch.upcoming && (
                      <div className="mt-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          launch.success 
                            ? 'bg-green-500 text-white' 
                            : launch.success === false
                            ? 'bg-red-500 text-white'
                            : 'bg-yellow-500 text-white'
                        }`}>
                          {getStatusText(launch.success, launch.upcoming)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Links */}
                  {launch.links && (
                    <div className="mt-3 pt-3 border-t border-white/20 flex gap-2">
                      {launch.links.webcast && (
                        <a
                          href={launch.links.webcast}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-200 flex items-center text-xs"
                          onClick={(e) => e.stopPropagation()}
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
                          className="text-green-300 hover:text-green-200 flex items-center text-xs"
                          onClick={(e) => e.stopPropagation()}
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

export default SeaTurtleSpaceTracker;