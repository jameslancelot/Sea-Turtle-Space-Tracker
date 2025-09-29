/**
 * FIXED Vercel Serverless API Route
 * Fetches space launch data from Launch Library 2 API
 * Uses separate endpoints for upcoming/past to avoid placeholder TBD dates
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { resource } = req.query;
  
  try {
    console.log(`🚀 Fetching ${resource} from Launch Library 2 API...`);
    
    let apiUrl;
    
    // Map our resources to Launch Library 2 endpoints
    switch (resource) {
      case 'launches':
        // FIXED: Fetch upcoming and past launches separately to avoid placeholder dates
        const upcomingUrl = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=100';
        const pastUrl = 'https://ll.thespacedevs.com/2.2.0/launch/previous/?limit=100';
        
        try {
          console.log(`📍 Fetching upcoming from: ${upcomingUrl}`);
          console.log(`📍 Fetching past from: ${pastUrl}`);
          
          const [upcomingRes, pastRes] = await Promise.all([
            fetch(upcomingUrl),
            fetch(pastUrl)
          ]);
          
          if (!upcomingRes.ok || !pastRes.ok) {
            throw new Error(`API returned error status`);
          }
          
          const upcomingData = await upcomingRes.json();
          const pastData = await pastRes.json();
          
          // Combine results
          const combinedResults = [
            ...(upcomingData.results || []),
            ...(pastData.results || [])
          ];
          
          console.log(`✅ Combined ${upcomingData.results?.length || 0} upcoming + ${pastData.results?.length || 0} past = ${combinedResults.length} total launches`);
          
          // Filter out TBD placeholder dates
          const filteredResults = combinedResults.filter(launch => {
            // Status ID 2 = "To Be Determined" - these have placeholder dates
            if (launch.status?.id === 2) {
              console.log(`Filtering out TBD launch: ${launch.name}`);
              return false;
            }
            return true;
          });
          
          console.log(`📊 Filtered to ${filteredResults.length} launches with real dates`);
          
          if (filteredResults.length > 0) {
            const dates = filteredResults.map(l => new Date(l.net));
            console.log(`📅 Date range: ${new Date(Math.min(...dates)).toISOString()} to ${new Date(Math.max(...dates)).toISOString()}`);
          }
          
          return res.status(200).json(filteredResults);
        } catch (err) {
          console.error(`❌ Error fetching combined launches:`, err);
          throw err;
        }
      
      case 'upcoming':
        // Get upcoming launches with confirmed dates
        apiUrl = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=100';
        break;
        
      case 'rockets':
        apiUrl = 'https://ll.thespacedevs.com/2.2.0/config/launcher/';
        break;

      case 'launchpads':
        apiUrl = 'https://ll.thespacedevs.com/2.2.0/pad/';
        break;
        
      default:
        return res.status(400).json({ 
          error: 'Invalid resource. Use: launches, upcoming, rockets, or launchpads' 
        });
    }
    
    console.log(`📍 Fetching from: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error(`❌ Launch Library 2 API error: ${response.status}`);
      throw new Error(`API returned status ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Successfully fetched ${resource}`);
    
    // Process other resources (not 'launches')
    if (data.results && resource === 'upcoming') {
      // Filter out TBD status for upcoming too
      const filteredResults = data.results.filter(launch => {
        if (launch.status?.id === 2) {
          console.log(`Filtering out TBD launch: ${launch.name}`);
          return false;
        }
        return true;
      });
      
      // Sort upcoming by date (soonest first)
      filteredResults.sort((a, b) => {
        const dateA = new Date(a.net);
        const dateB = new Date(b.net);
        return dateA - dateB;
      });
      
      console.log(`📊 Filtered ${data.results.length} upcoming launches to ${filteredResults.length} with real dates`);
      res.status(200).json(filteredResults);
    } else if (data.results) {
      res.status(200).json(data.results);
    } else {
      res.status(200).json(data);
    }
    
  } catch (error) {
    console.error(`❌ Error fetching ${resource}:`, error);
    res.status(500).json({ 
      error: 'Failed to fetch space launch data',
      message: error.message 
    });
  }
}