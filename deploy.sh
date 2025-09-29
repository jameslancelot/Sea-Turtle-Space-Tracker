#!/bin/bash

# Sea Turtle Space Tracker - Quick Deploy Script
# For PVPV/Rawlings Elementary School

echo "🐢🚀 Sea Turtle Space Tracker Deployment Helper"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "⚠️  Please run this script from the project root directory"
    echo "   (the folder containing package.json)"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "Choose your deployment method:"
echo "1) Test locally first (recommended)"
echo "2) Deploy to Vercel now"
echo "3) Push to GitHub"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🌊 Starting local development server..."
        echo "   Your Sea Turtle Space Tracker will open at http://localhost:3000"
        echo "   Press Ctrl+C to stop the server"
        npm run dev
        ;;
    2)
        echo "🚀 Preparing for Vercel deployment..."
        echo ""
        echo "Next steps:"
        echo "1. Install Vercel CLI: npm i -g vercel"
        echo "2. Run: vercel"
        echo "3. Follow the prompts to deploy!"
        echo ""
        read -p "Install Vercel CLI now? (y/n): " install_vercel
        if [ "$install_vercel" = "y" ]; then
            npm i -g vercel
            echo "✅ Vercel CLI installed! Run 'vercel' to deploy."
        fi
        ;;
    3)
        echo "📤 Preparing for GitHub..."
        echo ""
        # Initialize git if needed
        if [ ! -d ".git" ]; then
            git init
            echo "✅ Git initialized"
        fi
        
        # Add all files
        git add .
        
        # Create commit
        echo "Creating commit..."
        git commit -m "🐢🚀 Sea Turtle Space Tracker for PVPV/Rawlings Elementary"
        
        echo ""
        echo "✅ Ready for GitHub!"
        echo ""
        echo "Next steps:"
        echo "1. Create a new repository on GitHub.com"
        echo "2. Run: git remote add origin YOUR_GITHUB_URL"
        echo "3. Run: git push -u origin main"
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🐢 Happy tracking from the Sea Turtles! 🚀"
echo "Surfing to Success - From the Ocean to the Stars!"