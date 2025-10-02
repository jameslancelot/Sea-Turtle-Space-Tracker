#!/bin/bash
# Browser Error Testing Script
# Uses Playwright MCP via Claude Code to detect console errors
# Part of the Sea Turtle Space Tracker deployment pipeline

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_color() {
    local color=$1
    shift
    echo -e "${color}$@${NC}"
}

# Configuration
URL="${1:-http://localhost:3000}"
TIMEOUT="${2:-30}"

print_color $BLUE "🎭 Browser Error Testing with Playwright MCP"
print_color $BLUE "═══════════════════════════════════════════════════════"
print_color $BLUE "Target URL: $URL"
print_color $BLUE "Timeout: ${TIMEOUT}s"
echo ""

# Check if URL is accessible
print_color $BLUE "🔍 Checking if URL is accessible..."
if ! curl -s "$URL" > /dev/null 2>&1; then
    print_color $RED "❌ URL is not accessible: $URL"
    print_color $YELLOW "Make sure the dev server is running:"
    print_color $YELLOW "  npm run dev"
    exit 1
fi

print_color $GREEN "✅ URL is accessible"
echo ""

# Instructions for manual Playwright MCP testing
print_color $YELLOW "📋 Manual Browser Testing Steps (via Claude Code):"
print_color $YELLOW ""
print_color $YELLOW "Since Playwright MCP tools are only available in Claude Code sessions,"
print_color $YELLOW "here's what you need to ask Claude Code to do:"
print_color $YELLOW ""
print_color $BLUE "1. Navigate to the app:"
print_color $YELLOW "   Use mcp__playwright__* tool to navigate to $URL"
print_color $YELLOW ""
print_color $BLUE "2. Check console messages:"
print_color $YELLOW "   Use browser_console_messages to capture any errors"
print_color $YELLOW ""
print_color $BLUE "3. Take screenshot if needed:"
print_color $YELLOW "   Use browser screenshot tool to capture the current state"
print_color $YELLOW ""
print_color $BLUE "4. Test critical pages:"
print_color $YELLOW "   - Home page (launch list view)"
print_color $YELLOW "   - Map view"
print_color $YELLOW "   - Launch detail modal"
print_color $YELLOW "   - Filter functionality"
print_color $YELLOW ""

# Basic validation without Playwright
print_color $BLUE "🔍 Running basic validation (non-Playwright)..."
echo ""

# Test home page
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
if [ "$HTTP_CODE" = "200" ]; then
    print_color $GREEN "✅ Home page responds with HTTP 200"
else
    print_color $RED "❌ Home page returned HTTP $HTTP_CODE"
    exit 1
fi

# Test if React app loads
CONTENT=$(curl -s "$URL" | head -100)
if echo "$CONTENT" | grep -q "Sea Turtle\|Space Tracker\|__NEXT_DATA__"; then
    print_color $GREEN "✅ Next.js/React app detected in HTML"
else
    print_color $YELLOW "⚠️  Could not detect Next.js app in HTML"
fi

# Check for common error patterns in HTML
if echo "$CONTENT" | grep -qi "error\|exception\|failed to compile"; then
    print_color $RED "❌ Possible error detected in HTML response"
    echo "$CONTENT" | grep -i "error\|exception\|failed"
    exit 1
else
    print_color $GREEN "✅ No obvious errors in HTML response"
fi

echo ""
print_color $GREEN "═══════════════════════════════════════════════════════"
print_color $GREEN "✅ Basic validation passed!"
print_color $GREEN "═══════════════════════════════════════════════════════"
echo ""

print_color $YELLOW "💡 For comprehensive browser testing with console error detection,"
print_color $YELLOW "ask Claude Code to run Playwright MCP browser tests during /git command"
print_color $YELLOW ""
print_color $YELLOW "The /git command will automatically perform browser testing when available."

exit 0
