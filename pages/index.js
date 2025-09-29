import SeaTurtleSpaceTrackerV2 from '../components/SeaTurtleSpaceTrackerV2';
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
      <SeaTurtleSpaceTrackerV2 />
    </>
  );
}