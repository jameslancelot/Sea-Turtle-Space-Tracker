# CLAUDE.md - Sea Turtle Space Tracker Architecture Guide

## Project Overview

The **Sea Turtle Space Tracker** is an educational web application designed for PVPV/Rawlings Elementary School in St. Johns County, Florida. It tracks real-time space launches from ALL global providers (SpaceX, Blue Origin, Rocket Lab, ULA, Arianespace, etc.) with a delightful sea turtle theme, connecting ocean exploration to space exploration for young students.

**Mission Statement**: "Surfing to Success - From the Ocean to the Stars!" 🐢🚀

## Tech Stack & Architecture

### Core Framework
- **Next.js 14.2.3** - React framework with SSR/SSG capabilities
- **React 18.3.1** - Component-based UI library
- **Node.js** - Runtime environment

### Styling & UI
- **Tailwind CSS 3.4.4** - Utility-first CSS framework
- **Lucide React 0.400.0** - Icon library for consistent iconography
- **QRCode.React 4.2.0** - QR code generation for print worksheets
- **Custom CSS animations** - Sea turtle and ocean-themed animations

### Data & APIs
- **Launch Library 2 API** - Primary data source for all global launch providers
- **Custom API proxy** - `/pages/api/spacex.js` handles CORS, pagination, and filtering
- **Pagination System** - Fetches 500+ launches (3 upcoming + 2 past pages)
- **No external databases** - Stateless architecture for simplicity

### Deployment
- **Vercel** - Primary hosting platform (configured via `vercel.json`)
- **GitHub integration** - Automated deployments from main branch

## Project Structure

**Key Files:**
- `/components/`: React components (main, map, print, swimming turtle)
- `/pages/api/spacex.js`: API proxy for Launch Library 2
- `/public/images/`: Logos and turtle markers
- `/styles/globals.css`: Custom animations and print styles
- Standard Next.js structure with Tailwind CSS

## Key Components Analysis

### Main Component: `SeaTurtleSpaceTrackerEnhanced.jsx`
- **Purpose**: Primary application component with professional enhanced layout
- **Features**:
  - Real-time launch data fetching (215+ launches across all providers)
  - Dynamic countdown timers
  - Advanced filtering (date, provider, rocket, mission type)
  - Enhanced search (13 searchable fields)
  - Map view with interactive launch sites
  - Sea turtle themed animations
  - Responsive design for school devices

### Interactive Map: `LaunchMapView.jsx`
- **Purpose**: World map showing launch sites with educational features
- **Features**:
  - Custom turtle marker icons (4 sizes based on launch count)
  - Swimming animated turtles across ocean paths
  - Print worksheet generation with QR codes
  - Interactive statistics and filtering
  - Mobile-responsive design

### Educational Components:
- **`PrintableMapView.jsx`**: Classroom worksheet with activities, discussion questions, and QR code for digital access
- **`SwimmingTurtle.jsx`**: Animated turtles with educational facts and pauseable swimming animations

### API Layer: `/pages/api/spacex.js`
- **Purpose**: Serverless API proxy to Launch Library 2 with pagination
- **Endpoints**:
  - `/api/spacex?resource=launches` - All launches (215+ with pagination)
  - `/api/spacex?resource=upcoming` - Upcoming launches only
  - `/api/spacex?resource=rockets` - Rocket configurations
  - `/api/spacex?resource=launchpads` - Launch pad information
- **Features**:
  - **API Pagination**: Fetches 3 upcoming + 2 past pages (500 total)
  - CORS handling for browser requests
  - Data filtering (removes TBD/placeholder dates)
  - Smart sorting (upcoming first, then by date)
  - Error handling and detailed logging
  - All global launch providers (not just SpaceX)

## Design System

### Theme
- **Colors**: Sea turtle themed (teal, orange, yellow, blue)
- **Animations**: Float, wave, swim wobble, pulse, hover effects
- **Typography**: Large fonts, high contrast, emoji integration, touch-friendly

## Development Guidelines

### Code Standards
- **Components**: Functional with hooks, PascalCase naming
- **API**: 5-minute fetch intervals, error handling with kid-friendly messages
- **Performance**: Image optimization, minimal dependencies, edge caching
- **Styling**: Tailwind classes + custom CSS animations

## Educational Features

### Learning Design
- **Age-Appropriate**: Simple language, visual icons, gamification
- **STEM Integration**: Space science, data literacy, geography, time concepts
- **School Identity**: Sea turtle mascot throughout experience

## Deployment & Workflow

### Production
- **Platform**: Vercel (auto-deployment from main branch)
- **Security**: Standard headers configured
- **API**: Launch Library 2 (no key required), graceful degradation

### Development
- **Local**: `npm run dev` (localhost:3000)
- **Testing**: Manual browser/device testing, API test scripts
- **Git**: Main branch with descriptive commit messages

## Customization Guidelines

### Feature Development
- **Educational Focus**: Age-appropriate content supporting learning objectives
- **Theme Consistency**: Maintain sea turtle/ocean motifs
- **Performance**: Consider school internet speeds

### Branding & API
- **Assets**: Update logos in `/public/images/`
- **Colors**: Modify `tailwind.config.js`
- **API**: Extend `/pages/api/spacex.js`, maintain kid-friendly error messages

## Troubleshooting Common Issues

### Known Issues
- **API Problems**: Check CORS proxy functionality and Launch Library 2 status
- **Deployment**: Verify dependency versions and build process
- **Performance**: Monitor image optimization and React re-renders

## Future Enhancement Ideas

### Planned Features
- **Time-lapse Animation**: Historical launch visualization
- **Launch Trajectory Arcs**: Orbital path visualization
- **Interactive Quizzes**: Space and ocean knowledge tests
- **Virtual Field Trips**: ISS tracking and space station tours
- **Classroom Integration**: Teacher dashboard and lesson plans

### Technical Improvements
- **PWA Support**: Offline capabilities for unreliable connections
- **Accessibility**: Screen reader support and keyboard navigation
- **Multi-Language**: Support for ESL students

---

**Created for PVPV/Rawlings Elementary School Sea Turtles**
*"Swimming through space and time, one launch at a time!" 🐢🚀*