// Quick API diagnostic - paste this in browser console

console.log('🔬 API Diagnostic Test Starting...\n');

// Test 1: Direct SpaceX API
fetch('https://api.spacexdata.com/v5/launches/latest')
  .then(r => console.log('✅ Direct API: SUCCESS'))
  .catch(e => console.log('❌ Direct API: BLOCKED (CORS)'));

// Test 2: AllOrigins Proxy
fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://api.spacexdata.com/v5/launches/latest'))
  .then(r => r.json())
  .then(d => console.log('✅ AllOrigins Proxy: SUCCESS', d.name))
  .catch(e => console.log('❌ AllOrigins Proxy: FAILED', e.message));

// Test 3: Alternative Proxy
fetch('https://corsproxy.io/?' + encodeURIComponent('https://api.spacexdata.com/v5/launches/latest'))
  .then(r => r.json())
  .then(d => console.log('✅ CorsProxy.io: SUCCESS'))
  .catch(e => console.log('❌ CorsProxy.io: FAILED'));

// Test 4: Check if we're in production
console.log('📍 Current URL:', window.location.href);
console.log('🌐 Environment:', window.location.hostname);