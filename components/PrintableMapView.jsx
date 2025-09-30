import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const PrintableMapView = ({ siteData, launches }) => {
  const topSites = siteData
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const totalLaunches = siteData.reduce((sum, site) => sum + site.total, 0);

  return (
    <div className="print-only">
      {/* Header */}
      <div className="print-header">
        <img
          src="/images/space-turtle-logo.png"
          alt="Space Turtle"
          className="print-logo"
        />
        <h1>PVPV Rawlings Elementary Space Tracker</h1>
        <h2>Launch Sites Around the World</h2>
        <p className="print-date">
          Generated: {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p className="print-stats">
          Total Sites: {siteData.length} | Total Launches Tracked: {totalLaunches}
        </p>
      </div>

      {/* Legend */}
      <div className="print-legend">
        <h3>Map Legend - Upcoming Launches</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-dot red"></span>
            <span>Very Active (10+ upcoming)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot orange"></span>
            <span>Active (5-9 upcoming)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot yellow"></span>
            <span>Moderate (3-4 upcoming)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot green"></span>
            <span>Planning (1-2 upcoming)</span>
          </div>
        </div>
      </div>

      {/* Top Sites List */}
      <div className="print-sites">
        <h3>📊 Top 10 Busiest Launch Sites</h3>
        <table className="print-sites-table">
          <tbody>
            {topSites.map((site, index) => (
              <tr key={site.name}>
                <td className="site-rank">{index + 1}.</td>
                <td className="site-name">{site.name}</td>
                <td className="site-dots">{'·'.repeat(30)}</td>
                <td className="site-count">{site.total} launches</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Activities */}
      <div className="print-activities page-break">
        <h3>🎯 Student Activities</h3>

        <div className="student-info">
          <label>Name: <span className="blank-line"></span></label>
          <label>Date: <span className="blank-line-short"></span></label>
        </div>

        <div className="activity-checklist">
          <div className="activity-item">
            <input type="checkbox" />
            <label>
              <strong>1.</strong> Find and circle the launch site closest to Florida on the map
            </label>
          </div>

          <div className="activity-item">
            <input type="checkbox" />
            <label>
              <strong>2.</strong> Which country has the most launch sites?
            </label>
            <div className="answer-line">
              Answer: <span className="blank-line"></span>
            </div>
          </div>

          <div className="activity-item">
            <input type="checkbox" />
            <label>
              <strong>3.</strong> Use crayons or colored pencils to color each continent
              a different color on the map above
            </label>
          </div>

          <div className="activity-item">
            <input type="checkbox" />
            <label>
              <strong>4.</strong> Count how many launch sites are located on or near coastlines
              compared to inland locations
            </label>
            <div className="answer-line">
              Coastal: <span className="blank-line-short"></span>
              Inland: <span className="blank-line-short"></span>
            </div>
          </div>

          <div className="activity-item">
            <input type="checkbox" />
            <label>
              <strong>5.</strong> Using a ruler, draw a line from Kennedy Space Center (Florida)
              to the farthest launch site. Which site is it?
            </label>
            <div className="answer-line">
              Answer: <span className="blank-line"></span>
            </div>
          </div>
        </div>

        {/* Discussion Questions */}
        <div className="discussion-section">
          <h4>💭 Discussion Questions</h4>

          <div className="discussion-question">
            <p><strong>1.</strong> Why do you think so many launch sites are located near
            coastlines or oceans?</p>
            <div className="answer-lines">
              <span className="blank-line-full"></span>
              <span className="blank-line-full"></span>
            </div>
          </div>

          <div className="discussion-question">
            <p><strong>2.</strong> If you could watch a rocket launch from any site on this map,
            which would you choose and why?</p>
            <div className="answer-lines">
              <span className="blank-line-full"></span>
              <span className="blank-line-full"></span>
            </div>
          </div>

          <div className="discussion-question">
            <p><strong>3.</strong> How do you think scientists decide where to build a new
            launch site?</p>
            <div className="answer-lines">
              <span className="blank-line-full"></span>
              <span className="blank-line-full"></span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="print-qr-section">
        <QRCodeSVG
          value={typeof window !== 'undefined' ? window.location.href : 'https://sea-turtle-space-tracker.vercel.app'}
          size={120}
          level="M"
          includeMargin={true}
        />
        <div className="qr-instructions">
          <p><strong>Explore the Interactive Map!</strong></p>
          <p>Scan this code with a tablet or phone to see the map come to life online</p>
        </div>
      </div>

      {/* Footer */}
      <div className="print-footer">
        <p>🐢 "Surfing to Success - From the Ocean to the Stars!"</p>
        <p>PVPV Rawlings Elementary School | St. Johns County, Florida</p>
      </div>
    </div>
  );
};

export default PrintableMapView;