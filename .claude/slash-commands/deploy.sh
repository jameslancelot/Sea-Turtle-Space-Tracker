#!/bin/bash

# /deploy - Vercel Deployment Management Slash Command
# Comprehensive deployment checking with auto-fix capabilities

set -e

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

# Source the deployment checker script
DEPLOY_SCRIPT="$PROJECT_ROOT/scripts/vercel-deploy-checker.sh"

# Make sure the script is executable
chmod +x "$DEPLOY_SCRIPT" 2>/dev/null || true

# Parse arguments
COMMAND="${1:-check}"
shift || true

# Execute deployment command
case "$COMMAND" in
    "check"|"")
        echo "🔍 Checking deployment status..."
        "$DEPLOY_SCRIPT" check
        ;;
    "fix")
        echo "🔧 Auto-fixing deployment issues..."
        "$DEPLOY_SCRIPT" fix
        ;;
    "logs")
        echo "📋 Fetching deployment logs..."
        "$DEPLOY_SCRIPT" logs "$@"
        ;;
    "status")
        echo "📊 Listing recent deployments..."
        "$DEPLOY_SCRIPT" status
        ;;
    "rollback")
        echo "⏮️ Rolling back to previous deployment..."
        vercel rollback --yes
        ;;
    "help")
        echo "Vercel Deployment Management Commands:"
        echo "  /deploy         - Check current deployment status"
        echo "  /deploy fix     - Auto-fix and redeploy if issues found"
        echo "  /deploy logs    - View deployment logs"
        echo "  /deploy status  - List recent deployments"
        echo "  /deploy rollback - Rollback to previous deployment"
        ;;
    *)
        echo "Unknown command: $COMMAND"
        echo "Use '/deploy help' for available commands"
        exit 1
        ;;
esac