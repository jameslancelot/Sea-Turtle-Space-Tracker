#!/bin/bash
# Claude Code Custom Slash Command: /git
# Enhanced git workflow with CodeRabbit code review

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
MODE="${1:-safe}"
MESSAGE="${@:2}"

# Show help if requested
if [ "$MODE" = "help" ] || [ "$MODE" = "--help" ]; then
    print_color $BLUE "🚀 /git - Enhanced Git Workflow for Claude Code"
    echo ""
    print_color $YELLOW "Usage: /git [mode] [commit-message]"
    echo ""
    print_color $YELLOW "Modes:"
    echo "  quick  - Fast review with AI feedback (default for rapid iteration)"
    echo "  safe   - Standard review with warnings (recommended)"
    echo "  strict - Review blocks on issues (for critical changes)"
    echo "  skip   - Skip CodeRabbit entirely (emergency only)"
    echo "  force  - Force commit bypassing all checks (use with caution)"
    echo ""
    print_color $YELLOW "Examples:"
    echo "  /git                           - Safe mode with auto-generated message"
    echo "  /git quick                     - Quick mode with auto-generated message"
    echo "  /git safe \"feat: new feature\"  - Safe mode with custom message"
    echo "  /git strict \"fix: security\"    - Strict mode for critical fixes"
    echo ""
    print_color $YELLOW "Environment Variables:"
    echo "  CODERABBIT_MODE - Default review mode"
    echo "  SKIP_CODERABBIT - Skip CodeRabbit review"
    echo "  FORCE_COMMIT    - Force commit despite issues"
    exit 0
fi

# Navigate to project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

print_color $BLUE "🚀 Claude Code Enhanced Git Workflow"
print_color $BLUE "════════════════════════════════════"
print_color $YELLOW "Mode: $MODE"
if [ -n "$MESSAGE" ]; then
    print_color $YELLOW "Message: $MESSAGE"
else
    print_color $YELLOW "Message: Will be auto-generated"
fi
echo ""

# Check if git script exists
if [ ! -f "./scripts/git-with-coderabbit.sh" ]; then
    print_color $RED "❌ Git script not found!"
    print_color $YELLOW "Please ensure scripts/git-with-coderabbit.sh exists"
    exit 1
fi

# Check for changes
if ! git status --porcelain | grep -q .; then
    print_color $GREEN "✅ No changes to commit"
    exit 0
fi

# Show what will be committed
print_color $BLUE "📋 Files to be committed:"
git status --short
echo ""

# Confirm with user for strict mode
if [ "$MODE" = "strict" ]; then
    print_color $YELLOW "⚠️  Strict mode will block commit if any issues are found."
    print_color $YELLOW "Continue? (Press Ctrl+C to cancel)"
    read -t 5 -p "" || true
    echo ""
fi

# Run the git script
print_color $BLUE "🐰 Running CodeRabbit review and git operations..."
echo ""

# Execute with message if provided
if [ -n "$MESSAGE" ]; then
    ./scripts/git-with-coderabbit.sh "$MODE" "$MESSAGE"
else
    ./scripts/git-with-coderabbit.sh "$MODE"
fi

# Check exit code
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    print_color $GREEN "🎉 Git operation completed successfully!"

    # Show current branch and suggest next steps
    CURRENT_BRANCH=$(git branch --show-current)
    print_color $BLUE "Current branch: $CURRENT_BRANCH"

    if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
        print_color $YELLOW ""
        print_color $YELLOW "💡 Next steps:"
        print_color $YELLOW "  • Create a PR on GitHub"
        print_color $YELLOW "  • Run '/bugs all' on main after merging"
    fi
else
    echo ""
    print_color $RED "❌ Git operation failed (exit code: $EXIT_CODE)"
    print_color $YELLOW ""
    print_color $YELLOW "💡 Suggestions:"
    print_color $YELLOW "  • Run '/bugs all' to fix issues"
    print_color $YELLOW "  • Use '/git force' to bypass checks (not recommended)"
    print_color $YELLOW "  • Review the output above for specific errors"
fi

exit $EXIT_CODE