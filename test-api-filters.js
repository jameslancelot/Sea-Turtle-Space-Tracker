/**
 * Diagnostic script to analyze API filtering pipeline
 * Tests what data we're getting and how filters reduce the count
 */

const fetch = require('node-fetch');

async function analyzeFilters() {
  console.log('🔍 ANALYZING API FILTERING PIPELINE\n');
  console.log('=' . repeat(80));

  const results = {
    totalUpcoming: 0,
    totalPast: 0,
    afterTBDFilter: 0,
    upcomingByStatus: {},
    upcomingByProvider: {},
    upcomingByYear: {},
  };

  try {
    // Fetch upcoming launches (3 pages)
    console.log('\n📥 STEP 1: Fetching upcoming launches (3 pages)...\n');
    const upcomingPages = 3;
    const upcomingPromises = [];

    for (let i = 0; i < upcomingPages; i++) {
      const offset = i * 100;
      const url = `https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=100&offset=${offset}`;
      upcomingPromises.push(fetch(url));
    }

    // Fetch past launches (2 pages)
    console.log('📥 STEP 2: Fetching past launches (2 pages)...\n');
    const pastPages = 2;
    const pastPromises = [];

    for (let i = 0; i < pastPages; i++) {
      const offset = i * 100;
      const url = `https://ll.thespacedevs.com/2.2.0/launch/previous/?limit=100&offset=${offset}`;
      pastPromises.push(fetch(url));
    }

    const responses = await Promise.all([...upcomingPromises, ...pastPromises]);
    const allData = await Promise.all(responses.map(res => res.json()));

    const upcomingData = allData.slice(0, upcomingPages);
    const pastData = allData.slice(upcomingPages);

    const upcomingLaunches = upcomingData.flatMap(data => data.results || []);
    const pastLaunches = pastData.flatMap(data => data.results || []);

    results.totalUpcoming = upcomingLaunches.length;
    results.totalPast = pastLaunches.length;

    console.log(`✅ Fetched ${results.totalUpcoming} upcoming + ${results.totalPast} past = ${results.totalUpcoming + results.totalPast} total launches`);

    // Apply TBD filter
    console.log('\n📊 STEP 3: Applying TBD filter (status.id === 2)...\n');

    const allLaunches = [...upcomingLaunches, ...pastLaunches];

    const tbdLaunches = allLaunches.filter(l => l.status?.id === 2);
    console.log(`🔍 Found ${tbdLaunches.length} TBD launches to filter out:`);
    tbdLaunches.slice(0, 5).forEach(l => {
      console.log(`   - ${l.name} (${l.launch_service_provider?.name})`);
    });
    if (tbdLaunches.length > 5) {
      console.log(`   ... and ${tbdLaunches.length - 5} more`);
    }

    const filteredLaunches = allLaunches.filter(l => l.status?.id !== 2);
    results.afterTBDFilter = filteredLaunches.length;

    console.log(`\n✅ After TBD filter: ${results.afterTBDFilter} launches (removed ${allLaunches.length - results.afterTBDFilter})`);

    // Analyze by status
    console.log('\n📊 STEP 4: Analyzing by launch status...\n');

    filteredLaunches.forEach(l => {
      const statusName = `${l.status?.id}: ${l.status?.name} (${l.status?.abbrev})`;
      results.upcomingByStatus[statusName] = (results.upcomingByStatus[statusName] || 0) + 1;
    });

    Object.entries(results.upcomingByStatus)
      .sort((a, b) => b[1] - a[1])
      .forEach(([status, count]) => {
        console.log(`   ${status}: ${count} launches`);
      });

    // Apply frontend isUpcoming() logic
    console.log('\n📊 STEP 5: Applying frontend isUpcoming() filter...\n');
    console.log('   Logic: status.id === 1 OR date > now\n');

    const now = new Date();
    const upcomingFiltered = filteredLaunches.filter(l => {
      return l.status?.id === 1 || new Date(l.net) > now;
    });

    console.log(`✅ Frontend "upcoming" count: ${upcomingFiltered.length} launches`);

    // Analyze by provider
    console.log('\n📊 STEP 6: Breaking down by launch provider...\n');

    upcomingFiltered.forEach(l => {
      const provider = l.launch_service_provider?.name || 'Unknown';
      results.upcomingByProvider[provider] = (results.upcomingByProvider[provider] || 0) + 1;
    });

    Object.entries(results.upcomingByProvider)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .forEach(([provider, count]) => {
        console.log(`   ${provider}: ${count} launches`);
      });

    // Analyze SpaceX specifically
    console.log('\n🚀 STEP 7: Analyzing SpaceX launches specifically...\n');

    const spacexUpcoming = upcomingFiltered.filter(l =>
      l.launch_service_provider?.name === 'SpaceX'
    );

    console.log(`✅ SpaceX upcoming launches: ${spacexUpcoming.length}`);

    // Break down by year
    const spacexByYear = {};
    spacexUpcoming.forEach(l => {
      const year = new Date(l.net).getFullYear();
      spacexByYear[year] = (spacexByYear[year] || 0) + 1;
    });

    console.log('\n   SpaceX by year:');
    Object.entries(spacexByYear)
      .sort((a, b) => a[0] - b[0])
      .forEach(([year, count]) => {
        console.log(`   ${year}: ${count} launches`);
      });

    // Show first 10 SpaceX launches
    console.log('\n   First 10 SpaceX upcoming launches:');
    spacexUpcoming.slice(0, 10).forEach((l, i) => {
      const date = new Date(l.net).toLocaleDateString();
      console.log(`   ${i + 1}. ${l.name} - ${date} (${l.status?.abbrev})`);
    });

    // Summary table
    console.log('\n' + '='.repeat(80));
    console.log('\n📊 FILTERING SUMMARY TABLE\n');
    console.log('┌─────────────────────────────────────────────────┬───────────┐');
    console.log('│ Filter Stage                                    │ Count     │');
    console.log('├─────────────────────────────────────────────────┼───────────┤');
    console.log(`│ 1. Total from API (upcoming endpoint)           │ ${results.totalUpcoming.toString().padStart(9)} │`);
    console.log(`│ 2. Total from API (past endpoint)               │ ${results.totalPast.toString().padStart(9)} │`);
    console.log(`│ 3. Combined total                               │ ${(results.totalUpcoming + results.totalPast).toString().padStart(9)} │`);
    console.log(`│ 4. After TBD filter (status.id !== 2)           │ ${results.afterTBDFilter.toString().padStart(9)} │`);
    console.log(`│ 5. After isUpcoming() filter (frontend)         │ ${upcomingFiltered.length.toString().padStart(9)} │`);
    console.log(`│ 6. SpaceX only (provider filter)                │ ${spacexUpcoming.length.toString().padStart(9)} │`);
    console.log('└─────────────────────────────────────────────────┴───────────┘');

    console.log('\n' + '='.repeat(80));
    console.log('\n✅ ANALYSIS COMPLETE\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

analyzeFilters().catch(console.error);
