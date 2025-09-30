import React, { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const SwimmingTurtle = ({ path, speed, turtleId, color, fact }) => {
  const [pathIndex, setPathIndex] = useState(0);
  const [direction, setDirection] = useState('right');
  const [isPaused, setIsPaused] = useState(false);

  // Animate turtle along path
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setPathIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % path.length;

        // Determine swimming direction for sprite flip
        const currentPos = path[prevIndex];
        const nextPos = path[nextIndex];

        if (nextPos[1] > currentPos[1]) {
          setDirection('right');
        } else if (nextPos[1] < currentPos[1]) {
          setDirection('left');
        }

        return nextIndex;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [path, speed, isPaused]);

  const position = path[pathIndex];

  // Custom swimming turtle icon
  const turtleIcon = L.divIcon({
    html: `
      <div class="swimming-turtle-icon ${direction}" style="
        animation: swim-wobble 2s ease-in-out infinite;
      ">
        <div style="
          width: 60px;
          height: 60px;
          background-image: url(/images/space-turtle-banner.png);
          background-size: 72px;
          background-position: center 30%;
          background-repeat: no-repeat;
          transform: ${direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)'};
          filter: hue-rotate(${color}deg) saturate(1.2) brightness(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          border-radius: 50%;
          transition: transform 0.5s ease;
        "></div>
      </div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    className: 'swimming-turtle-marker'
  });

  return (
    <Marker
      position={position}
      icon={turtleIcon}
      eventHandlers={{
        click: () => setIsPaused(!isPaused)
      }}
    >
      <Popup className="turtle-fact-popup">
        <div className="turtle-fact-content">
          <h3 className="text-lg font-black text-[#003366] mb-2">
            🐢 Space Turtle Says:
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            {fact}
          </p>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-full text-xs bg-[#F7941D] text-white px-3 py-2 rounded-full font-bold hover:bg-[#FDB913] transition-colors"
          >
            {isPaused ? '▶️ Resume Swimming' : '⏸️ Pause Turtle'}
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

export default SwimmingTurtle;