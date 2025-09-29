/**
 * Vercel Serverless API Route
 * Fetches space launch data from Launch Library 2 API
 * Launch Library 2 is the actively maintained successor to the old SpaceX API
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
        // Get recent past launches and confirmed upcoming launches (not TBD placeholders)
        // Use date filters to get real launches, not placeholder dates
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        
        // Get launches within a reasonable date range to avoid placeholder dates
        apiUrl = `https://ll.thespacedevs.com/2.2.0/launch/?lsp__name=SpaceX&limit=100&net__gte=${oneYearAgo.toISOString()}&net__lte=${oneYearFromNow.toISOString()}&ordering=-net`;
        break;
      
      case 'upcoming':
        // Get only confirmed upcoming SpaceX launches (not far-future TBD)
        const today = new Date();
        const sixMonthsFromNow = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
        apiUrl = `https://ll.thespacedevs.com/2.2.0/launch/upcoming/?lsp__name=SpaceX&limit=50&net__lte=${sixMonthsFromNow.toISOString()}`;
        break;
        
      case 'rockets':
        // Get SpaceX rocket configurations
        apiUrl = 'https://ll.thespacedevs.com/2.2.0/config/launcher/?lsp__name=SpaceX';
        break;
        
      case 'launchpads':
        // Get launch pads used by SpaceX
        apiUrl = 'https://ll.thespacedevs.com/2.2.0/pad/?agency__name=SpaceX';
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
    
    // Filter out launches with TBD status or unrealistic future dates
    if (data.results && (resource === 'launches' || resource === 'upcoming')) {
      const filteredResults = data.results.filter(launch => {
        const launchDate = new Date(launch.net);
        const yearFromNow = new Date();
        yearFromNow.setFullYear(yearFromNow.getFullYear() + 1);
        
        // Filter out:
        // 1. Launches more than 1 year in the future (likely TBD placeholders)
        // 2. Launches with status "To Be Determined" and dates far in the future
        const isTooFarFuture = launchDate > yearFromNow;
        const isTBD = launch.status?.id === 2 && launch.status?.name === "To Be Determined";
        
        // Keep launch if it's not too far in future OR if it's TBD but within reasonable timeframe
        return !isTooFarFuture || (isTBD && !isTooFarFuture);
      });
      
      console.log(`📊 Filtered ${data.results.length} launches to ${filteredResults.length} (removed far-future TBD placeholders)`);
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
