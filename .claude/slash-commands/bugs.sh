#!/bin/bash
# Claude Code Custom Slash Command: /bugs
# Detects and auto-fixes code issues using CodeRabbit and linting tools

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

# Parse arguments
CATEGORY="${1:-all}"
OPTIONS="${@:2}"

# Show help if requested
if [ "$CATEGORY" = "help" ] || [ "$CATEGORY" = "--help" ]; then
    print_color $BLUE "🐛 /bugs - CodeRabbit Bug Detection for Claude Code"
    echo ""
    print_color $YELLOW "Usage: /bugs [category] [options]"
    echo ""
    print_color $YELLOW "Categories:"
    echo "  all         - Run all bug detection categories (default)"
    echo "  linting     - Check for ESLint issues"
    echo "  types       - Check for TypeScript errors"
    echo "  security    - Run security vulnerability scan"
    echo "  performance - Detect performance issues"
    echo "  coderabbit  - Run CodeRabbit AI analysis only"
    echo ""
    print_color $YELLOW "Options:"
    echo "  dry-run     - Preview changes without fixing"
    echo "  no-fix      - Detect issues without attempting fixes"
    echo "  verbose     - Show detailed output"
    echo ""
    print_color $YELLOW "Examples:"
    echo "  /bugs              - Find and fix all issues"
    echo "  /bugs linting      - Fix linting issues only"
    echo "  /bugs security     - Security-focused scan"
    echo "  /bugs all dry-run  - Preview all fixes"
    exit 0
fi

# Navigate to project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

print_color $BLUE "🐛 Claude Code Bug Detection System"
print_color $BLUE "═══════════════════════════════════════"
print_color $YELLOW "Category: $CATEGORY"
if [ -n "$OPTIONS" ]; then
    print_color $YELLOW "Options: $OPTIONS"
fi
echo ""

# Check if bugs-detector.sh exists
if [ ! -f "./scripts/bugs-detector.sh" ]; then
    print_color $RED "❌ Bug detector script not found!"
    print_color $YELLOW "Creating it now..."

    # The script should already exist from our earlier work
    # But if not, provide instructions
    print_color $YELLOW "Please ensure scripts/bugs-detector.sh exists"
    exit 1
fi

# Run the bug detection script
print_color $BLUE "🔍 Starting bug detection..."
echo ""

# Execute with options
if [ -n "$OPTIONS" ]; then
    ./scripts/bugs-detector.sh "$CATEGORY" $OPTIONS
else
    ./scripts/bugs-detector.sh "$CATEGORY"
fi

# Check exit code
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    print_color $GREEN "✅ Bug detection completed successfully!"
    print_color $BLUE "Check the report at: .coderabbit/bug-reports/latest/bug-report.html"
else
    echo ""
    print_color $RED "❌ Bug detection encountered issues (exit code: $EXIT_CODE)"
fi

# Provide follow-up suggestions
echo ""
print_color $YELLOW "💡 Next Steps:"
if [ "$CATEGORY" != "all" ]; then
    print_color $YELLOW "  • Run '/bugs all' for comprehensive scan"
fi
print_color $YELLOW "  • Review HTML report for detailed findings"
print_color $YELLOW "  • Use '/git safe' to commit fixes"
print_color $YELLOW "  • Run '/checkin' for full code review"

exit $EXIT_CODE