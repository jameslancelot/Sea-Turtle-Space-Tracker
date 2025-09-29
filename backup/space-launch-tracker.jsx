import React, { useState, useEffect } from 'react';
import { Rocket, Calendar, Clock, MapPin, Info, Globe, Satellite, Target, CheckCircle, XCircle, AlertCircle, Loader, ExternalLink } from 'lucide-react';

const SpaceLaunchTracker = () => {
  const [launches, setLaunches] = useState([]);
  const [rockets, setRockets] = useState({});
  const [launchPads, setLaunchPads] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('upcoming'); // 'upcoming' or 'past'
  const [selectedLaunch, setSelectedLaunch] = useState(null);
  const [countdown, setCountdown] = useState({});

  // Fetch SpaceX data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try v5 API first, then fallback to v4
        let apiVersion = 'v5';
        let launchesData, rocketsData, launchPadsData;
        
        try {
          console.log('Attempting to fetch from SpaceX API v5...');
          // Test with a simple request first
          const testRes = await fetch('https://api.spacexdata.com/v5/launches/latest');
          if (!testRes.ok) throw new Error(`HTTP error! status: ${testRes.status}`);
          
          // Fetch all launches
          const launchesRes = await fetch('https://api.spacexdata.com/v5/launches');
          if (!launchesRes.ok) throw new Error(`HTTP error! status: ${launchesRes.status}`);
          launchesData = await launchesRes.json();
          
          // Fetch rockets
          const rocketsRes = await fetch('https://api.spacexdata.com/v5/rockets');
          if (!rocketsRes.ok) throw new Error(`HTTP error! status: ${rocketsRes.status}`);
          rocketsData = await rocketsRes.json();
          
          // Fetch launchpads
          const launchPadsRes = await fetch('https://api.spacexdata.com/v5/launchpads');
          if (!launchPadsRes.ok) throw new Error(`HTTP error! status: ${launchPadsRes.status}`);
          launchPadsData = await launchPadsRes.json();
          
        } catch (v5Error) {
          console.log('v5 API failed, trying v4...', v5Error);
          apiVersion = 'v4';
          
          // Try v4 API
          const launchesRes = await fetch('https://api.spacexdata.com/v4/launches');
          if (!launchesRes.ok) throw new Error(`HTTP error! status: ${launchesRes.status}`);
          launchesData = await launchesRes.json();
          
          const rocketsRes = await fetch('https://api.spacexdata.com/v4/rockets');
          if (!rocketsRes.ok) throw new Error(`HTTP error! status: ${rocketsRes.status}`);
          rocketsData = await rocketsRes.json();
          
          const launchPadsRes = await fetch('https://api.spacexdata.com/v4/launchpads');
          if (!launchPadsRes.ok) throw new Error(`HTTP error! status: ${launchPadsRes.status}`);
          launchPadsData = await launchPadsRes.json();
        }
        
        console.log(`Successfully fetched data from SpaceX API ${apiVersion}`);
        console.log(`Found ${launchesData.length} launches`);
        
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
        
      } catch (err) {
        console.error('Error fetching SpaceX data:', err);
        
        // Provide more detailed error message
        let errorMessage = 'Failed to fetch launch data. ';
        
        if (err.message.includes('Failed to fetch')) {
          errorMessage += 'This might be a CORS issue. The SpaceX API is working, but your browser may be blocking the request. ';
          errorMessage += 'Try: 1) Opening this in a different browser, 2) Using a CORS extension, or 3) Running this from a local development server.';
        } else if (err.message.includes('404')) {
          errorMessage += 'API endpoint not found. The API structure may have changed.';
        } else if (err.message.includes('500')) {
          errorMessage += 'SpaceX API server error. Please try again later.';
        } else {
          errorMessage += err.message;
        }
        
        setError(errorMessage);
        setLoading(false);
        
        // Try to load sample data as fallback
        loadSampleData();
      }
    };

    // Function to load sample data if API fails
    const loadSampleData = () => {
      console.log('Loading sample data for demonstration...');
      const sampleLaunches = [
        {
          id: 'sample1',
          name: 'Starlink Group 6-77',
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
          name: 'Crew-5',
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
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-2xl mx-auto p-6">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl font-bold mb-3 text-red-400">Connection Issue Detected</h2>
          <p className="text-lg text-red-300 mb-4">{error}</p>
          
          {error.includes('CORS') && (
            <div className="bg-slate-800 rounded-lg p-4 text-left mt-4">
              <h3 className="font-bold text-yellow-400 mb-2">Quick Solutions:</h3>
              <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                <li>If using Chrome, install the "CORS Unblock" extension from Chrome Web Store</li>
                <li>Try opening this in Firefox or Safari (they may handle CORS differently)</li>
                <li>For school computers, ask IT to whitelist api.spacexdata.com</li>
                <li>Run this from a local development server (npm/yarn start)</li>
              </ol>
              <p className="text-xs text-gray-400 mt-3">
                Note: The SpaceX API itself is working fine - this is just a browser security restriction.
              </p>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-blue-900 rounded text-sm text-blue-200">
            ℹ️ Using sample data for demonstration. Real data will load when connection is restored.
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