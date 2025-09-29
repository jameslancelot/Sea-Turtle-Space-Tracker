# 🐢🚀 Sea Turtle Space Tracker

[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![SpaceX API](https://img.shields.io/badge/SpaceX-API-orange)](https://github.com/r-spacex/SpaceX-API)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An educational SpaceX launch tracker designed for **PVPV/Rawlings Elementary School** in St. Johns County, Florida. This interactive web application helps young students track real-time rocket launches while celebrating their Sea Turtle mascot!

**"Surfing to Success - From the Ocean to the Stars!"** 🌊⭐

## 🎯 Features

### 🚀 Real-Time Launch Tracking
- **Live SpaceX Data**: Fetches current launch information from the official SpaceX API
- **Countdown Timers**: Dynamic countdowns showing "Swimming Closer!" to upcoming launches
- **Launch History**: Browse past successful missions and learn from failures
- **Auto-Refresh**: Updates every 5 minutes to stay current

### 🐢 Sea Turtle Themed Design
- **Ocean-Inspired Colors**: Teal, cyan, and ocean blue color palette
- **Animated Elements**: Swimming turtles and wave animations
- **School Branding**: PVPV/Rawlings Elementary mascot integration
- **Kid-Friendly Interface**: Large buttons, clear text, and fun emojis

### 📚 Educational Content
- **Sea Turtle Space Facts**: Connecting ocean exploration with space exploration
- **Mission Details**: Learn about each launch's purpose and payload
- **Rocket Information**: Discover different SpaceX rocket types
- **Launch Locations**: Interactive information about launch sites

## 🖼️ Screenshots

![Sea Turtle Space Tracker Preview](https://images2.imgbox.com/eb/d8/D1Yywp0w_o.png)
*Preview of the Sea Turtle Space Tracker interface*

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) - React framework for production
- **UI Library**: [React 18](https://reactjs.org/) - Component-based UI
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful & consistent icons
- **Data Source**: [SpaceX API v5](https://github.com/r-spacex/SpaceX-API) - Free & open source
- **Deployment**: [Vercel](https://vercel.com/) - Optimized for Next.js

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/sea-turtle-space-tracker.git
cd sea-turtle-space-tracker
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open in browser**
```
http://localhost:3000
```

## 📦 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/sea-turtle-space-tracker)

1. Click the button above
2. Create a Vercel account (free)
3. Follow the deployment wizard
4. Your site will be live in 60 seconds!

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
sea-turtle-space-tracker/
├── components/
│   └── SeaTurtleSpaceTracker.jsx  # Main React component
├── pages/
│   ├── _app.js                    # Next.js app wrapper
│   └── index.js                   # Home page
├── styles/
│   └── globals.css                # Global styles & animations
├── public/
│   └── favicon.ico                # Sea turtle favicon
├── package.json                   # Dependencies
├── next.config.js                 # Next.js configuration
├── tailwind.config.js             # Tailwind configuration
└── vercel.json                    # Vercel deployment settings
```

## 🎨 Customization

### Change School Branding
Edit the header in `components/SeaTurtleSpaceTracker.jsx`:
```jsx
<p className="text-xl text-teal-700 font-medium">Your School Name</p>
<p className="text-lg text-teal-600 italic mt-1">"Your School Motto"</p>
```

### Modify Colors
Update the Tailwind config in `tailwind.config.js` to match your school colors.

### Add Features
- Weather integration for launch conditions
- ISS tracking overlay
- Student launch prediction contests
- Mission success statistics dashboard

## 🤝 Contributing

Contributions are welcome! This is an educational project perfect for:
- Parents wanting to contribute to school STEM programs
- Teachers adding educational content
- Students learning to code
- Developers improving functionality

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📚 Educational Use

This tracker is perfect for:
- **Science Classes**: Teaching about space exploration, physics, and technology
- **Math Classes**: Calculating trajectories, countdowns, and success rates
- **Geography**: Learning about launch sites and orbital mechanics
- **Environmental Science**: Connecting ocean conservation with space exploration
- **Computer Science**: Example of real-world API integration and web development

### Classroom Activities
- Track upcoming launches as a class
- Predict mission success based on weather and history
- Research mission payloads and purposes
- Calculate time zones for international launches
- Design mission patches for student "launches"

## 🌟 Acknowledgments

- **PVPV/Rawlings Elementary School** - For inspiring young minds to reach for the stars
- **SpaceX** - For making space exploration exciting and accessible
- **r/SpaceX Community** - For maintaining the free SpaceX API
- **Sea Turtles** - For teaching us that slow and steady wins the race to space!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **School Website**: [PVPV/Rawlings Elementary](https://www-pvmkr.stjohns.k12.fl.us/)
- **SpaceX API Documentation**: [GitHub](https://github.com/r-spacex/SpaceX-API)
- **Report Issues**: [GitHub Issues](https://github.com/yourusername/sea-turtle-space-tracker/issues)

## 📞 Contact

**Project Maintainer**: [Your Name]  
**School**: PVPV/Rawlings Elementary School  
**Location**: St. Johns County, Florida  

---

<div align="center">
  
**Made with 💙 by the Sea Turtles of PVPV/Rawlings Elementary**

🐢 **"Surfing to Success - From the Ocean to the Stars!"** 🚀

*Inspiring the next generation of ocean conservationists and space explorers*

</div>