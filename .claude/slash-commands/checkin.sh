#!/bin/bash
# Claude Code Custom Slash Command: /checkin
# Comprehensive code review and quality check workflow

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_color() {
    local color=$1
    shift
    echo -e "${color}$@${NC}"
}

# Parse arguments
SCOPE="${1:-standard}"

# Show help if requested
if [ "$SCOPE" = "help" ] || [ "$SCOPE" = "--help" ]; then
    print_color $BLUE "✅ /checkin - Comprehensive Code Quality Check"
    echo ""
    print_color $YELLOW "Usage: /checkin [scope]"
    echo ""
    print_color $YELLOW "Scopes:"
    echo "  quick    - Basic checks only (fastest)"
    echo "  standard - Standard checks (default)"
    echo "  full     - All checks including security"
    echo "  security - Security-focused review"
    echo ""
    print_color $YELLOW "What it does:"
    echo "  1. Runs CodeRabbit AI review"
    echo "  2. Checks for linting issues"
    echo "  3. Validates TypeScript types"
    echo "  4. Runs security scans (full/security scope)"
    echo "  5. Checks database migrations"
    echo "  6. Runs tests (if configured)"
    echo ""
    print_color $YELLOW "Examples:"
    echo "  /checkin           - Standard comprehensive review"
    echo "  /checkin full      - Complete review with security"
    echo "  /checkin quick     - Quick checks before commit"
    exit 0
fi

# Navigate to project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

print_color $BLUE "✅ Claude Code Comprehensive Checkin"
print_color $BLUE "════════════════════════════════════"
print_color $YELLOW "Scope: $SCOPE"
echo ""

# Track results
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNINGS=0

# Function to run a check
run_check() {
    local check_name=$1
    local check_command=$2
    local is_critical=${3:-true}

    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    print_color $CYAN "🔍 $check_name..."

    if eval "$check_command" > /dev/null 2>&1; then
        print_color $GREEN "   ✅ Passed"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        if [ "$is_critical" = "true" ]; then
            print_color $RED "   ❌ Failed"
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
        else
            print_color $YELLOW "   ⚠️  Warning"
            WARNINGS=$((WARNINGS + 1))
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
        fi
        return 1
    fi
}

# Check if required tools exist
if [ ! -f "./scripts/code-review-helper.sh" ]; then
    print_color $YELLOW "⚠️  CodeRabbit helper script not found, some checks will be skipped"
fi

print_color $BLUE "Starting comprehensive checkin..."
echo ""

# Step 1: CodeRabbit Review
if [ -f "./scripts/code-review-helper.sh" ]; then
    if [ "$SCOPE" = "quick" ]; then
        run_check "CodeRabbit Quick Review" "./scripts/code-review-helper.sh auto"
    else
        run_check "CodeRabbit Comprehensive Review" "./scripts/code-review-helper.sh feature-complete all"
    fi
else
    print_color $YELLOW "   ⏭️  Skipping CodeRabbit (script not found)"
fi

# Step 2: Linting
if command -v pnpm &> /dev/null; then
    run_check "ESLint Check" "pnpm lint"
else
    print_color $YELLOW "   ⏭️  Skipping lint check (pnpm not found)"
fi

# Step 3: Type Checking
if command -v pnpm &> /dev/null; then
    run_check "TypeScript Check" "pnpm type-check"
else
    print_color $YELLOW "   ⏭️  Skipping type check (pnpm not found)"
fi

# Step 4: Security (for full/security scope)
if [ "$SCOPE" = "full" ] || [ "$SCOPE" = "security" ]; then
    if [ -f "./scripts/bugs-detector.sh" ]; then
        run_check "Security Scan" "./scripts/bugs-detector.sh security no-fix"
    else
        print_color $YELLOW "   ⏭️  Skipping security scan (bugs detector not found)"
    fi

    # npm audit if available
    if command -v npm &> /dev/null; then
        run_check "Dependency Vulnerabilities" "npm audit --audit-level=moderate" false
    fi
fi

# Step 5: Database Checks
if command -v pnpm &> /dev/null && [ -f "package.json" ]; then
    if grep -q '"db:check"' package.json; then
        run_check "Database Schema Check" "pnpm db:check" false
    fi
fi

# Step 6: Tests (if quick scope is not selected)
if [ "$SCOPE" != "quick" ]; then
    if command -v pnpm &> /dev/null && [ -f "package.json" ]; then
        if grep -q '"test"' package.json; then
            print_color $CYAN "🔍 Running tests..."
            if pnpm test 2>/dev/null; then
                print_color $GREEN "   ✅ Tests passed"
                PASSED_CHECKS=$((PASSED_CHECKS + 1))
                TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
            else
                print_color $YELLOW "   ⚠️  Some tests failed (non-critical)"
                WARNINGS=$((WARNINGS + 1))
                TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
            fi
        fi
    fi
fi

# Step 7: Check for uncommitted changes
print_color $CYAN "🔍 Checking for uncommitted changes..."
if git diff-index --quiet HEAD --; then
    print_color $GREEN "   ✅ Working directory clean"
else
    print_color $YELLOW "   ⚠️  Uncommitted changes detected"
    git status --short
fi

echo ""
print_color $BLUE "═══════════════════════════════════════"
print_color $BLUE "📊 Checkin Summary"
print_color $BLUE "═══════════════════════════════════════"

# Display results
if [ $FAILED_CHECKS -eq 0 ]; then
    print_color $GREEN "✅ All critical checks passed! ($PASSED_CHECKS/$TOTAL_CHECKS)"
else
    print_color $RED "❌ Some checks failed!"
fi

print_color $CYAN "Total checks:    $TOTAL_CHECKS"
print_color $GREEN "Passed:         $PASSED_CHECKS"

if [ $FAILED_CHECKS -gt 0 ]; then
    print_color $RED "Failed:         $FAILED_CHECKS"
fi

if [ $WARNINGS -gt 0 ]; then
    print_color $YELLOW "Warnings:       $WARNINGS"
fi

# Provide recommendations
echo ""
print_color $YELLOW "💡 Recommendations:"

if [ $FAILED_CHECKS -eq 0 ]; then
    print_color $GREEN "  ✅ Your code is ready to commit!"
    print_color $YELLOW "  • Use '/git safe' to commit with review"
    print_color $YELLOW "  • Use '/git strict' for critical changes"
else
    print_color $YELLOW "  ⚠️  Please fix the failed checks before committing"
    print_color $YELLOW "  • Run '/bugs all' to auto-fix issues"
    print_color $YELLOW "  • Review specific errors above"
    print_color $YELLOW "  • Use '/git force' only if absolutely necessary"
fi

if [ $WARNINGS -gt 0 ]; then
    print_color $YELLOW "  • Consider addressing warnings for better code quality"
fi

# Exit with appropriate code
if [ $FAILED_CHECKS -gt 0 ]; then
    exit 1
else
    exit 0
fi