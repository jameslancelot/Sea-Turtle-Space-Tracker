import React, { useState, useEffect, useMemo } from 'react';
import {
  Rocket, Calendar, Clock, MapPin, Globe, Filter, Search, Grid3x3, List,
  ChevronDown, X, CheckCircle, XCircle, AlertCircle, Loader, ExternalLink,
  BarChart2, Shell, TrendingUp, Eye, EyeOff, Table, Download, Waves, Star,
  Palmtree, Fish, Anchor, Zap, Printer, Map
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import LaunchMapView to avoid SSR issues with Leaflet
const LaunchMapView = dynamic(() => import('./LaunchMapView'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px]">
      <Loader className="w-12 h-12 animate-spin text-yellow-400" />
    </div>
  )
});

/**
 * Sea Turtle Space Tracker Enhanced - PVPV/Rawlings Elementary School
 * Professional version with Sea Turtle theming maintained
 * "Surfing to Success" - From the Ocean to the Stars! 🐢🚀
 */

const SeaTurtleSpaceTrackerEnhanced = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState({});

  // Filter states
  const [view, setView] = useState('upcoming');
  const [yearFilter, setYearFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [rocketFilter, setRocketFilter] = useState('all');
  const [missionTypeFilter, setMissionTypeFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [siteFilter, setSiteFilter] = useState(null); // New: filter by launch site

  // UI states
  const [displayMode, setDisplayMode] = useState('cards');
  const [showStats, setShowStats] = useState(true);
  const [showEducationalSection, setShowEducationalSection] = useState(false);

  // Fetch launch data with caching
  useEffect(() => {
    const CACHE_KEY = 'space-turtle-launches-cache-v2';
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    const fetchData = async (bypassCache = false) => {
      try {
        // Try to load from cache first
        if (!bypassCache && typeof window !== 'undefined') {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            const age = Date.now() - timestamp;

            if (age < CACHE_DURATION) {
              console.log('📦 Loading launches from cache (age:', Math.round(age / 1000 / 60), 'minutes)');
              setLaunches(data);
              setLoading(false);
              return;
            } else {
              console.log('🗑️ Cache expired, fetching fresh data');
            }
          }
        }

        setLoading(true);
        setError(null);

        const response = await fetch('/api/spacex?resource=launches');
        if (!response.ok) throw new Error(`API returned status ${response.status}`);

        const data = await response.json();
        const launchesData = data.results || data;
        setLaunches(launchesData);

        // Save to cache
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
              data: launchesData,
              timestamp: Date.now()
            }));
            console.log('💾 Saved', launchesData.length, 'launches to cache');
          } catch (cacheError) {
            console.warn('Cache storage failed:', cacheError);
          }
        }

        setLoading(false);

      } catch (err) {
        console.error('❌ Error fetching launch data:', err);
        setError('Unable to fetch launch data. Our Space Turtle is swimming back to try again! 🐢');
        setLoading(false);
      }
    };

    // Initial load (try cache)
    fetchData(false);

    // Periodic refresh (bypass cache)
    const interval = setInterval(() => fetchData(true), 300000); // 5 minutes

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
    return launch.status?.id === 1 || new Date(launch.net) > new Date();
  };

  const formatDate = (netDate) => {
    const date = new Date(netDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateCompact = (netDate) => {
    const date = new Date(netDate);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatLocation = (launch) => {
    if (!launch.pad) return 'Unknown';

    // Get pad name and location
    const padName = launch.pad.name || '';
    const locationName = launch.pad.location?.name || '';

    // Extract state/region from location name (e.g., "Cape Canaveral SFS, FL, USA" -> "FL")
    // or "Wallops Flight Facility, Virginia, USA" -> "Virginia"
    let stateInfo = '';
    if (locationName) {
      const parts = locationName.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        stateInfo = parts[1]; // Get the state/region part
      }
    }

    // Return pad name with state
    if (stateInfo) {
      return `${padName}, ${stateInfo}`;
    }
    return padName || 'Unknown';
  };

  // Extract unique filter values
  const filterOptions = useMemo(() => {
    const rockets = [...new Set(launches.map(l => l.rocket?.configuration?.name).filter(Boolean))].sort();
    const programs = [...new Set(launches.map(l => l.program?.[0]?.name).filter(Boolean))].sort();

    const missionTypes = [...new Set(launches.map(l => {
      const mission = l.mission;
      if (mission?.type) return mission.type;
      const name = l.name?.toLowerCase() || '';
      if (name.includes('starlink')) return 'Starlink';
      if (name.includes('crew')) return 'Crew Mission';
      if (name.includes('crs') || name.includes('cargo')) return 'Cargo/ISS';
      if (name.includes('transporter')) return 'Rideshare';
      return 'Satellite Deployment';
    }).filter(Boolean))].sort();

    const years = [...new Set(launches.map(l => new Date(l.net).getFullYear()))].sort();

    // Extract unique year-month combinations for month filter
    const months = [...new Set(launches.map(l => {
      const date = new Date(l.net);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }))].sort();

    return { rockets, programs, missionTypes, years, months };
  }, [launches]);

  // Filter launches
  const filteredLaunches = useMemo(() => {
    return launches.filter(launch => {
      const launchDate = new Date(launch.net);
      const launchYear = launchDate.getFullYear();
      const launchMonth = `${launchYear}-${String(launchDate.getMonth() + 1).padStart(2, '0')}`;

      // View filter
      const isUpcomingLaunch = isUpcoming(launch);
      if (view === 'upcoming' && !isUpcomingLaunch) return false;
      if (view === 'past' && isUpcomingLaunch) return false;

      // Year filter
      if (yearFilter !== 'all' && launchYear !== parseInt(yearFilter)) return false;

      // Month filter
      if (monthFilter !== 'all' && launchMonth !== monthFilter) return false;

      // Rocket filter
      if (rocketFilter !== 'all' && launch.rocket?.configuration?.name !== rocketFilter) return false;

      // Program filter
      if (programFilter !== 'all' && launch.program?.[0]?.name !== programFilter) return false;

      // Mission type filter
      if (missionTypeFilter !== 'all') {
        const name = launch.name?.toLowerCase() || '';
        const missionType = launch.mission?.type ||
          (name.includes('starlink') ? 'Starlink' :
           name.includes('crew') ? 'Crew Mission' :
           name.includes('crs') || name.includes('cargo') ? 'Cargo/ISS' :
           name.includes('transporter') ? 'Rideshare' : 'Satellite Deployment');
        if (missionType !== missionTypeFilter) return false;
      }

      // Site filter
      if (siteFilter) {
        const siteName = launch.pad?.location?.name || launch.pad?.name || '';
        if (!siteName.includes(siteFilter)) return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return launch.name?.toLowerCase().includes(query) ||
               launch.rocket?.configuration?.name?.toLowerCase().includes(query) ||
               launch.pad?.name?.toLowerCase().includes(query);
      }

      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.net);
      const dateB = new Date(b.net);
      return view === 'upcoming' ? dateA - dateB : dateB - dateA;
    });
  }, [launches, view, yearFilter, monthFilter, rocketFilter, programFilter, missionTypeFilter, searchQuery, siteFilter]);

  // Stats calculation
  const stats = useMemo(() => ({
    total: launches.length,
    successful: launches.filter(l => l.status?.id === 3).length,
    upcoming: launches.filter(l => isUpcoming(l)).length,
    rockets: filterOptions.rockets.length,
    filtered: filteredLaunches.length
  }), [launches, filteredLaunches, filterOptions]);

  const clearAllFilters = () => {
    setYearFilter('all');
    setMonthFilter('all');
    setRocketFilter('all');
    setProgramFilter('all');
    setMissionTypeFilter('all');
    setSearchQuery('');
  };

  const activeFilterCount = [
    yearFilter !== 'all',
    monthFilter !== 'all',
    rocketFilter !== 'all',
    programFilter !== 'all',
    missionTypeFilter !== 'all',
    searchQuery !== ''
  ].filter(Boolean).length;

  const exportToCSV = () => {
    const headers = ['Mission', 'Date', 'Rocket', 'Location', 'Status'];
    const rows = filteredLaunches.map(launch => [
      launch.name,
      formatDate(launch.net),
      launch.rocket?.configuration?.name || 'Unknown',
      formatLocation(launch),
      launch.status?.name || 'Unknown'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sea-turtle-launches-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600">
        <div className="text-center">
          <img
            src="/images/NEW-LOGO.png"
            alt="Loading..."
            className="w-24 h-24 mx-auto mb-4 animate-pulse"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <Shell className="w-24 h-24 text-white mx-auto mb-4 animate-pulse hidden" />
          <p className="text-xl text-white font-bold">Space Turtle preparing for launch...</p>
          <p className="text-sm text-yellow-300 mt-2">Loading SpaceX mission data 🐢🚀</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 via-cyan-700 to-blue-700 relative">
      {/* Print-only Header */}
      <div className="print-header hidden">
        <img src="/images/NEW-LOGO.png" alt="Sea Turtle Logo" />
        <h1>Sea Turtle Space Tracker</h1>
        <div className="subtitle">PVPV/Rawlings Elementary School - "Surfing to Success!"</div>
        <div className="date">Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <div className="date">Showing {filteredLaunches.length} launches</div>
      </div>

      {/* Subtle background decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-5 no-print">
        <Waves className="absolute top-10 left-10 w-32 h-32" />
        <Palmtree className="absolute bottom-10 right-10 w-40 h-40" />
        <Shell className="absolute top-1/2 right-1/4 w-20 h-20" />
      </div>

      {/* Compact Professional Header with Sea Turtle Theme */}
      <header className="bg-gradient-to-r from-teal-800/90 to-blue-800/90 backdrop-blur-sm border-b-2 border-yellow-400/30 relative z-10 no-print">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/images/NEW-LOGO.png"
                alt="Sea Turtle Space Tracker"
                className="w-14 h-14 object-contain hover:scale-110 transition-transform"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <Shell className="w-14 h-14 text-yellow-400 hidden" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                  Sea Turtle Space Tracker
                  <Rocket className="w-5 h-5 text-yellow-400" />
                </h1>
                <p className="text-xs text-yellow-300">PVPV/Rawlings Elementary - Surfing to Success! 🐢</p>
              </div>
            </div>

            {/* View Mode & Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDisplayMode('cards')}
                className={`p-2 rounded transition-all ${
                  displayMode === 'cards'
                    ? 'bg-yellow-400 text-teal-900'
                    : 'text-yellow-300 hover:bg-teal-700/50'
                }`}
                title="Card View"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDisplayMode('table')}
                className={`p-2 rounded transition-all ${
                  displayMode === 'table'
                    ? 'bg-yellow-400 text-teal-900'
                    : 'text-yellow-300 hover:bg-teal-700/50'
                }`}
                title="Table View"
              >
                <Table className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDisplayMode('compact')}
                className={`p-2 rounded transition-all ${
                  displayMode === 'compact'
                    ? 'bg-yellow-400 text-teal-900'
                    : 'text-yellow-300 hover:bg-teal-700/50'
                }`}
                title="List View"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setDisplayMode('map');
                  setSiteFilter(null);
                }}
                className={`p-2 rounded transition-all ${
                  displayMode === 'map'
                    ? 'bg-yellow-400 text-teal-900'
                    : 'text-yellow-300 hover:bg-teal-700/50'
                }`}
                title="Map View"
              >
                <Map className="w-5 h-5" />
              </button>
              <div className="w-px h-8 bg-yellow-400/30 mx-2" />
              <button
                onClick={exportToCSV}
                className="p-2 text-yellow-300 hover:bg-teal-700/50 rounded transition-all"
                title="Export to CSV"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 text-yellow-300 hover:bg-teal-700/50 rounded transition-all"
                title="Print View"
              >
                <Printer className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Inline Stats Bar */}
          {showStats && (
            <div className="flex items-center gap-3 md:gap-6 mt-3 pt-3 border-t border-teal-700/50 text-xs md:text-sm">
              <div className="text-white/80">
                Total: <span className="font-bold text-white">{stats.total}</span>
              </div>
              <div className="text-green-300">
                Success: <span className="font-bold">{stats.successful}</span>
              </div>
              <div className="text-yellow-300">
                Upcoming: <span className="font-bold">{stats.upcoming}</span>
              </div>
              <div className="text-cyan-300">
                Rockets: <span className="font-bold">{stats.rockets}</span>
              </div>
              {stats.filtered !== stats.total && (
                <div className="text-orange-300">
                  Showing: <span className="font-bold">{stats.filtered}</span>
                </div>
              )}
              <button
                onClick={() => setShowStats(!showStats)}
                className="ml-auto text-white/60 hover:text-white"
                title="Toggle Stats"
              >
                {showStats ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/20 border-l-4 border-red-500 p-3 mx-4 mt-4 rounded backdrop-blur-sm no-print">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-300 mr-2" />
            <p className="text-white text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Unified Filter Bar */}
      <div className="bg-teal-800/50 backdrop-blur-sm border-b border-teal-600/30 sticky top-0 z-30 no-print">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {/* Upcoming/Past Toggle */}
            <div className="flex bg-teal-900/50 rounded-lg p-1">
              <button
                onClick={() => setView('upcoming')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  view === 'upcoming'
                    ? 'bg-yellow-400 text-teal-900'
                    : 'text-white hover:text-yellow-300'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setView('past')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  view === 'past'
                    ? 'bg-yellow-400 text-teal-900'
                    : 'text-white hover:text-yellow-300'
                }`}
              >
                Past
              </button>
            </div>

            {/* Year Filter */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-teal-900/50 text-white text-sm px-3 py-2 rounded border border-teal-600 hover:border-yellow-400/50 focus:outline-none focus:border-yellow-400 transition-colors"
            >
              <option value="all">All Years</option>
              {filterOptions.years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Month Filter */}
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="bg-teal-900/50 text-white text-sm px-3 py-2 rounded border border-teal-600 hover:border-yellow-400/50 focus:outline-none focus:border-yellow-400 transition-colors"
            >
              <option value="all">All Months</option>
              {filterOptions.months.map(month => {
                const [year, monthNum] = month.split('-');
                const monthName = new Date(year, parseInt(monthNum) - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                return (
                  <option key={month} value={month}>{monthName}</option>
                );
              })}
            </select>

            {/* Rocket Filter */}
            <select
              value={rocketFilter}
              onChange={(e) => setRocketFilter(e.target.value)}
              className="bg-teal-900/50 text-white text-sm px-3 py-2 rounded border border-teal-600 hover:border-yellow-400/50 focus:outline-none focus:border-yellow-400 transition-colors"
            >
              <option value="all">All Rockets</option>
              {filterOptions.rockets.map(rocket => (
                <option key={rocket} value={rocket}>{rocket}</option>
              ))}
            </select>

            {/* Mission Type Filter */}
            <select
              value={missionTypeFilter}
              onChange={(e) => setMissionTypeFilter(e.target.value)}
              className="bg-teal-900/50 text-white text-sm px-3 py-2 rounded border border-teal-600 hover:border-yellow-400/50 focus:outline-none focus:border-yellow-400 transition-colors"
            >
              <option value="all">All Missions</option>
              {filterOptions.missionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Program Filter (if available) */}
            {filterOptions.programs.length > 0 && (
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="bg-teal-900/50 text-white text-sm px-3 py-2 rounded border border-teal-600 hover:border-yellow-400/50 focus:outline-none focus:border-yellow-400 transition-colors"
              >
                <option value="all">All Programs</option>
                {filterOptions.programs.map(program => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
            )}

            {/* Search */}
            <div className="flex-1 min-w-[180px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Search missions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-teal-900/50 text-white text-sm pl-10 pr-3 py-2 rounded border border-teal-600 hover:border-yellow-400/50 focus:outline-none focus:border-yellow-400 placeholder-white/40 transition-colors"
              />
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-900/20 rounded flex items-center gap-1 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear ({activeFilterCount})
              </button>
            )}
          </div>

          {/* Results count */}
          <div className="mt-2 text-xs text-yellow-300/80">
            Showing {filteredLaunches.length} of {launches.length} launches
            {activeFilterCount > 0 && ` • ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active`}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        {filteredLaunches.length > 0 ? (
          <>
            {/* Print-only Table View */}
            <table className="print-table hidden">
              <thead>
                <tr>
                  <th>Mission Name</th>
                  <th>Date & Time</th>
                  <th>Rocket</th>
                  <th>Launch Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLaunches.map(launch => (
                  <tr key={launch.id}>
                    <td>{launch.name}</td>
                    <td>{formatDate(launch.net)}</td>
                    <td>{launch.rocket?.configuration?.name || 'Unknown'}</td>
                    <td>{formatLocation(launch)}</td>
                    <td>
                      <span className={`print-status ${
                        isUpcoming(launch) ? 'upcoming' :
                        launch.status?.id === 3 ? 'success' : 'failed'
                      }`}>
                        {launch.status?.abbrev || 'TBD'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Map View */}
            {displayMode === 'map' && (
              <div className="no-print">
                <LaunchMapView
                  launches={filteredLaunches}
                  onSiteFilter={(siteName) => {
                    setSiteFilter(siteName);
                    setDisplayMode('cards'); // Switch to cards view when filtering
                  }}
                  yearFilter={yearFilter}
                  view={view}
                />
              </div>
            )}

            {/* Card View */}
            {displayMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 no-print">
                {filteredLaunches.slice(0, 40).map(launch => (
                  <div
                    key={launch.id}
                    className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-all border border-white/20 hover:border-yellow-400/50 group"
                  >
                    {launch.image && (
                      <div className="h-36 bg-teal-900/50 relative overflow-hidden">
                        <img
                          src={launch.image}
                          alt={launch.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-teal-900/80 backdrop-blur-sm rounded-full p-1.5">
                          {isUpcoming(launch) ? (
                            <Clock className="w-4 h-4 text-yellow-400" />
                          ) : launch.status?.id === 3 ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{launch.name}</h3>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center text-yellow-300/90">
                          <Rocket className="w-3 h-3 mr-1.5" />
                          <span className="truncate">{launch.rocket?.configuration?.name || 'Unknown'}</span>
                        </div>

                        <div className="flex items-center text-cyan-300/90">
                          <Calendar className="w-3 h-3 mr-1.5" />
                          <span>{formatDate(launch.net)}</span>
                        </div>

                        {launch.pad && (
                          <div className="flex items-center text-green-300/90">
                            <MapPin className="w-3 h-3 mr-1.5 flex-shrink-0" />
                            <span className="truncate">{formatLocation(launch)}</span>
                          </div>
                        )}

                        {isUpcoming(launch) && countdown[launch.id] && (
                          <div className="mt-3 p-2 bg-yellow-400/20 rounded text-center border border-yellow-400/30">
                            <div className="text-yellow-300 font-mono text-xs font-semibold">
                              {countdown[launch.id].formatted}
                            </div>
                          </div>
                        )}

                        {!isUpcoming(launch) && (
                          <div className="mt-2">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                              launch.status?.id === 3
                                ? 'bg-green-500/30 text-green-300 border border-green-400/30'
                                : launch.status?.id === 4
                                ? 'bg-red-500/30 text-red-300 border border-red-400/30'
                                : 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/30'
                            }`}>
                              {launch.status?.abbrev || 'TBD'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Table View */}
            {displayMode === 'table' && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden no-print">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-teal-800/50 text-yellow-300 border-b border-teal-600/30">
                      <tr>
                        <th className="text-left p-3 font-semibold">Mission</th>
                        <th className="text-left p-3 font-semibold">Date/Time</th>
                        <th className="text-left p-3 font-semibold">Rocket</th>
                        <th className="text-left p-3 font-semibold">Location</th>
                        <th className="text-left p-3 font-semibold">Status</th>
                        {view === 'upcoming' && <th className="text-left p-3 font-semibold">Countdown</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-teal-700/30">
                      {filteredLaunches.slice(0, 50).map(launch => (
                        <tr key={launch.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 text-white font-medium">{launch.name}</td>
                          <td className="p-3 text-cyan-300">{formatDate(launch.net)}</td>
                          <td className="p-3 text-yellow-300">{launch.rocket?.configuration?.name || 'Unknown'}</td>
                          <td className="p-3 text-green-300 max-w-xs truncate">{formatLocation(launch)}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                              isUpcoming(launch) ? 'bg-yellow-500/30 text-yellow-300' :
                              launch.status?.id === 3 ? 'bg-green-500/30 text-green-300' :
                              'bg-red-500/30 text-red-300'
                            }`}>
                              {launch.status?.abbrev || 'TBD'}
                            </span>
                          </td>
                          {view === 'upcoming' && (
                            <td className="p-3 text-yellow-300 font-mono text-xs">
                              {countdown[launch.id]?.formatted || '-'}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Compact List View */}
            {displayMode === 'compact' && (
              <div className="space-y-2 no-print">
                {filteredLaunches.slice(0, 50).map(launch => (
                  <div
                    key={launch.id}
                    className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-lg transition-colors border border-white/10 hover:border-yellow-400/30"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-teal-800/50 flex items-center justify-center">
                        {isUpcoming(launch) ? (
                          <Clock className="w-5 h-5 text-yellow-400" />
                        ) : launch.status?.id === 3 ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{launch.name}</div>
                        <div className="text-cyan-300 text-xs mt-0.5">
                          {launch.rocket?.configuration?.name} • {formatDateCompact(launch.net)}
                        </div>
                        <div className="text-green-300 text-xs mt-0.5 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {formatLocation(launch)}
                        </div>
                      </div>
                    </div>
                    {isUpcoming(launch) && countdown[launch.id] && (
                      <div className="text-yellow-300 font-mono text-xs font-semibold">
                        {countdown[launch.id].formatted}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <img
              src="/images/NEW-LOGO.png"
              alt="No launches"
              className="w-24 h-24 mx-auto mb-4 opacity-60"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <Shell className="w-24 h-24 text-white/40 mx-auto mb-4 hidden" />
            <p className="text-white text-lg">No launches found matching your filters.</p>
            <p className="text-yellow-300 text-sm mt-2">Our Space Turtle is searching the cosmos! 🐢🔭</p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-yellow-400 text-teal-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Educational Footer Toggle */}
        <div className="mt-8 text-center no-print">
          <button
            onClick={() => setShowEducationalSection(!showEducationalSection)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 rounded-lg transition-colors border border-yellow-400/30"
          >
            <Fish className="w-5 h-5" />
            {showEducationalSection ? 'Hide' : 'Show'} Sea Turtle Space Facts
            <Rocket className="w-5 h-5" />
          </button>
        </div>

        {/* Educational Section (Collapsible) */}
        {showEducationalSection && (
          <div className="mt-6 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-yellow-400/30 no-print">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start">
                <Waves className="w-5 h-5 mr-2 mt-1 text-cyan-300 flex-shrink-0" />
                <p className="text-white/90">
                  Just like our Space Turtle navigates the cosmos, real sea turtles navigate vast oceans using Earth's magnetic field!
                </p>
              </div>
              <div className="flex items-start">
                <Anchor className="w-5 h-5 mr-2 mt-1 text-green-300 flex-shrink-0" />
                <p className="text-white/90">
                  The Falcon 9 rocket can land itself back on Earth, like sea turtles returning to their birth beaches!
                </p>
              </div>
              <div className="flex items-start">
                <Zap className="w-5 h-5 mr-2 mt-1 text-yellow-300 flex-shrink-0" />
                <p className="text-white/90">
                  SpaceX satellites help scientists track and protect sea turtles around the world!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Print Footer */}
      <div className="print-footer hidden">
        Sea Turtle Space Tracker - PVPV/Rawlings Elementary School | Generated {new Date().toLocaleDateString('en-US')} | Page {'{page}'} of {'{pages}'}
      </div>
    </div>
  );
};

export default SeaTurtleSpaceTrackerEnhanced;