# Sea Turtle Space Tracker - Deployment Scripts

This directory contains automated deployment scripts for the Sea Turtle Space Tracker project.

## 🚀 Main Script: `git-with-coderabbit.sh`

The primary deployment orchestrator that handles the complete deployment pipeline from code review to production deployment.

### What It Does

1. **Pre-flight Checks** - Verifies required tools and git status
2. **CodeRabbit AI Review** - Intelligent code analysis and quality checks
3. **Browser Testing** - Validates dev server and checks for console errors
4. **Commit Message Generation** - AI-powered conventional commit messages
5. **Git Operations** - Stages, commits, and pushes changes
6. **Vercel Deployment** - Deploys to production and validates
7. **Post-Deployment Validation** - Confirms successful deployment

### Usage

This script is designed to be called via the `/git` slash command in Claude Code:

```bash
/git                           # Safe mode with auto-generated message
/git quick                     # Quick mode for rapid iteration
/git safe "feat: new feature"  # Safe mode with custom message
/git strict "fix: security"    # Strict mode for critical fixes
/git skip "hotfix: emergency"  # Skip review for emergencies
/git force                     # Force commit bypassing all checks
```

### Review Modes

- **`quick`**: Fast AI feedback for rapid development (<5s)
- **`safe`**: Standard review with warnings shown but not blocking (~10s) **[Default]**
- **`strict`**: Review blocks commit on critical issues (~15s)
- **`skip`**: Skip CodeRabbit entirely (emergency commits only)
- **`force`**: Force commit bypassing all checks (use with extreme caution)

### Dependencies

Required tools (automatically checked):
- `coderabbit` - AI code review CLI
- `vercel` - Deployment CLI
- `git` - Version control
- `npm` - Node package manager
- `curl` - HTTP requests (for health checks)

Optional:
- Playwright MCP server - For advanced browser testing (gracefully degrades if not available)

### Configuration Files

The script uses these configuration files:

- **`.coderabbit.yaml`** - CodeRabbit review settings and project-specific rules
- **`CLAUDE.md`** - Additional context for CodeRabbit reviews
- **`vercel.json`** - Vercel deployment configuration

### Error Handling

The script includes comprehensive error handling:

- **Automatic rollback** on failure
- **Cleanup of dev servers** on exit
- **Detailed error messages** with actionable suggestions
- **Exit codes** for integration with CI/CD

### Dev Server Testing

The script automatically:
1. Starts `npm run dev` in the background
2. Waits for server to be ready (max 30s)
3. Validates HTTP 200 response
4. Checks logs for errors
5. Stops server and cleans up processes

### Deployment Validation

Post-deployment checks include:
- HTTP status code verification
- Build error detection
- Deployment URL accessibility
- Summary of completed steps

### Environment Variables

Optional environment variables:
- `CODERABBIT_MODE` - Default review mode
- `SKIP_CODERABBIT` - Skip CodeRabbit review
- `FORCE_COMMIT` - Force commit despite issues

### Output

The script provides color-coded output:
- 🔵 **Blue** - Information and progress
- 🟢 **Green** - Success messages
- 🟡 **Yellow** - Warnings and suggestions
- 🔴 **Red** - Errors
- 🟣 **Magenta** - Section headers
- 🔷 **Cyan** - Summaries

### Logs

Dev server logs are written to:
- `/tmp/sea-turtle-dev.log`

Use `tail -f /tmp/sea-turtle-dev.log` to monitor in real-time.

### Safety Features

1. **Pre-commit validation** - CodeRabbit review before committing
2. **Browser error detection** - Catches runtime errors before deployment
3. **Graceful degradation** - Works even if optional tools are missing
4. **Atomic operations** - Rollback on failure
5. **Confirmation prompts** - For strict mode operations

### Integration with Claude Code

This script is called by `.claude/slash-commands/git.sh` which provides:
- Command-line argument parsing
- Help documentation
- User-friendly wrapper
- Error reporting

### Troubleshooting

#### Script not found
```bash
# Make sure you're in the project root
cd /path/to/Sea-Turtle-Space-Tracker

# Verify script exists
ls -la scripts/git-with-coderabbit.sh

# Make executable if needed
chmod +x scripts/git-with-coderabbit.sh
```

#### CodeRabbit not installed
```bash
# Install CodeRabbit CLI
curl -fsSL https://cli.coderabbit.ai/install.sh | sh
```

#### Vercel not installed
```bash
# Install Vercel CLI
npm install -g vercel
```

#### Dev server won't start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill existing Next.js processes
pkill -f "next dev"

# Try running manually
npm run dev
```

#### Deployment fails
```bash
# Check Vercel auth
vercel whoami

# Login if needed
vercel login

# Check vercel.json
cat vercel.json
```

### Contributing

When modifying this script:
1. Test all 5 modes (quick, safe, strict, skip, force)
2. Verify error handling and rollback
3. Check cleanup of background processes
4. Update this README with any changes
5. Test with and without Playwright MCP

### Credits

Created for PVPV/Rawlings Elementary School Sea Turtles 🐢🚀

Part of the Claude Code enhanced git workflow system.
