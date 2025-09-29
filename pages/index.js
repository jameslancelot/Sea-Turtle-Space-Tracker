import SpaceLaunchTracker from '../components/SpaceLaunchTracker';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>SpaceX Launch Tracker - Real-Time Launch Data</title>
        <meta name="description" content="Track SpaceX launches with real-time data from the official SpaceX API" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SpaceLaunchTracker />
    </>
  );
}