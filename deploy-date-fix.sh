#!/bin/bash

# 🐢 Sea Turtle Space Tracker - Deploy Date Bug Fix
echo "🐢 Deploying Sea Turtle Space Tracker Date Bug Fix..."
echo ""

# Navigate to project directory
cd /Users/jameslancelotair/Documents/Projects/Sea-Turtle-Space-Tracker

# Show what changed
echo "📝 Files changed:"
git status --short

echo ""
echo "📋 Commit message:"
cat << 'EOF'
fix: Use separate upcoming/past API endpoints and filter TBD placeholder dates

PROBLEM:
- All launches showing December 30, 2025 at 7:00 PM EST
- Stats showing 98 total, 0 successful, 98 upcoming
- API was returning 98+ "To Be Determined" launches with fake Dec 31, 2025 dates

SOLUTION:
- Split API calls: /launch/upcoming/ and /launch/previous/ separately
- Filter out status ID 2 (TBD - "To Be Determined") launches completely
- Updated isUpcoming() function to exclude TBD status

CHANGES:
- pages/api/spacex.js: Use parallel calls to upcoming/past endpoints, filter TBD
- components/SeaTurtleSpaceTrackerBranded.jsx: Remove status ID 2 from isUpcoming()

EXPECTED RESULTS:
- Upcoming: Real launches with varied actual dates
- Past: Real historical launches  
- Stats: ~50-100 total, ~500+ successful, ~10-30 upcoming

Fixes #1 (for real this time - the placeholder dates were the issue!)
EOF

echo ""
echo "🚀 Ready to commit and deploy!"
echo ""
echo "Run these commands:"
echo "  git add pages/api/spacex.js components/SeaTurtleSpaceTrackerBranded.jsx DATE_BUG_FIX.md"
echo "  git commit -m 'fix: Use separate upcoming/past API endpoints and filter TBD placeholder dates'"
echo "  git push"
echo ""
echo "Vercel will auto-deploy in ~2 minutes!"
echo "🐢🚀 The Space Turtles will have real data!"
