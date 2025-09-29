/**
 * Vercel Serverless API Route
 * Fetches SpaceX data server-side to bypass CORS issues
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { resource } = req.query;
  
  // Validate resource parameter
  const validResources = ['launches', 'rockets', 'launchpads'];
  if (!resource || !validResources.includes(resource)) {
    return res.status(400).json({ 
      error: 'Invalid resource. Use: launches, rockets, or launchpads' 
    });
  }

  try {
    console.log(`🚀 Fetching SpaceX ${resource} from API...`);
    
    const apiUrl = `https://api.spacexdata.com/v5/${resource}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error(`❌ SpaceX API error: ${response.status}`);
      throw new Error(`SpaceX API returned status ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Successfully fetched ${Array.isArray(data) ? data.length : 'data'} ${resource}`);
    
    // Return the data
    res.status(200).json(data);
    
  } catch (error) {
    console.error(`❌ Error fetching ${resource}:`, error);
    res.status(500).json({ 
      error: 'Failed to fetch SpaceX data',
      message: error.message 
    });
  }
}
