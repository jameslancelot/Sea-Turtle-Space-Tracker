# CLAUDE.md - Sea Turtle Space Tracker Architecture Guide

## Project Overview

The **Sea Turtle Space Tracker** is an educational web application designed for PVPV/Rawlings Elementary School in St. Johns County, Florida. It tracks real-time SpaceX launches with a delightful sea turtle theme, connecting ocean exploration to space exploration for young students.

**Mission Statement**: "Surfing to Success - From the Ocean to the Stars!" 🐢🚀

## Tech Stack & Architecture

### Core Framework
- **Next.js 14.2.3** - React framework with SSR/SSG capabilities
- **React 18.3.1** - Component-based UI library
- **Node.js** - Runtime environment

### Styling & UI
- **Tailwind CSS 3.4.4** - Utility-first CSS framework
- **Lucide React 0.400.0** - Icon library for consistent iconography
- **Custom CSS animations** - Sea turtle and ocean-themed animations

### Data & APIs
- **Launch Library 2 API** - Primary data source for SpaceX launches
- **Custom API proxy** - `/pages/api/spacex.js` handles CORS and data filtering
- **No external databases** - Stateless architecture for simplicity

### Deployment
- **Vercel** - Primary hosting platform (configured via `vercel.json`)
- **GitHub integration** - Automated deployments from main branch

## Project Structure

```
sea-turtle-space-tracker/
├── components/                     # React components
│   ├── SeaTurtleSpaceTrackerBranded.jsx  # Main branded component (current)
│   ├── SeaTurtleSpaceTracker.jsx         # Base component
│   ├── SeaTurtleSpaceTrackerV2.jsx       # Alternative version
│   └── SpaceLaunchTracker.jsx            # Legacy component
├── pages/                         # Next.js pages and API routes
│   ├── api/
│   │   └── spacex.js             # API proxy for Launch Library 2
│   ├── _app.js                   # App wrapper
│   └── index.js                  # Home page
├── public/                       # Static assets
│   └── images/                   # Logos and graphics
│       ├── space-turtle-logo.png
│       ├── space-turtle-banner.png
│       └── NEW-LOGO.png
├── styles/
│   └── globals.css              # Global styles and animations
├── backup/                      # Component version history
├── package.json                 # Dependencies and scripts
├── tailwind.config.js          # Tailwind customization
├── next.config.js              # Next.js configuration
├── vercel.json                 # Vercel deployment config
└── postcss.config.js           # PostCSS configuration
```

## Key Components Analysis

### Main Component: `SeaTurtleSpaceTrackerBranded.jsx`
- **Purpose**: Primary application component with full branding
- **Features**:
  - Real-time launch data fetching
  - Dynamic countdown timers
  - Launch filtering (upcoming/past/by year)
  - Sea turtle themed animations
  - Responsive design for school devices

### API Layer: `/pages/api/spacex.js`
- **Purpose**: Serverless API proxy to Launch Library 2
- **Endpoints**:
  - `/api/spacex?resource=launches` - All SpaceX launches
  - `/api/spacex?resource=upcoming` - Upcoming launches only
  - `/api/spacex?resource=rockets` - Rocket configurations
  - `/api/spacex?resource=launchpads` - Launch pad information
- **Features**:
  - CORS handling for browser requests
  - Data filtering (removes placeholder dates beyond 2030)
  - Smart sorting (upcoming first, then by date)
  - Error handling and logging

## Design System

### Color Palette
```css
/* Sea turtle themed colors */
sea-green: {
  50: '#f0fdf4',   /* Lightest seafoam */
  500: '#22c55e',  /* Primary green */
  900: '#14532d'   /* Deep sea green */
}

ocean-blue: {
  50: '#eff6ff',   /* Light sky */
  500: '#3b82f6',  /* Ocean blue */
  900: '#1e3a8a'   /* Deep ocean */
}
```

### Animation System
- **Float animation** - 3s ease-in-out infinite for floating elements
- **Wave animation** - Ocean wave effects
- **Swim animation** - 8s turtle swimming motions
- **Launch animation** - Rocket launch trajectories

### Typography & Accessibility
- Large, readable fonts for elementary school age
- High contrast ratios for visibility
- Emoji integration for engagement
- Touch-friendly button sizing

## Development Guidelines

### Code Organization
1. **Component Structure**: Use functional components with hooks
2. **State Management**: useState and useEffect for local state
3. **API Calls**: Centralized in useEffect hooks with error handling
4. **Styling**: Tailwind classes with custom CSS for animations

