import React, { useState, useEffect, useMemo } from 'react';
import {
  Rocket, Calendar, Clock, MapPin, Globe, Filter, Search, Grid3x3, List,
  ChevronDown, X, CheckCircle, XCircle, AlertCircle, Loader, ExternalLink,
  BarChart2, Shell, TrendingUp, Eye, EyeOff, Table, Download
} from 'lucide-react';

/**
 * Sea Turtle Space Tracker Pro - PVPV/Rawlings Elementary School
 * Enhanced professional version with comprehensive filtering
 * "Surfing to Success" - From the Ocean to the Stars! 🐢🚀
 */

const SeaTurtleSpaceTrackerPro = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState({});

  // Filter states
  const [view, setView] = useState('upcoming'); // upcoming/past
  const [yearFilter, setYearFilter] = useState('all');
  const [rocketFilter, setRocketFilter] = useState('all');
  const [missionTypeFilter, setMissionTypeFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // UI states
  const [displayMode, setDisplayMode] = useState('cards'); // cards/table/compact
  const [showStats, setShowStats] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

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
        console.error('❌ Error fetching launch data:', err);
        setError('Unable to fetch launch data. Please try again later.');
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

  // Extract unique filter values
  const filterOptions = useMemo(() => {
    const rockets = [...new Set(launches.map(l => l.rocket?.configuration?.name).filter(Boolean))].sort();
    const programs = [...new Set(launches.map(l => l.program?.[0]?.name).filter(Boolean))].sort();

    // Extract mission types from mission field
    const missionTypes = [...new Set(launches.map(l => {
      const mission = l.mission;
      if (mission?.type) return mission.type;
      // Parse from mission name
      const name = l.name?.toLowerCase() || '';
      if (name.includes('starlink')) return 'Starlink';
      if (name.includes('crew')) return 'Crew Mission';
      if (name.includes('crs') || name.includes('cargo')) return 'Cargo/ISS';
      if (name.includes('transporter')) return 'Rideshare';
      return 'Satellite Deployment';
    }).filter(Boolean))].sort();

    const years = [...new Set(launches.map(l => new Date(l.net).getFullYear()))].sort();

    return { rockets, programs, missionTypes, years };
  }, [launches]);

  // Filter launches
  const filteredLaunches = useMemo(() => {
    return launches.filter(launch => {
      const launchDate = new Date(launch.net);
      const launchYear = launchDate.getFullYear();

      // View filter (upcoming/past)
      const isUpcomingLaunch = isUpcoming(launch);
      if (view === 'upcoming' && !isUpcomingLaunch) return false;
      if (view === 'past' && isUpcomingLaunch) return false;

      // Year filter
      if (yearFilter !== 'all' && launchYear !== parseInt(yearFilter)) return false;

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
  }, [launches, view, yearFilter, rocketFilter, programFilter, missionTypeFilter, searchQuery]);

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
    setRocketFilter('all');
    setProgramFilter('all');
    setMissionTypeFilter('all');
    setSearchQuery('');
  };

  const activeFilterCount = [
    yearFilter !== 'all',
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
      launch.pad?.name || 'Unknown',
      launch.status?.name || 'Unknown'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spacex-launches-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-xl text-white font-semibold">Loading SpaceX mission data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Compact Professional Header */}
      <header className="bg-slate-900/90 backdrop-blur-sm border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/images/NEW-LOGO.png"
                alt="Sea Turtle Space Tracker"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <Shell className="w-12 h-12 text-blue-400 hidden" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                  Sea Turtle Space Tracker
                  <span className="text-xs text-blue-400 font-normal hidden md:inline">Pro</span>
                </h1>
                <p className="text-xs text-blue-400">PVPV/Rawlings Elementary</p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDisplayMode('cards')}
                className={`p-2 rounded ${displayMode === 'cards' ? 'bg-blue-600 text-white' : 'text-blue-400 hover:bg-slate-800'}`}
                title="Card View"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDisplayMode('table')}
                className={`p-2 rounded ${displayMode === 'table' ? 'bg-blue-600 text-white' : 'text-blue-400 hover:bg-slate-800'}`}
                title="Table View"
              >
                <Table className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDisplayMode('compact')}
                className={`p-2 rounded ${displayMode === 'compact' ? 'bg-blue-600 text-white' : 'text-blue-400 hover:bg-slate-800'}`}
                title="Compact View"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Inline Stats Ticker */}
          {showStats && (
            <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">Total: <span className="text-white font-semibold">{stats.total}</span></span>
              <span className="text-slate-400">•</span>
              <span className="text-green-400">Success: <span className="font-semibold">{stats.successful}</span></span>
              <span className="text-slate-400">•</span>
              <span className="text-yellow-400">Upcoming: <span className="font-semibold">{stats.upcoming}</span></span>
              <span className="text-slate-400">•</span>
              <span className="text-blue-400">Rockets: <span className="font-semibold">{stats.rockets}</span></span>
              {stats.filtered !== stats.total && (
                <>
                  <span className="text-slate-400">•</span>
                  <span className="text-orange-400">Filtered: <span className="font-semibold">{stats.filtered}</span></span>
                </>
              )}
              <button
                onClick={() => setShowStats(!showStats)}
                className="ml-auto text-slate-400 hover:text-white"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/20 border-l-4 border-red-500 p-3 mx-4 mt-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <p className="text-white text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Unified Filter Bar */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Primary filters row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Upcoming/Past Toggle */}
            <div className="flex bg-slate-900/50 rounded-lg p-1">
              <button
                onClick={() => setView('upcoming')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  view === 'upcoming'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setView('past')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  view === 'past'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Past
              </button>
            </div>

            {/* Year Filter */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-slate-900/50 text-white text-sm px-3 py-2 rounded border border-slate-700 hover:border-blue-500 focus:outline-none focus:border-blue-400"
            >
              <option value="all">All Years</option>
              {filterOptions.years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Rocket Filter */}
            <select
              value={rocketFilter}
              onChange={(e) => setRocketFilter(e.target.value)}
              className="bg-slate-900/50 text-white text-sm px-3 py-2 rounded border border-slate-700 hover:border-blue-500 focus:outline-none focus:border-blue-400"
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
              className="bg-slate-900/50 text-white text-sm px-3 py-2 rounded border border-slate-700 hover:border-blue-500 focus:outline-none focus:border-blue-400"
            >
              <option value="all">All Missions</option>
              {filterOptions.missionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Program Filter */}
            {filterOptions.programs.length > 0 && (
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="bg-slate-900/50 text-white text-sm px-3 py-2 rounded border border-slate-700 hover:border-blue-500 focus:outline-none focus:border-blue-400"
              >
                <option value="all">All Programs</option>
                {filterOptions.programs.map(program => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
            )}

            {/* Search Input */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search missions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 text-white text-sm pl-10 pr-3 py-2 rounded border border-slate-700 hover:border-blue-500 focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Action buttons */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear ({activeFilterCount})
              </button>
            )}

            <button
              onClick={exportToCSV}
              className="px-3 py-2 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Results count */}
          <div className="mt-2 text-xs text-slate-400">
            Showing {filteredLaunches.length} of {launches.length} launches
            {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active)`}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredLaunches.length > 0 ? (
          <>
            {/* Card View */}
            {displayMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredLaunches.slice(0, 40).map(launch => (
                  <div
                    key={launch.id}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-slate-800/70 transition-all border border-slate-700 hover:border-blue-500/50"
                  >
                    {launch.image && (
                      <div className="h-32 bg-slate-900 relative">
                        <img
                          src={launch.image}
                          alt={launch.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
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

                      <div className="space-y-1 text-xs">
                        <div className="flex items-center text-slate-400">
                          <Rocket className="w-3 h-3 mr-1" />
                          <span className="truncate">{launch.rocket?.configuration?.name || 'Unknown'}</span>
                        </div>

                        <div className="flex items-center text-slate-400">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{formatDate(launch.net)}</span>
                        </div>

                        {launch.pad && (
                          <div className="flex items-center text-slate-400">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="truncate">{launch.pad.name}</span>
                          </div>
                        )}

                        {isUpcoming(launch) && countdown[launch.id] && (
                          <div className="mt-2 p-2 bg-blue-900/30 rounded text-center">
                            <div className="text-blue-400 font-mono text-xs">
                              {countdown[launch.id].formatted}
                            </div>
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
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800/50 text-slate-300 border-b border-slate-700">
                    <tr>
                      <th className="text-left p-3">Mission</th>
                      <th className="text-left p-3">Date/Time</th>
                      <th className="text-left p-3">Rocket</th>
                      <th className="text-left p-3">Location</th>
                      <th className="text-left p-3">Status</th>
                      {view === 'upcoming' && <th className="text-left p-3">Countdown</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredLaunches.slice(0, 50).map(launch => (
                      <tr key={launch.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 text-white font-medium">{launch.name}</td>
                        <td className="p-3 text-slate-300">{formatDate(launch.net)}</td>
                        <td className="p-3 text-slate-300">{launch.rocket?.configuration?.name || 'Unknown'}</td>
                        <td className="p-3 text-slate-300 max-w-xs truncate">{launch.pad?.name || 'Unknown'}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                            isUpcoming(launch) ? 'bg-yellow-900/30 text-yellow-400' :
                            launch.status?.id === 3 ? 'bg-green-900/30 text-green-400' :
                            'bg-red-900/30 text-red-400'
                          }`}>
                            {launch.status?.abbrev || 'TBD'}
                          </span>
                        </td>
                        {view === 'upcoming' && (
                          <td className="p-3 text-blue-400 font-mono text-xs">
                            {countdown[launch.id]?.formatted || '-'}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Compact List View */}
            {displayMode === 'compact' && (
              <div className="space-y-2">
                {filteredLaunches.slice(0, 50).map(launch => (
                  <div
                    key={launch.id}
                    className="flex items-center justify-between p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center">
                        {isUpcoming(launch) ? (
                          <Clock className="w-4 h-4 text-yellow-400" />
                        ) : launch.status?.id === 3 ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{launch.name}</div>
                        <div className="text-slate-400 text-xs">
                          {launch.rocket?.configuration?.name} • {formatDateCompact(launch.net)}
                        </div>
                      </div>
                    </div>
                    {isUpcoming(launch) && countdown[launch.id] && (
                      <div className="text-blue-400 font-mono text-xs">
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
            <Shell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-300 text-lg">No launches found matching your filters.</p>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeaTurtleSpaceTrackerPro;