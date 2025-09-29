// Test script to verify SpaceX API connectivity
// Run this in the browser console to test API access

async function testSpaceXAPI() {
  console.log('🧪 Testing SpaceX API connectivity...\n');
  
  const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
  const tests = [
    { name: 'Direct API', url: 'https://api.spacexdata.com/v5/launches/latest', useProxy: false },
    { name: 'Via CORS Proxy', url: 'https://api.spacexdata.com/v5/launches/latest', useProxy: true }
  ];
  
  for (const test of tests) {
    console.log(`\n📡 Testing: ${test.name}`);
    console.log('─'.repeat(40));
    
    const targetUrl = test.useProxy 
      ? CORS_PROXY + encodeURIComponent(test.url)
      : test.url;
    
    console.log(`URL: ${targetUrl.substring(0, 100)}...`);
    
    try {
      const startTime = Date.now();
      const response = await fetch(targetUrl);
      const responseTime = Date.now() - startTime;
      
      console.log(`✅ Response Status: ${response.status}`);
      console.log(`⏱️  Response Time: ${responseTime}ms`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`📦 Data Retrieved: ${JSON.stringify(data).substring(0, 100)}...`);
        console.log(`🚀 Latest Launch: ${data.name || 'Unknown'}`);
        console.log(`📅 Date: ${new Date(data.date_unix * 1000).toLocaleDateString()}`);
        console.log(`✨ SUCCESS - ${test.name} works!`);
      } else {
        console.log(`❌ FAILED - Status ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ ERROR - ${test.name} failed:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 API Test Complete');
  console.log('If both tests failed, check:');
  console.log('1. Browser console for CORS errors');
  console.log('2. Network tab for blocked requests');
  console.log('3. Try opening https://api.spacexdata.com/v5/launches/latest directly');
}

// Run the test
testSpaceXAPI();