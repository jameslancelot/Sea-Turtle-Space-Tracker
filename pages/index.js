// Choose your preferred version by uncommenting the desired import:

// Original colorful version with full sea turtle theming
// import SeaTurtleSpaceTrackerBranded from '../components/SeaTurtleSpaceTrackerBranded';

// Professional dark theme version (minimal sea turtle elements)
// import SeaTurtleSpaceTrackerPro from '../components/SeaTurtleSpaceTrackerPro';

// Enhanced version - Professional layout with maintained sea turtle theme (RECOMMENDED)
import SeaTurtleSpaceTrackerEnhanced from '../components/SeaTurtleSpaceTrackerEnhanced';

import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Sea Turtle Space Tracker - PVPV/Rawlings Elementary</title>
        <meta name="description" content="Track SpaceX launches with the Sea Turtles of PVPV/Rawlings Elementary School - Surfing to Success!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SeaTurtleSpaceTrackerEnhanced />
    </>
  );
}