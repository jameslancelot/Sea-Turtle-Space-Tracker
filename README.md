# 🐢🚀 Sea Turtle Space Tracker

**"Surfing to Success - From the Ocean to the Stars!"**

An educational web application designed for PVPV/Rawlings Elementary School in St. Johns County, Florida. Track real-time space launches from ALL global providers with a delightful sea turtle theme.

## 🌟 Features

### 🚀 Launch Tracking
- **215+ Confirmed Launches** - Comprehensive data across all providers
- **Global Providers**: SpaceX, Blue Origin, Rocket Lab, ULA, Arianespace, and more
- **Real-time Updates** - Live countdown timers and status updates
- **Smart Filtering** - Removes TBD placeholder dates

### 🗺️ Interactive Map
- **World Launch Sites** - Interactive map with turtle markers
- **Site Statistics** - Launch counts, success rates, and provider information
- **Educational Facts** - Swimming turtles with space/ocean learning content
- **Print Worksheets** - Classroom-ready activities with QR codes

### 🔍 Advanced Search & Filtering
- **13 Searchable Fields**: Mission, rocket, provider, location, country, status, description
- **Smart Filters**: Date (📅), Provider (🚀), Rocket (🛰️), Mission Type (🎯)
- **Compact Layout** - Single-line filter bar maximizes map viewing space
- **Full-width Search** - Dedicated search bar for comprehensive discovery

### 🎓 Educational Design
- **Age-Appropriate** - Simple language and visual icons for elementary students
- **STEM Integration** - Space science, geography, data literacy, time concepts
- **Sea Turtle Theme** - Consistent ocean-to-space educational metaphor
- **School Branding** - PVPV/Rawlings Elementary Sea Turtles identity

## 🏗️ Technical Architecture

### Frontend
- **Next.js 14.2.3** - React framework with SSR/SSG
- **Tailwind CSS 3.4.4** - Utility-first styling
- **Leaflet & React-Leaflet** - Interactive maps
- **Lucide React** - Consistent iconography

### Backend & Data
- **Launch Library 2 API** - Primary data source
- **API Pagination** - Fetches 500+ launches across 5 pages
- **Custom Proxy** - `/pages/api/spacex.js` handles CORS and filtering
- **Stateless Architecture** - No database required

### Deployment
- **Vercel** - Primary hosting platform
- **GitHub Integration** - Automated deployments
- **Production Ready** - Optimized builds and caching

## 🚀 Quick Start

### Option 1: Deploy to Vercel (Recommended)
1. Fork this repository
2. Connect to [Vercel](https://vercel.com)
3. Deploy automatically - no configuration needed!

### Option 2: Local Development
```bash
# Clone repository
git clone https://github.com/your-username/sea-turtle-space-tracker
cd sea-turtle-space-tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
sea-turtle-space-tracker/
├── components/
│   ├── SeaTurtleSpaceTrackerEnhanced.jsx    # Main app component
│   ├── LaunchMapView.jsx                    # Interactive world map
│   ├── LaunchDetailModal.jsx                # Launch detail popups
│   ├── PrintableMapView.jsx                 # Classroom worksheets
│   └── SwimmingTurtle.jsx                   # Educational animations
├── pages/
│   ├── api/spacex.js                        # API proxy with pagination
│   └── index.js                             # Next.js entry point
├── public/images/                           # Logos and turtle markers
├── styles/globals.css                       # Custom animations
└── CLAUDE.md                                # Detailed architecture guide
```

## 🔧 Key Features Detail

### API Pagination System
- **3 Upcoming Pages** (300 launches)
- **2 Past Pages** (200 launches)
- **500 Total Fetched** → 215+ confirmed after filtering
- **87% Data Increase** from previous version

### Enhanced Search
Searches across 13 fields:
- Mission name & description
- Rocket name & family
- Launch provider & abbreviation
- Launch pad & location
- Country code & status
- Mission type

### Filter System
- **📅 Date**: Combined year/month with optgroups
- **🚀 Provider**: All global space companies
- **🛰️ Rocket**: Vehicle types and configurations
- **🎯 Mission**: Mission types (Starlink, ISS, etc.)

## 🎨 Design System

### Colors
- **Primary**: Teal/cyan (ocean theme)
- **Secondary**: Orange/yellow (sea turtle colors)
- **Accent**: School colors integration

### Animations
- **Float effects** - Gentle sea-like motion
- **Swim wobble** - Turtle movement patterns
- **Pulse rings** - Upcoming launch indicators
- **Hover transitions** - Interactive feedback

## 🎓 Educational Integration

### Learning Objectives
- **Geography**: Global launch sites and countries
- **Time Concepts**: Countdown timers and scheduling
- **Data Literacy**: Filtering, searching, and statistics
- **Space Science**: Rockets, missions, and orbital mechanics
- **Ocean Connection**: Sea turtle migration parallels

### Classroom Features
- **Print Worksheets**: QR code access for digital/physical hybrid
- **Discussion Questions**: Space exploration and ocean conservation
- **Interactive Statistics**: Launch success rates and trends
- **Visual Learning**: Maps, icons, and color-coded information

## 🛠️ Configuration

### Environment Variables
None required! Uses free APIs with no authentication.

### Customization
- **Colors**: Update `tailwind.config.js`
- **School Branding**: Replace logos in `/public/images/`
- **Content**: Modify educational facts in components

## 📊 Performance

### Optimization Features
- **Edge Caching** - Vercel CDN optimization
- **Image Optimization** - Next.js automatic optimization
- **Code Splitting** - Lazy loading for map components
- **Cache Strategy** - 24-hour local storage with smart refresh

### Browser Support
- **Modern Browsers** - Chrome, Firefox, Safari, Edge
- **Mobile Responsive** - Tablets and smartphones
- **Accessibility** - Screen reader compatible

## 🔍 Troubleshooting

### Common Issues
- **Map Not Loading**: Check browser console for Leaflet errors
- **No Data**: Verify Launch Library 2 API status
- **Performance**: Clear browser cache, check internet connection

### Debug Features
- **Console Logging**: Detailed API fetch information
- **Error Boundaries**: Graceful failure handling
- **Fallback Data**: Sample data when API unavailable

## 🚀 Future Enhancements

### Planned Features
- **Launch Trajectory Arcs** - Orbital path visualization
- **Time-lapse Animation** - Historical launch timeline
- **Interactive Quizzes** - Space and ocean knowledge tests
- **Teacher Dashboard** - Classroom management tools

### Technical Improvements
- **PWA Support** - Offline capabilities
- **Multi-language** - ESL student support
- **Advanced Analytics** - Usage tracking for educators

## 📝 License

MIT License - Built for educational use at PVPV/Rawlings Elementary School

## 🤝 Contributing

Built with ❤️ for the Sea Turtles of PVPV/Rawlings Elementary School
"Swimming through space and time, one launch at a time!" 🐢🚀

---

**Last Updated**: October 1, 2025
**Version**: 3.1 - Enhanced with launch detail modals and refined UI