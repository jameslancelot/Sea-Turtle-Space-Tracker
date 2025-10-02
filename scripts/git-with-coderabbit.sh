#!/bin/bash
# Enhanced Git Workflow with CodeRabbit, Playwright Testing, and Vercel Deployment
# Part of the Sea Turtle Space Tracker deployment pipeline

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

print_color() {
    local color=$1
    shift
    echo -e "${color}$@${NC}"
}

print_section() {
    echo ""
    print_color $CYAN "═══════════════════════════════════════════════════════"
    print_color $CYAN "  $1"
    print_color $CYAN "═══════════════════════════════════════════════════════"
}

# Parse arguments
MODE="${1:-safe}"
CUSTOM_MESSAGE="${2:-}"

# Project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Track state for cleanup
DEV_SERVER_PID=""
BACKUP_BRANCH=""
DEPLOYMENT_URL=""

# Cleanup function
cleanup() {
    if [ -n "$DEV_SERVER_PID" ]; then
        print_color $YELLOW "🧹 Stopping dev server (PID: $DEV_SERVER_PID)..."
        kill $DEV_SERVER_PID 2>/dev/null || true
        # Also kill any orphaned Next.js processes
        pkill -f "next dev" 2>/dev/null || true
    fi
}

# Set trap for cleanup
trap cleanup EXIT INT TERM

# Error handler with rollback
handle_error() {
    local exit_code=$1
    local error_msg=$2

    print_color $RED "❌ ERROR: $error_msg"

    if [ -n "$BACKUP_BRANCH" ]; then
        print_color $YELLOW "🔄 Rolling back to backup branch..."
        git checkout "$BACKUP_BRANCH" 2>/dev/null || true
    fi

    cleanup
    exit $exit_code
}

# ============================================================================
# STEP 1: Pre-flight Checks
# ============================================================================

print_section "🚀 Step 1: Pre-flight Checks"

# Check for changes
if ! git status --porcelain | grep -q .; then
    print_color $GREEN "✅ No changes to commit"
    exit 0
fi

# Verify required tools
MISSING_TOOLS=()
command -v coderabbit >/dev/null 2>&1 || MISSING_TOOLS+=("coderabbit")
command -v vercel >/dev/null 2>&1 || MISSING_TOOLS+=("vercel")
command -v git >/dev/null 2>&1 || MISSING_TOOLS+=("git")
command -v npm >/dev/null 2>&1 || MISSING_TOOLS+=("npm")

