/**
 * Vercel Serverless API Route
 * Fetches space launch data from Launch Library 2 API
 * Filters out far-future placeholder dates and sorts by soonest first
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
        // Get recent past launches and upcoming launches
        // Use a wide date range but filter out unrealistic dates later
        const now = new Date();
        const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
        const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
        
        // Get launches, ordering by date (soonest first)
        apiUrl = `https://ll.thespacedevs.com/2.2.0/launch/?lsp__name=SpaceX&limit=100&net__gte=${twoYearsAgo.toISOString()}&ordering=net`;
        break;
      
      case 'upcoming':
        // Get only upcoming SpaceX launches within next 3 months
        const today = new Date();
        const threeMonthsFuture = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
        apiUrl = `https://ll.thespacedevs.com/2.2.0/launch/upcoming/?lsp__name=SpaceX&limit=50&net__lte=${threeMonthsFuture.toISOString()}&ordering=net`;
        break;
        
      case 'rockets':
        apiUrl = 'https://ll.thespacedevs.com/2.2.0/config/launcher/?lsp__name=SpaceX';
        break;
        
      case 'launchpads':
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
    
    // Filter and sort launches
    if (data.results && (resource === 'launches' || resource === 'upcoming')) {
      const now = new Date();
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      
      let filteredResults = data.results.filter(launch => {
        const launchDate = new Date(launch.net);
        
        // Filter out launches that are:
        // 1. More than 6 months in the future (likely placeholders)
        // 2. Have "To Be Determined" status with dates in 2026 or later
        const isTooFarFuture = launchDate > sixMonthsFromNow;
        const isYear2026OrLater = launchDate.getFullYear() >= 2026;
        const isTBD = launch.status?.id === 2 && launch.status?.name === "To Be Determined";
        
        // Exclude if it's TBD and 2026+, or just too far in the future
        if ((isTBD && isYear2026OrLater) || isTooFarFuture) {
          console.log(`Filtering out: ${launch.name} - Date: ${launch.net}`);
          return false;
        }
        
        return true;
      });
      
      // Sort by date - soonest first for upcoming, most recent first for past
      filteredResults.sort((a, b) => {
        const dateA = new Date(a.net);
        const dateB = new Date(b.net);
        const now = new Date();
        
        // Separate upcoming and past launches
        const aIsUpcoming = dateA > now;
        const bIsUpcoming = dateB > now;
        
        // If one is upcoming and one is past, upcoming goes first
        if (aIsUpcoming && !bIsUpcoming) return -1;
        if (!aIsUpcoming && bIsUpcoming) return 1;
        
        // If both upcoming, soonest first
        if (aIsUpcoming && bIsUpcoming) {
          return dateA - dateB;
        }
        
        // If both past, most recent first
        return dateB - dateA;
      });
      
      console.log(`📊 Filtered ${data.results.length} launches to ${filteredResults.length} (removed far-future/TBD placeholders)`);
      console.log(`📅 Date range: ${filteredResults.length > 0 ? filteredResults[0].net + ' to ' + filteredResults[filteredResults.length - 1].net : 'No launches'}`);
      
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