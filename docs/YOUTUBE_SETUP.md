# 🎥 YouTube API Integration Setup Guide

## Overview

The Sea Turtle Space Tracker now includes **intelligent YouTube video discovery** for all space launches! The system uses a 3-tier approach to ensure every launch has engaging video content for students.

### 3-Tier Video Discovery System

1. **Launch Library 2 Videos** (Tier 1 - Most Reliable)
   - Official videos from the Launch Library API
   - Highest priority, always used when available

2. **YouTube Data API Search** (Tier 2 - Auto-Discovery)
   - Automatically searches YouTube for relevant launch videos
   - Filters for embeddable, kid-safe content
   - Ranks results by quality and educational value

3. **Curated Video Library** (Tier 3 - Teacher-Approved Fallback)
   - Hand-picked educational videos in `/lib/curatedVideos.json`
   - Guaranteed safe and educational content
   - Teachers can add their favorite videos

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Your YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **YouTube Data API v3**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"

4. Create API credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key (you'll need this!)

5. **Restrict your API key** (Important for security):
   - Click on your new API key to edit it
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3" only
   - Save changes

### Step 2: Add API Key to Environment

#### For Vercel (Production):

1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add new variable:
   - **Name**: `YOUTUBE_API_KEY`
   - **Value**: Your API key from Step 1
   - **Environments**: Select all (Production, Preview, Development)
4. Click "Save"
5. Redeploy your app (Vercel will prompt you)

#### For Local Development:

1. Create `.env.local` file in project root:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your key:
   ```
   YOUTUBE_API_KEY=your_actual_api_key_here
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

### Step 3: Test It Out!

1. Open your app and navigate to the Map view
2. Click any launch card to open the detail modal
3. Go to the "Video" tab
4. You should see:
   - ✅ Video player with thumbnail
   - 🎬 Multiple video choices (if available)
   - 🐢 Educational learning context
   - ⭐ Star ratings for video quality

---

## 💰 API Quota & Cost

### Free Tier Limits
- **Daily Quota**: 10,000 units/day (FREE!)
- **Search Cost**: 100 units per search
- **Daily Capacity**: ~100 searches/day
- **Typical Usage**: 10-30 searches/day for a classroom

### Cost Optimization
The system includes multiple strategies to stay within free tier:

1. **24-Hour Caching**:
   - Client-side (localStorage): 24 hours
   - Edge caching (Vercel): 24 hours
   - Reduces API calls by ~90%

2. **Curated Fallbacks**:
   - Popular launches have pre-selected videos
   - No API calls needed for curated content

3. **Smart Search Queries**:
   - Optimized to find best videos quickly
   - Limits results to 5 videos max

4. **Monitor Usage**:
   - Check quota at: [Google Cloud Console - YouTube API Quotas](https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas)

**Expected Monthly Cost**: $0 (Free tier is sufficient for classroom use!)

---

## 🎓 Features for 9-Year-Olds

### Visual Learning
- ✅ **Large Thumbnails**: Easy to see and click
- 🌈 **Color-Coded Badges**: Official, Educational Pick, Community
- ⭐ **Star Ratings**: Visual quality indicator (1-5 stars)

### Choice & Agency
- 🎬 **Multiple Videos**: Kids choose what they want to watch
- 🔍 **Video Comparison**: See different perspectives
- 🎯 **Best Match First**: Top-rated videos appear first

### Educational Context
- 🐢 **Sea Turtle Tips**: Fun, age-appropriate explanations
- 🎯 **Key Moments**: Highlights important timestamps
- 💡 **Learning Goals**: Clear educational objectives
- ⏰ **Fun Challenges**: Interactive viewing activities

### Safety First
- ✅ **Embeddable Only**: Only videos that can be embedded
- 🔒 **Strict Safe Search**: YouTube's strict safety filter
- 🎓 **Curated Library**: Teacher-approved fallback content
- 👨‍🏫 **Official Channels**: Prioritizes NASA, SpaceX, ESA, etc.

---

## 📚 Managing Curated Videos

### Adding New Videos

Edit `/lib/curatedVideos.json` to add teacher-approved videos:

```json
{
  "my-special-launch-id": {
    "videoId": "VIDEO_ID_HERE",
    "url": "https://www.youtube.com/watch?v=VIDEO_ID_HERE",
    "title": "Kid-Friendly Title Here",
    "channel": "Official Channel Name",
    "description": "Why this video is educational",
    "thumbnail": "https://img.youtube.com/vi/VIDEO_ID_HERE/maxresdefault.jpg",
    "duration": "5:23",
    "ageAppropriate": true,
    "featured": true
  }
}
```

### Default Videos by Rocket Type

The system includes defaults for:
- `falcon-9-default`: SpaceX Falcon 9 launches
- `starship-default`: SpaceX Starship
- `atlas-v-default`: ULA Atlas V
- `electron-default`: Rocket Lab Electron
- `sls-artemis`: NASA Artemis missions
- `crew-dragon-default`: ISS crew missions
- And more!

### Educational Videos

Special educational content:
- `educational-how-rockets-work`: Rocket science for kids
- `educational-space-station`: ISS tour for students

---

## 🔧 Troubleshooting

### "YouTube API not configured" Error

**Problem**: API key not set or not accessible

**Solutions**:
1. Check `.env.local` file exists (local dev)
2. Verify `YOUTUBE_API_KEY` in Vercel settings (production)
3. Restart dev server or redeploy to Vercel
4. Check API key doesn't have typos or extra spaces

### "API quota exceeded" Error

**Problem**: Used more than 10,000 units in 24 hours

**Solutions**:
1. Wait 24 hours for quota reset (resets at midnight Pacific Time)
2. Add more curated videos to reduce API dependency
3. Clear localStorage cache: Run in browser console:
   ```javascript
   localStorage.clear();
   ```
4. Consider upgrading to paid tier (if needed for high-traffic)

### Videos Not Appearing

**Problem**: No videos show up for a launch

**Possible Causes**:
1. **No API key**: Videos fall back to curated library only
2. **Launch too new**: Videos not uploaded yet - check back later
3. **Search failed**: Check browser console for errors
4. **Cache issue**: Clear browser cache and localStorage

**Debug Steps**:
```javascript
// Open browser console (F12) and run:
import { getLaunchVideos } from './lib/youtubeService';
getLaunchVideos(yourLaunchObject).then(console.log);
```

### Video Won't Play

**Problem**: Thumbnail shows but video doesn't play

**Solutions**:
1. Check if video is embeddable (some videos block embedding)
2. Try a different video from the gallery
3. Open video on YouTube directly (link in error state)
4. Check browser console for CORS or embed policy errors

---

## 📊 Monitoring & Analytics

### Check API Usage

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Dashboard"
3. Click "YouTube Data API v3"
4. View "Quotas" tab to see daily usage

### Success Metrics

Monitor these indicators in browser console:

```javascript
// Videos from each tier
✅ Found Launch Library videos: X
🔍 Found YouTube search results: X
📚 Found curated video: 1

// Cache performance
📦 Using cached YouTube results
🎯 Cache hit rate: ~70-90%
```

### Performance Tips

1. **Pre-populate curated library** for popular launches
2. **Monitor quota** especially during high-traffic periods
3. **Clear old caches** periodically to free storage
4. **Test locally** before deploying to reduce production API calls

---

## 🎯 Best Practices for Teachers

### Before Class
1. Test a few launches to ensure videos are appropriate
2. Add specific videos you want to use to curated library
3. Check that API quota hasn't been exceeded

### During Class
1. Let students choose videos (builds decision-making)
2. Use "Key Moments" to focus attention
3. Discuss "Sea Turtle Tips" for educational value
4. Try "Fun Challenges" for interactive learning

### After Class
1. Add any great videos you found to curated library
2. Note which launches students enjoyed most
3. Update curated videos based on new missions

---

## 🚀 Advanced Configuration

### Custom Search Parameters

Edit `/pages/api/youtube-search.js` to customize:

```javascript
// Adjust video length filter
videoDuration: 'medium'  // short (< 4min), medium (4-20min), long (> 20min)

// Change result count
maxResults: 5  // Max videos per search (1-10)

// Modify sort order
order: 'relevance'  // relevance, date, rating, viewCount
```

### Channel Whitelist

Add trusted channels in `/lib/youtubeService.js`:

```javascript
const OFFICIAL_CHANNELS = [
  'NASA',
  'SpaceX',
  'Your Custom Channel Here',
  // ... more channels
];
```

### Custom Video Ranking

Modify `calculateKidRating()` in `/lib/youtubeService.js` to adjust how videos are ranked:

```javascript
// Boost educational content
if (title.includes('explained')) {
  rating += 1;
}

// Your custom logic here
```

---

## 📝 Support & Resources

### Documentation
- Main docs: `/docs/CLAUDE.md`
- Plan details: `/plan.md`
- Change log: `/docs/changelog.md`

### API Resources
- [YouTube Data API v3 Docs](https://developers.google.com/youtube/v3)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)

### Need Help?
- Check browser console for error messages
- Review `/pages/api/youtube-search.js` logs in Vercel
- Test API key with curl:
  ```bash
  curl "https://www.googleapis.com/youtube/v3/search?part=snippet&q=SpaceX&key=YOUR_KEY"
  ```

---

## ✅ Setup Checklist

- [ ] YouTube Data API v3 enabled in Google Cloud
- [ ] API key created and restricted to YouTube API
- [ ] `YOUTUBE_API_KEY` added to Vercel environment
- [ ] `.env.local` created for local development
- [ ] App redeployed/restarted after adding key
- [ ] Test launch video working in modal
- [ ] Video gallery showing multiple options
- [ ] Educational context displaying properly
- [ ] Curated videos loaded as fallback
- [ ] Cache working (check browser localStorage)

---

🐢 **"From Ocean Videos to Space Videos!"** 🚀

*Developed for PVPV/Rawlings Elementary School Sea Turtles*