### Naming Conventions
- **Components**: PascalCase (e.g., `SeaTurtleSpaceTracker`)
- **Files**: Match component names for clarity
- **CSS Classes**: kebab-case for custom classes
- **API Resources**: lowercase (launches, upcoming, rockets)

### Error Handling Patterns
```javascript
try {
  const response = await fetch('/api/spacex?resource=launches');
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  setLaunches(data);
} catch (error) {
  console.error('Failed to fetch launches:', error);
  setError('Unable to load launch data. Swimming back to try again!');
}
```

### Performance Considerations
- **Data Fetching**: 5-minute intervals to respect API limits
- **Image Optimization**: Next.js Image component for logos
- **Bundle Size**: Minimal dependencies, Tailwind CSS purging
- **Caching**: Vercel edge caching for static assets

## Educational Features

### Age-Appropriate Content
- **Simple Language**: Technical terms explained in kid-friendly ways
- **Visual Learning**: Icons and animations support comprehension
- **Gamification**: Countdown timers create excitement
- **School Connection**: Sea turtle mascot maintains school identity

### Learning Objectives
1. **STEM Education**: Space exploration and rocket science basics
2. **Data Literacy**: Reading launch schedules and mission information
3. **Geography**: Launch locations and mission destinations
4. **Time Concepts**: Countdown timers and date understanding

## Deployment & Maintenance

### Vercel Configuration
- **Framework**: Next.js auto-detected
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Environment**: Production optimizations enabled

### Security Headers
```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block"
}
```

### API Dependencies
- **Launch Library 2**: Primary data source (no API key required)
- **Backup Strategy**: Graceful degradation with cached data
- **Rate Limiting**: Built-in API proxy respects upstream limits

## Development Workflow

### Local Development
```bash
npm install          # Install dependencies
npm run dev         # Start development server (localhost:3000)
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint checks
```

### Git Workflow
- **Main Branch**: `main` (production-ready code)
- **Commits**: Descriptive messages with emoji for clarity
- **Deployment**: Automatic via Vercel on push to main

### Testing Strategy
- **Manual Testing**: Browser testing on school devices
- **API Testing**: `test-api.js` and `test-vercel-api.js` scripts
- **Device Testing**: Mobile and tablet responsiveness

## Customization Guidelines

### Adding New Features
1. **Educational Value**: Ensure features support learning objectives
2. **Age Appropriateness**: Content suitable for elementary students
3. **Theme Consistency**: Maintain sea turtle and ocean motifs
4. **Performance Impact**: Consider school internet speeds

### Branding Updates
- **Logo Changes**: Update files in `/public/images/`
- **Color Schemes**: Modify `tailwind.config.js`
- **Mascot Integration**: Update component text and imagery
- **School Information**: Maintain PVPV/Rawlings references

### API Extensions
- **New Endpoints**: Add to `/pages/api/spacex.js`
- **Data Sources**: Consider Launch Library 2 alternatives
- **Caching Strategy**: Implement for frequently accessed data
- **Error Handling**: Provide kid-friendly error messages

## Troubleshooting Common Issues

### API Problems
- **CORS Errors**: Ensure API proxy is functioning
- **Rate Limiting**: Check Launch Library 2 status
- **Data Quality**: Verify date filtering logic

### Deployment Issues
- **Build Failures**: Check dependency versions
- **Environment Variables**: None required for basic functionality
- **Domain Configuration**: Update school-specific settings

### Performance Issues
- **Slow Loading**: Optimize images and reduce API calls
- **Memory Usage**: Monitor React re-renders
- **Bundle Size**: Audit dependencies and unused code

## Future Enhancement Ideas

### Educational Expansion
- **Interactive Quizzes**: Space and ocean knowledge tests
- **Virtual Field Trips**: ISS tracking and space station tours
- **Classroom Integration**: Teacher dashboard and lesson plans

### Technical Improvements
- **Offline Support**: PWA capabilities for unreliable connections
- **Data Visualization**: Charts and graphs for launch statistics
- **Accessibility**: Screen reader support and keyboard navigation

### School Integration
- **Calendar Sync**: Integration with school event calendars
- **Multi-Language**: Support for ESL students
- **Parent Portal**: Take-home activities and family engagement

---

**Created for the Sea Turtles of PVPV/Rawlings Elementary School**
*"Swimming through space and time, one launch at a time!" 🐢🚀*

## Contact & Support

This application was designed with love for young learners. For technical support or educational suggestions, refer to the school's IT administration or the project documentation in this repository.