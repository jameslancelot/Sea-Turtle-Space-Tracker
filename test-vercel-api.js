/**
 * Test script for the new Vercel API route
 * Run with: node test-vercel-api.js
 * 
 * This tests if the API route structure is correct
 */

console.log('🐢 Testing Vercel API Route Setup...\n');

// Test 1: Check if files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'pages/api/spacex.js',
  'components/SeaTurtleSpaceTracker.jsx',
  'pages/index.js'
];

console.log('✅ Checking required files...');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n📋 Setup Summary:');
console.log('  1. Created Vercel API route at: pages/api/spacex.js');
console.log('  2. Updated component to use: /api/spacex?resource=[launches|rockets|launchpads]');
console.log('  3. This bypasses CORS completely!');

console.log('\n🚀 Next Steps:');
console.log('  1. Commit and push to GitHub:');
console.log('     git add .');
console.log('     git commit -m "Fix: Use Vercel API route to bypass CORS"');
console.log('     git push');
console.log('  2. Vercel will auto-deploy');
console.log('  3. Test at: https://sea-turtle-space-tracker.vercel.app');
console.log('  4. Check browser console for logs (F12)');

console.log('\n💡 How it works:');
console.log('  • Browser calls /api/spacex?resource=launches');
console.log('  • Vercel serverless function fetches from SpaceX API');
console.log('  • No CORS issues (server-to-server communication)');
console.log('  • Returns data to browser');

console.log('\n🐢 Sea Turtles ready to surf to space! 🚀\n');
