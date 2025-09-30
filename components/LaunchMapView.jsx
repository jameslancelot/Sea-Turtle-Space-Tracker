import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Rocket, MapPin, CheckCircle, Clock, TrendingUp, Globe, Printer } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PrintableMapView from './PrintableMapView';
import SwimmingTurtle from './SwimmingTurtle';

// Map controller component to handle flying to locations
const MapController = ({ flyToLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (flyToLocation) {
      map.flyTo(
        [flyToLocation.lat, flyToLocation.lng],
        flyToLocation.zoom || 6,
        {
          duration: 1.5,
          easeLinearity: 0.25
        }
      );

      // Open popup if site specified
      if (flyToLocation.siteName) {
        // Find and open the marker popup
        setTimeout(() => {
          map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
              const popup = layer.getPopup();
              if (popup && popup.getContent && popup.getContent().includes(flyToLocation.siteName)) {
                layer.openPopup();
              }
            }
          });
        }, 1600);
      }
    }
  }, [map, flyToLocation]);

  return null;
};

/**
 * Launch Map View Component
 * Displays an interactive world map showing launch site locations
 * with statistics and filtering capabilities
 */

// Ocean swimming paths for animated turtles
const oceanPaths = {
  atlanticNorth: [
    [35, -70], [32, -60], [30, -50], [28, -40], [30, -30], [33, -35], [35, -45], [37, -55], [35, -70]
  ],
  atlanticSouth: [
    [-5, -30], [-10, -25], [-15, -20], [-20, -15], [-25, -20], [-20, -25], [-15, -28], [-10, -32], [-5, -30]
  ],
  pacificNorth: [
    [25, -160], [20, -150], [15, -140], [10, -135], [5, -140], [10, -150], [15, -158], [20, -165], [25, -160]
  ],
  pacificSouth: [
    [-10, -150], [-15, -145], [-20, -140], [-25, -145], [-30, -150], [-25, -155], [-20, -158], [-15, -155], [-10, -150]
  ],
  indian: [
    [-10, 70], [-12, 80], [-15, 85], [-18, 90], [-20, 85], [-18, 75], [-15, 70], [-12, 65], [-10, 70]
  ]
};

// Fun facts about space and ocean
const turtleFacts = [
  "🐢 Did you know? Sea turtles can hold their breath for up to 7 hours while resting!",
  "🚀 Space and ocean have something in common - both are vast frontiers to explore!",
  "🐢 Real sea turtles navigate using Earth's magnetic field, just like rockets use guidance systems!",
  "🌊 The ocean covers 71% of Earth's surface - imagine viewing it from space!",
  "🛰️ Satellites help scientists track sea turtle migration patterns across the oceans!",
  "🐢 Some sea turtles travel over 10,000 miles each year - that's farther than most rockets!",
  "🌍 Both astronauts and sea turtles need special equipment to survive in their environments!",
  "🚀 Just like rockets launch from Earth, baby sea turtles launch from beaches into the ocean!",
  "🐢 Sea turtles have been around for 110 million years - they're older than rockets by a long shot!",
  "⭐ From space, you can see the trails that sea turtles leave in the ocean!"
];

// Swimming turtle configurations
const swimmingTurtles = [
  {
    id: 1,
    path: oceanPaths.atlanticNorth,
    speed: 2000,
    color: 0, // Original color
    fact: turtleFacts[0]
  },
  {
    id: 2,
    path: oceanPaths.pacificNorth,
    speed: 2500,
    color: 120, // Green
    fact: turtleFacts[1]
  },
  {
    id: 3,
    path: oceanPaths.indian,
    speed: 1800,
    color: 240, // Blue
    fact: turtleFacts[2]
  },
  {
    id: 4,
    path: oceanPaths.pacificSouth,
    speed: 2200,
    color: 180, // Cyan
    fact: turtleFacts[3]
  },
  {
    id: 5,
    path: oceanPaths.atlanticSouth,
    speed: 1900,
    color: 300, // Magenta
    fact: turtleFacts[4]
  }
];

