import React, { useState, useEffect } from 'react';
import { Rocket, Calendar, Clock, MapPin, Globe, Waves, Shell, Fish, Star, Zap, CheckCircle, XCircle, AlertCircle, Loader, ExternalLink } from 'lucide-react';

/**
 * Sea Turtle Space Tracker - PVPV/Rawlings Elementary School
 * Preview Version with Static Data for Claude Artifacts
 */

const SeaTurtleSpaceTracker = () => {
  const [launches, setLaunches] = useState([]);
  const [rockets, setRockets] = useState({});
  const [launchPads, setLaunchPads] = useState({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('upcoming');
  const [countdown, setCountdown] = useState({});

  // Load static data for artifact preview
  useEffect(() => {
    const loadStaticData = () => {
      const staticLaunches = [
        {
          id: 'starlink-6-77',
          name: 'Starlink Group 6-77',
          date_unix: Math.floor(Date.now() / 1000) + 86400 * 3,
          upcoming: true,
          success: null,
          rocket: 'falcon9',
          launchpad: 'ccafs_slc_40',
          details: 'Deployment of 23 Starlink v2 Mini satellites to low Earth orbit.',
          links: {
            patch: { small: 'https://images2.imgbox.com/eb/d8/D1Yywp0w_o.png' },
            webcast: 'https://www.youtube.com/spacex',
            wikipedia: 'https://en.wikipedia.org/wiki/Starlink'
          }
        },
        {
          id: 'crew-10',
          name: 'Crew-10',
          date_unix: Math.floor(Date.now() / 1000) + 86400 * 15,
          upcoming: true,
          success: null,
          rocket: 'falcon9',
          launchpad: 'ksc_lc_39a',
          details: 'NASA Commercial Crew Program mission to the ISS.',
          links: {
            patch: { small: 'https://images2.imgbox.com/33/2e/k6VE4iYl_o.png' },
            webcast: 'https://www.youtube.com/spacex'
          }
        },
        {
          id: 'europa-clipper',
          name: 'Europa Clipper',
          date_unix: Math.floor(Date.now() / 1000) + 86400 * 28,
          upcoming: true,
          success: null,
          rocket: 'falconheavy',
          launchpad: 'ksc_lc_39a',
          details: 'NASA mission to study Jupiter\'s moon Europa.',
          links: {
            patch: { small: 'https://images2.imgbox.com/eb/d8/D1Yywp0w_o.png' }
          }
        },
        {
          id: 'starlink-6-76',
          name: 'Starlink Group 6-76',
          date_unix: Math.floor(Date.now() / 1000) - 86400 * 2,
          upcoming: false,
          success: true,
          rocket: 'falcon9',
          launchpad: 'ccafs_slc_40',
          details: 'Successful deployment of 23 Starlink satellites.',
          links: {
            patch: { small: 'https://images2.imgbox.com/eb/d8/D1Yywp0w_o.png' },
            article: 'https://www.spacex.com/launches'
          }
        },
        {
          id: 'psyche',
          name: 'Psyche Mission',
          date_unix: Math.floor(Date.now() / 1000) - 86400 * 30,
          upcoming: false,
          success: true,
          rocket: 'falconheavy',
          launchpad: 'ksc_lc_39a',
          details: 'NASA mission to study metal-rich asteroid.',
          links: {
            patch: { small: 'https://images2.imgbox.com/33/2e/k6VE4iYl_o.png' },
            wikipedia: 'https://en.wikipedia.org/wiki/Psyche_(spacecraft)'
          }
        },
        {
          id: 'crew-9',
          name: 'Crew-9',
          date_unix: Math.floor(Date.now() / 1000) - 86400 * 45,
          upcoming: false,
          success: true,
          rocket: 'falcon9',
          launchpad: 'ksc_lc_39a',
          details: 'Crew rotation mission to the ISS.',
          links: {
            patch: { small: 'https://images2.imgbox.com/33/2e/k6VE4iYl_o.png' }
          }
        }
      ];
      
      const staticRockets = {
        'falcon9': { 
          id: 'falcon9', 
          name: 'Falcon 9', 
          type: 'Orbital',
          success_rate_pct: 99.5
        },
        'falconheavy': { 
          id: 'falconheavy', 
          name: 'Falcon Heavy', 
          type: 'Heavy Lift',
          success_rate_pct: 100
        }
      };
      
      const staticLaunchPads = {
        'ksc_lc_39a': { 
          id: 'ksc_lc_39a', 
          full_name: 'Kennedy Space Center LC-39A',
          region: 'Florida'
        },
        'ccafs_slc_40': { 
          id: 'ccafs_slc_40', 
          full_name: 'Cape Canaveral SLC-40',
          region: 'Florida'
        },
        'vafb_slc_4e': {
          id: 'vafb_slc_4e',
          full_name: 'Vandenberg SLC-4E',
          region: 'California'
        }
      };
      
      setLaunches(staticLaunches);
      setRockets(staticRockets);
      setLaunchPads(staticLaunchPads);
      setTimeout(() => setLoading(false), 1500);
    };

    loadStaticData();
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
      minute: '2-digit'
    });
  };

  const getStatusIcon = (success, upcoming) => {
    if (upcoming) return <Clock className="w-5 h-5 text-cyan-400" />;
    if (success === null) return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    return success ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />;
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-cyan-50 to-teal-50">
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
          {filteredLaunches.map(launch => {
            const rocket = rockets[launch.rocket];
            const launchpad = launchPads[launch.launchpad];
            
            return (
              <div
                key={launch.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-105 border-2 border-teal-100"
              >
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
                  </div>
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
                Just like sea turtles navigate ocean currents, SpaceX rockets navigate through Earth's atmosphere at speeds over 17,000 mph!
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Shell className="w-8 h-8 mb-2 text-cyan-200" />
              <p className="text-sm leading-relaxed">
                Sea turtles can hold their breath for hours. SpaceX Dragon capsules support astronauts for up to 10 days in space!
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Fish className="w-8 h-8 mb-2 text-cyan-200" />
              <p className="text-sm leading-relaxed">
                Sea turtles return to their birthplace to nest. SpaceX rockets return to Earth and land themselves for reuse!
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