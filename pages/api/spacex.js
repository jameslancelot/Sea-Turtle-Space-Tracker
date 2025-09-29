/**
 * Vercel Serverless API Route
 * Fetches space launch data from Launch Library 2 API
 * Filters out unrealistic placeholder dates and sorts properly
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
        // Get all SpaceX launches and filter/sort them ourselves
        // Order by date to get a good mix of past and upcoming
        apiUrl = 'https://ll.thespacedevs.com/2.2.0/launch/?lsp__name=SpaceX&limit=100&ordering=-net';
        break;
      
      case 'upcoming':
        // Get upcoming SpaceX launches
        apiUrl = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?lsp__name=SpaceX&limit=50';
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
      const twoYearsFromNow = new Date();
      twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
      
      let filteredResults = data.results.filter(launch => {
        const launchDate = new Date(launch.net);
        
        // Filter out launches that are:
        // 1. More than 2 years in the future (likely placeholders)
        // 2. Have dates in 2027 or later with "TBD" status
        const isTooFarFuture = launchDate > twoYearsFromNow;
        const isYear2027OrLater = launchDate.getFullYear() >= 2027;
        const isTBD = launch.status?.id === 2 && launch.status?.name === "To Be Determined";
        
        // Exclude if it's TBD and 2027+, or just way too far in the future
        if ((isTBD && isYear2027OrLater) || isTooFarFuture) {
          console.log(`Filtering out far-future launch: ${launch.name} - Date: ${launch.net}`);
          return false;
        }
        
        return true;
      });
      
      // Sort by date
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
      
      console.log(`📊 Filtered ${data.results.length} launches to ${filteredResults.length}`);
      if (filteredResults.length > 0) {
        const firstDate = new Date(filteredResults[0].net);
        const lastDate = new Date(filteredResults[filteredResults.length - 1].net);
        console.log(`📅 Date range: ${firstDate.toISOString()} to ${lastDate.toISOString()}`);
      }
      
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