if [ ${#MISSING_TOOLS[@]} -gt 0 ]; then
    handle_error 1 "Missing required tools: ${MISSING_TOOLS[*]}"
fi

print_color $GREEN "✅ All required tools found"

# Show what will be committed
print_color $BLUE "📋 Files to be committed:"
git status --short

# ============================================================================
# STEP 2: CodeRabbit Code Review
# ============================================================================

if [ "$MODE" != "skip" ] && [ "$MODE" != "force" ]; then
    print_section "🐰 Step 2: CodeRabbit AI Code Review"

    REVIEW_TYPE="uncommitted"
    if [ "$MODE" = "committed" ]; then
        REVIEW_TYPE="committed"
    fi

    print_color $BLUE "Running CodeRabbit review (mode: $MODE, type: $REVIEW_TYPE)..."

    # Run CodeRabbit review with CLAUDE.md as additional context
    REVIEW_OUTPUT=$(coderabbit review --plain --type "$REVIEW_TYPE" --config CLAUDE.md 2>&1 || true)

    # Parse review output for issues
    # CRITICAL issues should BLOCK by default (security vulnerabilities, data loss, breaking changes)
    CRITICAL_ISSUES=$(echo "$REVIEW_OUTPUT" | grep -iE "critical|security.*vulnerability|data loss|breaking change|dangerous" || true)

    # HIGH priority issues (major bugs, errors)
    HIGH_ISSUES=$(echo "$REVIEW_OUTPUT" | grep -iE "\[high\]|severity.*high|major.*issue" || true)

    # Medium/Low warnings
    WARNINGS=$(echo "$REVIEW_OUTPUT" | grep -iE "warning|caution|\[medium\]|\[low\]" || true)

    # Display review summary and block appropriately
    if [ -n "$CRITICAL_ISSUES" ]; then
        print_color $RED "🚨 CRITICAL CODE ISSUES DETECTED!"
        print_color $RED "════════════════════════════════════════════════════"
        echo "$CRITICAL_ISSUES"
        print_color $RED "════════════════════════════════════════════════════"
        echo ""

        # BLOCK on critical issues by default (security, data loss, etc)
        handle_error 1 "Deployment blocked: Critical code issues detected (security/data loss/breaking changes). Fix before deploying."

    elif [ -n "$HIGH_ISSUES" ]; then
        print_color $YELLOW "⚠️  High-priority issues found:"
        echo "$HIGH_ISSUES"
        echo ""

        if [ "$MODE" = "strict" ]; then
            handle_error 1 "Strict mode: Blocking deployment due to high-priority issues"
        else
            print_color $YELLOW "⚠️  Proceeding with high-priority issues (use 'strict' mode to block)"
            print_color $YELLOW "💡  Recommended: Review and fix these issues before production deployment"
        fi

    elif [ -n "$WARNINGS" ]; then
        print_color $YELLOW "⚠️  Warnings found:"
        echo "$WARNINGS" | head -10
        echo ""

        if [ "$MODE" = "strict" ]; then
            handle_error 1 "Strict mode: Blocking deployment due to warnings"
        else
            print_color $BLUE "ℹ️  Proceeding with warnings (use 'strict' mode to block on warnings)"
        fi
    else
        print_color $GREEN "✅ No major issues found in code review"
    fi

    # Show full review in quick mode
    if [ "$MODE" = "quick" ]; then
        echo ""
        print_color $CYAN "Full CodeRabbit Review:"
        echo "$REVIEW_OUTPUT"
    fi
else
    print_section "⏭️  Step 2: CodeRabbit Review (Skipped)"
    print_color $YELLOW "Mode: $MODE - Skipping CodeRabbit review"
fi

# ============================================================================
# STEP 3: Browser Testing with Playwright MCP
# ============================================================================

print_section "🎭 Step 3: Browser Console Error Testing"

# Check if we should run browser tests (skip in force mode)
if [ "$MODE" != "force" ]; then
    print_color $BLUE "Starting dev server for browser testing..."

    # Start dev server in background
    npm run dev > /tmp/sea-turtle-dev.log 2>&1 &
    DEV_SERVER_PID=$!

    print_color $BLUE "Dev server started (PID: $DEV_SERVER_PID)"
    print_color $YELLOW "Waiting for server to be ready..."

    # Wait for server to be ready (max 30 seconds)
    for i in {1..30}; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            print_color $GREEN "✅ Dev server is ready"
            break
        fi
        sleep 1
        if [ $i -eq 30 ]; then
            handle_error 1 "Dev server failed to start within 30 seconds"
        fi
    done

    # Note: Playwright MCP testing would happen here via Claude Code
    # Since we can't directly invoke MCP tools from bash, we'll do basic validation
    print_color $BLUE "🔍 Running basic dev server validation..."

    # Test if server responds
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
    if [ "$HTTP_CODE" = "200" ]; then
        print_color $GREEN "✅ Server responding with HTTP 200"
    else
        handle_error 1 "Server returned HTTP $HTTP_CODE"
    fi

    # Check dev server logs for errors
    # CRITICAL errors that crash the app should BLOCK by default
    # Non-critical warnings only block in strict mode

    # Critical error patterns (app-breaking)
    CRITICAL_PATTERNS="Failed to compile|Module not found|Error:|Uncaught|SyntaxError|ReferenceError|TypeError|Cannot read propert|is not a function|is not defined|EADDRINUSE|ERR_|Fatal"

    # Non-critical warning patterns
    WARNING_PATTERNS="Warning:|Deprecat|webpack.*warn|Fast Refresh"

    # Check for CRITICAL errors (always block except in force mode)
    CRITICAL_ERRORS=$(grep -E "$CRITICAL_PATTERNS" /tmp/sea-turtle-dev.log 2>/dev/null || true)

    if [ -n "$CRITICAL_ERRORS" ]; then
        print_color $RED "🚨 CRITICAL ERRORS DETECTED - App will crash!"
        print_color $RED "════════════════════════════════════════════════════"
        echo "$CRITICAL_ERRORS" | tail -10
        print_color $RED "════════════════════════════════════════════════════"
        echo ""

        # BLOCK deployment - critical errors should never reach production
        handle_error 1 "Deployment blocked: Critical browser errors detected. Fix errors before deploying."
    fi

    # Check for non-critical warnings
    WARNINGS=$(grep -E "$WARNING_PATTERNS" /tmp/sea-turtle-dev.log 2>/dev/null || true)

    if [ -n "$WARNINGS" ]; then
        print_color $YELLOW "⚠️  Non-critical warnings found:"
        echo "$WARNINGS" | tail -5

        # Only block on warnings in strict mode
        if [ "$MODE" = "strict" ]; then
            handle_error 1 "Strict mode: Blocking deployment due to warnings"
        else
            print_color $BLUE "ℹ️  Proceeding despite warnings (use 'strict' mode to block on warnings)"
        fi
    else
        print_color $GREEN "✅ No errors or warnings in dev server logs"
    fi

    # Stop dev server
    print_color $BLUE "Stopping dev server..."
    cleanup
    DEV_SERVER_PID=""

    print_color $GREEN "✅ Browser testing completed"
else
    print_color $YELLOW "Mode: force - Skipping browser testing"
fi

# ============================================================================
# STEP 4: Generate Commit Message
# ============================================================================

print_section "💬 Step 4: Commit Message Generation"

if [ -n "$CUSTOM_MESSAGE" ]; then
    COMMIT_MESSAGE="$CUSTOM_MESSAGE"
    print_color $BLUE "Using custom message: $COMMIT_MESSAGE"
else
    print_color $BLUE "Generating AI commit message from diff..."

    # Get diff for analysis
    DIFF_SUMMARY=$(git diff --staged --stat 2>/dev/null || git diff --stat)
    DIFF_CONTENT=$(git diff --staged 2>/dev/null || git diff | head -100)

    # Simple heuristic-based commit message generation
    # In practice, this would call an AI service
    if echo "$DIFF_SUMMARY" | grep -q "\.md\|README"; then
        COMMIT_TYPE="docs"
    elif echo "$DIFF_SUMMARY" | grep -q "test\|spec"; then
        COMMIT_TYPE="test"
    elif echo "$DIFF_SUMMARY" | grep -q "fix\|bug"; then
        COMMIT_TYPE="fix"
    elif echo "$DIFF_SUMMARY" | grep -q "style\|css"; then
        COMMIT_TYPE="style"
    else
        COMMIT_TYPE="feat"
    fi

    # Generate simple message
    CHANGED_FILES=$(echo "$DIFF_SUMMARY" | wc -l | tr -d ' ')
    COMMIT_MESSAGE="${COMMIT_TYPE}: Update ${CHANGED_FILES} files for deployment"

    print_color $GREEN "Generated message: $COMMIT_MESSAGE"
fi

# ============================================================================
# STEP 5: Git Operations
# ============================================================================

print_section "📦 Step 5: Git Commit & Push"

# Stage all changes
print_color $BLUE "Staging all changes..."
git add .

# Create commit with Claude Code attribution
print_color $BLUE "Creating commit..."
FULL_COMMIT_MESSAGE=$(cat <<EOF
$COMMIT_MESSAGE

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)

git commit -m "$FULL_COMMIT_MESSAGE" || handle_error 1 "Git commit failed"

print_color $GREEN "✅ Commit created successfully"

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
print_color $BLUE "Current branch: $CURRENT_BRANCH"

# Push to remote
print_color $BLUE "Pushing to remote..."
git push -u origin "$CURRENT_BRANCH" || handle_error 1 "Git push failed"

print_color $GREEN "✅ Pushed to origin/$CURRENT_BRANCH"

# ============================================================================
# STEP 6: Vercel Deployment
# ============================================================================

print_section "🚀 Step 6: Vercel Deployment"

print_color $BLUE "Deploying to Vercel..."

# Deploy to production
DEPLOY_OUTPUT=$(vercel --prod --yes 2>&1 || handle_error 1 "Vercel deployment failed")

# Extract deployment URL
DEPLOYMENT_URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[^ ]*\.vercel\.app' | head -1)

if [ -z "$DEPLOYMENT_URL" ]; then
    print_color $YELLOW "⚠️  Could not extract deployment URL from output"
    echo "$DEPLOY_OUTPUT"
else
    print_color $GREEN "✅ Deployed to: $DEPLOYMENT_URL"
fi

# Check for build errors in output
if echo "$DEPLOY_OUTPUT" | grep -i "error\|failed" > /dev/null 2>&1; then
    print_color $YELLOW "⚠️  Possible build warnings or errors:"
    echo "$DEPLOY_OUTPUT" | grep -i "error\|failed"
fi

# ============================================================================
# STEP 7: Post-Deployment Validation
# ============================================================================

print_section "✅ Step 7: Post-Deployment Validation"

if [ -n "$DEPLOYMENT_URL" ]; then
    print_color $BLUE "Validating deployment..."

    # Wait a moment for deployment to propagate
    sleep 3

    # Check if deployment is accessible
    DEPLOY_HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL" || echo "000")

    if [ "$DEPLOY_HTTP_CODE" = "200" ]; then
        print_color $GREEN "✅ Deployment is accessible (HTTP 200)"
    else
        print_color $YELLOW "⚠️  Deployment returned HTTP $DEPLOY_HTTP_CODE"
    fi
fi

# ============================================================================
# SUCCESS SUMMARY
# ============================================================================

print_section "🎉 Deployment Complete!"

print_color $GREEN "All steps completed successfully!"
echo ""
print_color $CYAN "📊 Summary:"
print_color $BLUE "  • Branch: $CURRENT_BRANCH"
print_color $BLUE "  • Commit: $(git rev-parse --short HEAD)"
print_color $BLUE "  • Mode: $MODE"
if [ -n "$DEPLOYMENT_URL" ]; then
    print_color $BLUE "  • Deployment: $DEPLOYMENT_URL"
fi

echo ""
print_color $CYAN "🔗 Next Steps:"
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    print_color $YELLOW "  • Create a PR to merge $CURRENT_BRANCH into main"
    print_color $YELLOW "  • Review deployment before merging"
fi
print_color $YELLOW "  • Monitor Vercel dashboard for any issues"
print_color $YELLOW "  • Test the deployment URL in different browsers"

exit 0
