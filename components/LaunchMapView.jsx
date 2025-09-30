import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Rocket, MapPin, CheckCircle, Clock, TrendingUp, Globe } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

/**
 * Launch Map View Component
 * Displays an interactive world map showing launch site locations
 * with statistics and filtering capabilities
 */

const LaunchMapView = ({ launches, onSiteFilter, yearFilter, view }) => {
  const [selectedSite, setSelectedSite] = useState(null);

  // Aggregate launches by location
  const siteData = useMemo(() => {
    const sites = {};

    launches.forEach(launch => {
      if (!launch.pad || !launch.pad.latitude || !launch.pad.longitude) return;

      const siteKey = launch.pad.location?.name || launch.pad.name || 'Unknown';
      const lat = launch.pad.latitude;
      const lng = launch.pad.longitude;

      if (!sites[siteKey]) {
        sites[siteKey] = {
          name: siteKey,
          padName: launch.pad.name,
          lat,
          lng,
          total: 0,
          upcoming: 0,
          past: 0,
          successful: 0,
          companies: {},
          launches: []
        };
      }

      sites[siteKey].total++;
      sites[siteKey].launches.push(launch);

      // Track upcoming vs past
      const isUpcoming = launch.status?.id === 1 || new Date(launch.net) > new Date();
      if (isUpcoming) {
        sites[siteKey].upcoming++;
      } else {
        sites[siteKey].past++;
        if (launch.status?.id === 3) {
          sites[siteKey].successful++;
        }
      }

      // Track companies
      const company = launch.launch_service_provider?.name || 'Unknown';
      sites[siteKey].companies[company] = (sites[siteKey].companies[company] || 0) + 1;
    });

    return Object.values(sites);
  }, [launches]);

  // Calculate global stats
  const globalStats = useMemo(() => {
    const countries = {};

    siteData.forEach(site => {
      // Extract country from site name (simplified)
      const siteName = site.name.toLowerCase();
      let country = 'Other';

      if (siteName.includes('usa') || siteName.includes('florida') || siteName.includes('california') || siteName.includes('texas')) {
        country = '🇺🇸 USA';
      } else if (siteName.includes('china')) {
        country = '🇨🇳 China';
      } else if (siteName.includes('russia') || siteName.includes('baikonur')) {
        country = '🇷🇺 Russia';
      } else if (siteName.includes('new zealand')) {
        country = '🇳🇿 New Zealand';
      } else if (siteName.includes('india')) {
        country = '🇮🇳 India';
      } else if (siteName.includes('japan')) {
        country = '🇯🇵 Japan';
      } else if (siteName.includes('french') || siteName.includes('guiana')) {
        country = '🇫🇷 French Guiana';
      }

      countries[country] = (countries[country] || 0) + site.total;
    });

    return {
      totalSites: siteData.length,
      totalLaunches: siteData.reduce((sum, site) => sum + site.total, 0),
      topSites: siteData
        .sort((a, b) => b.total - a.total)
        .slice(0, 5),
      countries: Object.entries(countries)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
    };
  }, [siteData]);

  // Determine marker size and color based on launch count
  const getMarkerStyle = (site) => {
    const count = site.total;
    let radius, color, fillOpacity;

    if (count >= 20) {
      radius = 25;
      color = '#ef4444'; // red
      fillOpacity = 0.7;
    } else if (count >= 10) {
      radius = 18;
      color = '#f97316'; // orange
      fillOpacity = 0.65;
    } else if (count >= 5) {
      radius = 12;
      color = '#FDB913'; // yellow
      fillOpacity = 0.6;
    } else {
      radius = 8;
      color = '#6BA539'; // green
      fillOpacity = 0.55;
    }

    // Add pulse for sites with upcoming launches
    const className = site.upcoming > 0 ? 'pulse-marker' : '';

    return { radius, color, fillOpacity, className };
  };

  return (
    <div className="relative h-[calc(100vh-280px)] min-h-[500px] md:min-h-[600px] flex flex-col lg:flex-row gap-4">
      {/* Mobile Stats Toggle Button */}
      <button
        onClick={() => setSelectedSite(selectedSite ? null : globalStats.topSites[0])}
        className="lg:hidden bg-[#F7941D] text-[#003366] font-black py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-[#FDB913] transition-colors"
      >
        <Globe className="w-5 h-5" />
        {selectedSite ? 'Hide Stats' : 'Show Global Stats'}
      </button>

      {/* Stats Sidebar */}
      <div className="hidden lg:block w-80 bg-gradient-to-br from-white/20 to-[#2B8C74]/40 backdrop-blur-md rounded-2xl p-6 overflow-y-auto shadow-2xl border-2 border-[#6BA539]/30">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
              <Globe className="w-6 h-6 text-[#FDB913]" />
              Global Stats
            </h3>

            <div className="space-y-3">
              <div className="bg-[#003366]/40 p-4 rounded-xl">
                <div className="text-3xl font-black text-[#FDB913]">{globalStats.totalSites}</div>
                <div className="text-sm text-white font-semibold">Launch Sites</div>
              </div>

              <div className="bg-[#003366]/40 p-4 rounded-xl">
                <div className="text-3xl font-black text-[#6BA539]">{globalStats.totalLaunches}</div>
                <div className="text-sm text-white font-semibold">Total Launches</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-black text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#F7941D]" />
              Busiest Sites
            </h4>
            <div className="space-y-2">
              {globalStats.topSites.map((site, index) => (
                <div
                  key={site.name}
                  className="bg-[#003366]/40 p-3 rounded-lg hover:bg-[#003366]/60 transition-colors cursor-pointer"
                  onClick={() => setSelectedSite(site)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[#FDB913] font-black text-lg">{index + 1}.</span>
                      <span className="text-white text-sm font-semibold truncate">{site.name}</span>
                    </div>
                    <span className="text-[#6BA539] font-black">{site.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-black text-white mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#F7941D]" />
              By Country
            </h4>
            <div className="space-y-2">
              {globalStats.countries.map(([country, count]) => (
                <div key={country} className="bg-[#003366]/40 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-semibold">{country}</span>
                    <span className="text-[#FDB913] font-black">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 bg-gradient-to-br from-white/20 to-[#2B8C74]/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border-2 border-[#6BA539]/30">
        <MapContainer
          center={[28.5, -10]}
          zoom={2}
          minZoom={2}
          maxZoom={12}
          className="h-full w-full z-0"
          style={{ background: '#2B8C74' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Render launch site markers */}
          {siteData.map((site) => {
            const style = getMarkerStyle(site);

            return (
              <CircleMarker
                key={site.name}
                center={[site.lat, site.lng]}
                radius={style.radius}
                pathOptions={{
                  color: '#fff',
                  weight: 3,
                  fillColor: style.color,
                  fillOpacity: style.fillOpacity
                }}
                eventHandlers={{
                  click: () => setSelectedSite(site)
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2 min-w-[250px]">
                    <h3 className="font-black text-lg text-[#003366] mb-2 flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-[#F7941D]" />
                      {site.name}
                    </h3>
                    <div className="text-sm text-gray-600 mb-3 font-semibold">
                      📍 {site.padName}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-[#F7941D]/20 p-2 rounded text-center">
                        <div className="font-black text-[#003366] text-xl">{site.total}</div>
                        <div className="text-xs text-gray-600 font-semibold">Total</div>
                      </div>
                      <div className="bg-[#FDB913]/20 p-2 rounded text-center">
                        <div className="font-black text-[#003366] text-xl">{site.upcoming}</div>
                        <div className="text-xs text-gray-600 font-semibold">Upcoming</div>
                      </div>
                      <div className="bg-[#6BA539]/20 p-2 rounded text-center">
                        <div className="font-black text-[#003366] text-xl">{site.past}</div>
                        <div className="text-xs text-gray-600 font-semibold">Past</div>
                      </div>
                    </div>

                    {site.past > 0 && (
                      <div className="mb-3 text-center">
                        <div className="text-sm text-gray-600 font-semibold">
                          Success Rate: <span className="text-[#6BA539] font-black">
                            {Math.round((site.successful / site.past) * 100)}%
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mb-3">
                      <div className="text-xs text-gray-600 font-bold mb-1">Top Companies:</div>
                      <div className="space-y-1">
                        {Object.entries(site.companies)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 3)
                          .map(([company, count]) => (
                            <div key={company} className="text-xs flex justify-between">
                              <span className="text-gray-700 font-semibold">{company}</span>
                              <span className="text-[#F7941D] font-black">({count})</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (onSiteFilter) {
                          onSiteFilter(site.name);
                        }
                      }}
                      className="w-full bg-gradient-to-r from-[#F7941D] to-[#FDB913] text-[#003366] font-black py-2 px-4 rounded-lg hover:shadow-lg transition-all text-sm"
                    >
                      View Launches from Here
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Add pulse animation for upcoming launches */}
      <style jsx global>{`
        @keyframes pulse-marker {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .pulse-marker {
          animation: pulse-marker 2s ease-in-out infinite;
        }

        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
        }

        .leaflet-popup-content {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default LaunchMapView;