// Country coordinates for map flying
const countryCoordinates = {
  '🇺🇸 USA': { lat: 28.5, lng: -95, zoom: 4 },
  '🇨🇳 China': { lat: 35.8, lng: 104.2, zoom: 4 },
  '🇷🇺 Russia': { lat: 61.5, lng: 105.3, zoom: 3 },
  '🇳🇿 New Zealand': { lat: -40.9, lng: 174.9, zoom: 6 },
  '🇮🇳 India': { lat: 13.7, lng: 79.9, zoom: 6 },
  '🇯🇵 Japan': { lat: 31.4, lng: 130.9, zoom: 6 },
  '🇫🇷 French Guiana': { lat: 5.2, lng: -52.7, zoom: 8 }
};

const LaunchMapView = ({ launches, onSiteFilter, yearFilter, view }) => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [flyToLocation, setFlyToLocation] = useState(null);

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

    // Determine which count to use based on view filter
    const isPastView = view === 'past';
    const launchCount = isPastView ? 'past' : 'upcoming';

    return {
      totalSites: siteData.length,
      totalUpcoming: siteData.reduce((sum, site) => sum + site.upcoming, 0),
      totalPast: siteData.reduce((sum, site) => sum + site.past, 0),
      totalLaunches: siteData.reduce((sum, site) => sum + site[launchCount], 0),
      isPastView,
      topSites: siteData
        .filter(site => site[launchCount] > 0)
        .sort((a, b) => b[launchCount] - a[launchCount])
        .slice(0, 5),
      countries: Object.entries(countries)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
    };
  }, [siteData, view]);

  // Create custom turtle marker icon
  const createTurtleMarker = (site) => {
    const isPastView = view === 'past';
    const count = isPastView ? site.past : site.upcoming;
    const { size, colorClass, hueRotate } = getTurtleSize(count);
    const hasPulse = count > 0;

    return L.divIcon({
      html: `
        <div class="turtle-marker-wrapper" style="width: ${size}px; height: ${size}px;">
          <div class="turtle-marker ${colorClass}"
               style="
                 width: ${size}px;
                 height: ${size}px;
                 background-image: url(/images/space-turtle-banner.png);
                 background-size: ${size * 1.2}px;
                 background-position: center 30%;
                 background-repeat: no-repeat;
                 filter: hue-rotate(${hueRotate}deg) saturate(1.3) brightness(1.1);
                 border-radius: 50%;
               ">
          </div>
          <span class="turtle-marker-badge">${count}</span>
          ${hasPulse ? '<span class="pulse-ring"></span>' : ''}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
      className: 'custom-turtle-icon'
    });
  };

  const getTurtleSize = (count) => {
    if (count >= 10) {
      return { size: 90, colorClass: 'red', hueRotate: 340 };
    }
    if (count >= 5) {
      return { size: 70, colorClass: 'orange', hueRotate: 20 };
    }
    if (count >= 3) {
      return { size: 55, colorClass: 'yellow', hueRotate: 40 };
    }
    return { size: 40, colorClass: 'green', hueRotate: 120 };
  };

  return (
    <div className="relative h-[calc(100vh-280px)] min-h-[500px] md:min-h-[600px] flex flex-col lg:flex-row gap-4">
      {/* Mobile Stats Toggle Button */}
      <button
        onClick={() => setSelectedSite(selectedSite ? null : globalStats.topSites[0])}
        className="lg:hidden bg-[#F7941D] text-[#003366] font-black py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-[#FDB913] transition-colors no-print"
      >
        <Globe className="w-5 h-5" />
        {selectedSite ? 'Hide Stats' : 'Show Global Stats'}
      </button>

      {/* Stats Sidebar */}
      <div className="hidden lg:block w-80 bg-gradient-to-br from-white/20 to-[#2B8C74]/40 backdrop-blur-md rounded-2xl p-6 overflow-y-auto shadow-2xl border-2 border-[#6BA539]/30 no-print">
        <div className="space-y-6">
          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="w-full bg-gradient-to-r from-[#F7941D] to-[#FDB913] text-[#003366] font-black py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all"
          >
            <Printer className="w-5 h-5" />
            Print Worksheet
          </button>

          <div>
            <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
              <Globe className="w-6 h-6 text-[#FDB913]" />
              Global Stats
            </h3>

            <div className="space-y-3">
              <div className="bg-[#003366]/40 p-4 rounded-xl">
                <div className="text-3xl font-black text-[#FDB913]">{globalStats.totalSites}</div>
                <div className="text-sm text-white font-semibold">Active Launch Sites</div>
              </div>

              <div className="bg-[#003366]/40 p-4 rounded-xl">
                <div className="text-3xl font-black text-[#6BA539]">{globalStats.totalLaunches}</div>
                <div className="text-sm text-white font-semibold">
                  {globalStats.isPastView ? 'Past Launches' : 'Upcoming Launches'}
                </div>
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
                  className="bg-[#003366]/40 p-3 rounded-lg hover:bg-[#003366]/60 transition-colors cursor-pointer group"
                  onClick={() => {
                    setSelectedSite(site);
                    setFlyToLocation({
                      lat: site.lat,
                      lng: site.lng,
                      zoom: 8,
                      siteName: site.name
                    });
                  }}
                  title={`Click to view ${site.name} on map`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-[#FDB913] font-black text-lg flex-shrink-0">{index + 1}.</span>
                      <span className="text-white text-sm font-semibold truncate">{site.name}</span>
                    </div>
                    <span className="text-[#6BA539] font-black flex-shrink-0">
                      {globalStats.isPastView ? site.past : site.upcoming}
                    </span>
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
              {globalStats.countries.map(([country, count]) => {
                const coords = countryCoordinates[country];
                return (
                  <div
                    key={country}
                    className="bg-[#003366]/40 p-3 rounded-lg hover:bg-[#003366]/60 transition-colors cursor-pointer"
                    onClick={() => {
                      if (coords) {
                        setFlyToLocation(coords);
                      }
                    }}
                    title={coords ? `Click to view ${country} on map` : undefined}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-semibold">{country}</span>
                      <span className="text-[#FDB913] font-black">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 bg-gradient-to-br from-white/20 to-[#2B8C74]/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border-2 border-[#6BA539]/30 no-print">
        <MapContainer
          center={[28.5, -10]}
          zoom={2}
          minZoom={2}
          maxZoom={12}
          className="h-full w-full z-0"
          style={{ background: '#2B8C74' }}
        >
          <MapController flyToLocation={flyToLocation} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* Render launch site markers */}
          {siteData.map((site) => {
            return (
              <Marker
                key={site.name}
                position={[site.lat, site.lng]}
                icon={createTurtleMarker(site)}
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

                    <div className="bg-gradient-to-r from-[#FDB913]/30 to-[#6BA539]/30 p-3 rounded-xl mb-3 text-center">
                      <div className="font-black text-[#003366] text-3xl">
                        {view === 'past' ? site.past : site.upcoming}
                      </div>
                      <div className="text-sm text-gray-700 font-bold">
                        {view === 'past' ? 'Past Launches' : 'Upcoming Launches'}
                      </div>
                    </div>

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
              </Marker>
            );
          })}

          {/* Swimming Turtles - Hidden on mobile for performance */}
          <div className="hidden md:block">
            {swimmingTurtles.map(turtle => (
              <SwimmingTurtle
                key={turtle.id}
                path={turtle.path}
                speed={turtle.speed}
                turtleId={turtle.id}
                color={turtle.color}
                fact={turtle.fact}
              />
            ))}
          </div>
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

      {/* Printable Worksheet */}
      <PrintableMapView siteData={siteData} launches={launches} />
    </div>
  );
};

export default LaunchMapView;