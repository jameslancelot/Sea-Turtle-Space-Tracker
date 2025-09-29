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
        // Get all launches (both past and upcoming), filtered by SpaceX
        apiUrl = 'https://ll.thespacedevs.com/2.2.0/launch/?lsp__name=SpaceX&limit=100&ordering=-net';
        break;
      
      case 'upcoming':
        // Get only upcoming SpaceX launches
        apiUrl = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?lsp__name=SpaceX&limit=50';
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
    
    // Return the results array (Launch Library 2 wraps data in a results object)
    if (data.results) {
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
