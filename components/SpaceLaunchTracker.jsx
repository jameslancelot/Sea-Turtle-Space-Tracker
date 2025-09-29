import React, { useState, useEffect } from 'react';
import { Rocket, Calendar, Clock, MapPin, Info, Globe, Satellite, Target, CheckCircle, XCircle, AlertCircle, Loader, ExternalLink } from 'lucide-react';

/**
 * SpaceX Launch Tracker
 * 
 * This component fetches real-time SpaceX launch data and displays it in an educational format.
 * It uses the free SpaceX API (https://api.spacexdata.com/v5/) through a CORS proxy
 * to ensure it works on Vercel deployment without CORS issues.
 * 
 * CORS Proxy: allorigins.win - bypasses browser CORS restrictions
 * No API key or backend required - works directly in the browser!
 */

const SpaceLaunchTracker = () => {
  const [launches, setLaunches] = useState([]);
  const [rockets, setRockets] = useState({});
  const [launchPads, setLaunchPads] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('upcoming'); // 'upcoming' or 'past'
  const [selectedLaunch, setSelectedLaunch] = useState(null);
  const [countdown, setCountdown] = useState({});

  // Fetch SpaceX data with CORS proxy
  useEffect(() => {
    // CORS proxy to bypass browser restrictions - works on Vercel
    const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
    
    const fetchWithProxy = async (url) => {
      // Use proxy to avoid CORS issues
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
        
        console.log('Fetching SpaceX data through CORS proxy...');
        
        // Fetch all data using the proxy
        const [launchesData, rocketsData, launchPadsData] = await Promise.all([
          fetchWithProxy('https://api.spacexdata.com/v5/launches'),
          fetchWithProxy('https://api.spacexdata.com/v5/rockets'),
          fetchWithProxy('https://api.spacexdata.com/v5/launchpads')
        ]);
        
        console.log(`Successfully fetched ${launchesData.length} launches`);
        
        // Process the data
        const rocketsMap = {};
        rocketsData.forEach(rocket => {
          rocketsMap[rocket.id] = rocket;
        });
        
        const launchPadsMap = {};
        launchPadsData.forEach(pad => {
          launchPadsMap[pad.id] = pad;
        });
        
        // Sort launches by date (newest first)
        const sortedLaunches = launchesData.sort((a, b) => b.date_unix - a.date_unix);
        
        setLaunches(sortedLaunches);
        setRockets(rocketsMap);
        setLaunchPads(launchPadsMap);
        setLoading(false);
        
      } catch (err) {
        console.error('Error fetching SpaceX data:', err);
        
        // If proxy fails, try fallback proxy
        try {
          console.log('Primary proxy failed, trying fallback...');
          
          // Alternative: Try direct fetch one more time in case CORS is temporarily fixed
          const directRes = await fetch('https://api.spacexdata.com/v5/launches/latest');
          if (directRes.ok) {
            // If direct works, use it
            const [launchesData, rocketsData, launchPadsData] = await Promise.all([
              fetch('https://api.spacexdata.com/v5/launches').then(r => r.json()),
              fetch('https://api.spacexdata.com/v5/rockets').then(r => r.json()),
              fetch('https://api.spacexdata.com/v5/launchpads').then(r => r.json())
            ]);
            
            // Process the data
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
            return;
          }
        } catch (fallbackError) {
          console.log('Direct fetch also failed, loading sample data...');
        }
        
        // If all else fails, load sample data
        setError('Unable to connect to SpaceX API. Loading sample data for demonstration.');
        setLoading(false);
        loadSampleData();
      }
    };

    // Function to load sample data if API fails
    const loadSampleData = () => {
      console.log('Loading sample data for demonstration...');
      const sampleLaunches = [
        {
          id: 'sample1',
          name: 'Starlink Group 6-77 (Demo)',
          date_unix: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days from now
          upcoming: true,
          success: null,
          rocket: 'falcon9',
          launchpad: 'ksc_lc_39a',
          details: 'Sample upcoming launch for demonstration purposes.',
          links: {
            patch: { small: 'https://images2.imgbox.com/eb/d8/D1Yywp0w_o.png' },
            webcast: 'https://www.youtube.com/watch?v=5EwW8ZkArL4',
            wikipedia: 'https://en.wikipedia.org/wiki/SpaceX'
          }
        },
        {
          id: 'sample2',
          name: 'Crew-5 (Demo)',
          date_unix: Math.floor(Date.now() / 1000) - 86400 * 30, // 30 days ago
          upcoming: false,
          success: true,
          rocket: 'falcon9',
          launchpad: 'ksc_lc_39a',
          details: 'Sample past launch for demonstration purposes.',
          links: {
            patch: { small: 'https://images2.imgbox.com/33/2e/k6VE4iYl_o.png' },
            webcast: 'https://www.youtube.com/watch?v=5EwW8ZkArL4',
            article: 'https://www.spacex.com'
          }
        },
        {
          id: 'sample3',
          name: 'Falcon Heavy Test (Demo)',
          date_unix: Math.floor(Date.now() / 1000) + 86400 * 14, // 14 days from now
          upcoming: true,
          success: null,
          rocket: 'falconheavy',
          launchpad: 'ksc_lc_39a',
          details: 'Sample Falcon Heavy launch for demonstration.',
          links: {
            patch: { small: 'https://images2.imgbox.com/eb/d8/D1Yywp0w_o.png' }
          }
        }
      ];
      
      const sampleRockets = {
        'falcon9': { id: 'falcon9', name: 'Falcon 9', type: 'Orbital' },
        'falconheavy': { id: 'falconheavy', name: 'Falcon Heavy', type: 'Orbital' }
      };
      
      const sampleLaunchPads = {
        'ksc_lc_39a': { id: 'ksc_lc_39a', full_name: 'Kennedy Space Center LC-39A', name: 'KSC LC-39A' }
      };
      
      setLaunches(sampleLaunches);
      setRockets(sampleRockets);
      setLaunchPads(sampleLaunchPads);
    };

    fetchData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 300000);
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
          newCountdown[launch.id] = { formatted: 'Launched!' };
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
    if (upcoming) return <Clock className="w-5 h-5 text-blue-500" />;
    if (success === null) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    return success ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />;
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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-lg">Loading launch data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen text-white">
        <div className="text-center">
          <Rocket className="w-12 h-12 mx-auto mb-4 text-orange-400" />
          <h1 className="text-4xl font-bold mb-4">Space Launch Tracker</h1>
        </div>
        
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-slate-800 rounded-lg">
          <AlertCircle className="w-10 h-10 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl font-bold mb-3 text-center">Loading Sample Data</h2>
          <p className="text-gray-300 text-center mb-4">{error}</p>
          <div className="text-sm text-gray-400 text-center">
            The tracker is displaying demonstration data. Real launch data will load when the connection is restored.
          </div>
        </div>
        
        {/* Continue to show sample data */}
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {launches.map(launch => {
              const rocket = rockets[launch.rocket];
              const launchpad = launchPads[launch.launchpad];
              
              return (
                <div
                  key={launch.id}
                  className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  {launch.links?.patch?.small && (
                    <div className="h-48 bg-slate-900 flex items-center justify-center p-4">
                      <img 
                        src={launch.links.patch.small} 
                        alt={launch.name}
                        className="h-full object-contain"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2">{launch.name}</h3>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Rocket className="w-4 h-4 mr-2" />
                        <span>{rocket?.name || 'Unknown Rocket'}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(launch.date_unix)}</span>
                      </div>
                      {launchpad && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{launchpad.full_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen text-white">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Rocket className="w-12 h-12 mr-3 text-orange-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
            Space Launch Tracker
          </h1>
        </div>
        <p className="text-gray-300">Track SpaceX and global space launches in real-time</p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-800 rounded-lg p-1 inline-flex">
          <button
            onClick={() => setView('upcoming')}
            className={`px-6 py-2 rounded-md transition-all ${
              view === 'upcoming' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Upcoming Launches
          </button>
          <button
            onClick={() => setView('past')}
            className={`px-6 py-2 rounded-md transition-all ${
              view === 'past' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Past Launches
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{launches.length}</div>
          <div className="text-sm text-gray-400">Total Launches</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {launches.filter(l => l.success).length}
          </div>
          <div className="text-sm text-gray-400">Successful</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">
            {launches.filter(l => l.upcoming).length}
          </div>
          <div className="text-sm text-gray-400">Upcoming</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {Object.keys(rockets).length}
          </div>
          <div className="text-sm text-gray-400">Rocket Types</div>
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
              className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
              onClick={() => setSelectedLaunch(launch)}
            >
              {/* Launch Image */}
              {launch.links?.patch?.small && (
                <div className="h-48 bg-slate-900 flex items-center justify-center p-4">
                  <img 
                    src={launch.links.patch.small} 
                    alt={launch.name}
                    className="h-full object-contain"
                  />
                </div>
              )}
              
              {/* Launch Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-white flex-1">{launch.name}</h3>
                  {getStatusIcon(launch.success, launch.upcoming)}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-400">
                    <Rocket className="w-4 h-4 mr-2" />
                    <span>{rocket?.name || 'Unknown Rocket'}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(launch.date_unix)}</span>
                  </div>
                  
                  {launchpad && (
                    <div className="flex items-center text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="truncate">{launchpad.full_name}</span>
                    </div>
                  )}
                  
                  {launch.upcoming && countdown[launch.id] && (
                    <div className="mt-3 p-2 bg-blue-900 rounded text-center">
                      <div className="text-xs text-blue-300 mb-1">Countdown</div>
                      <div className="font-mono text-blue-100">
                        {countdown[launch.id].formatted}
                      </div>
                    </div>
                  )}
                  
                  {!launch.upcoming && (
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        launch.success 
                          ? 'bg-green-900 text-green-300' 
                          : launch.success === false
                          ? 'bg-red-900 text-red-300'
                          : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {getStatusText(launch.success, launch.upcoming)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Launch Detail Modal */}
      {selectedLaunch && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedLaunch(null)}
        >
          <div 
            className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedLaunch.name}</h2>
                <button
                  onClick={() => setSelectedLaunch(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              {selectedLaunch.details && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Mission Details</h3>
                  <p className="text-gray-300">{selectedLaunch.details}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-gray-400">Rocket:</span>
                  <p className="font-medium">{rockets[selectedLaunch.rocket]?.name}</p>
                </div>
                <div>
                  <span className="text-gray-400">Launch Date:</span>
                  <p className="font-medium">{formatDate(selectedLaunch.date_unix)}</p>
                </div>
                <div>
                  <span className="text-gray-400">Launch Site:</span>
                  <p className="font-medium">{launchPads[selectedLaunch.launchpad]?.full_name}</p>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <p className="font-medium">{getStatusText(selectedLaunch.success, selectedLaunch.upcoming)}</p>
                </div>
              </div>
              
              {selectedLaunch.links && (
                <div className="flex flex-wrap gap-2">
                  {selectedLaunch.links.webcast && (
                    <a
                      href={selectedLaunch.links.webcast}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Watch Video
                    </a>
                  )}
                  {selectedLaunch.links.wikipedia && (
                    <a
                      href={selectedLaunch.links.wikipedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Wikipedia
                    </a>
                  )}
                  {selectedLaunch.links.article && (
                    <a
                      href={selectedLaunch.links.article}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Read Article
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Educational Footer */}
      <div className="mt-12 p-6 bg-slate-800 rounded-lg">
        <h3 className="text-xl font-bold mb-4 text-center">🚀 Fun Space Facts for Students</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start">
            <Satellite className="w-5 h-5 mr-2 mt-1 text-blue-400 flex-shrink-0" />
            <p className="text-gray-300">
              SpaceX was founded in 2002 by Elon Musk with the goal of making space travel affordable and eventually colonizing Mars!
            </p>
          </div>
          <div className="flex items-start">
            <Globe className="w-5 h-5 mr-2 mt-1 text-green-400 flex-shrink-0" />
            <p className="text-gray-300">
              The Falcon 9 rocket can land itself back on Earth after launching, making it reusable and saving millions of dollars!
            </p>
          </div>
          <div className="flex items-start">
            <Target className="w-5 h-5 mr-2 mt-1 text-orange-400 flex-shrink-0" />
            <p className="text-gray-300">
              SpaceX's Starship is designed to carry up to 100 people on long-duration interplanetary flights to Mars and beyond!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceLaunchTracker;