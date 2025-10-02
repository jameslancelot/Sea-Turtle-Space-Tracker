# 🚀 Sea Turtle Space Tracker - Enhanced Deployment Pipeline

Complete guide to the automated deployment workflow with CodeRabbit AI review, browser testing, and Vercel deployment.

## Overview

The `/git` slash command provides a soup-to-nuts deployment pipeline that:

1. ✅ Reviews code quality with CodeRabbit AI
2. 🎭 Tests browser console for errors
3. 💬 Generates AI commit messages
4. 📦 Commits and pushes to GitHub
5. 🚀 Deploys to Vercel production
6. ✓ Validates deployment success

## Quick Start

```bash
# Standard deployment (recommended)
/git

# Quick mode for rapid iteration
/git quick

# Strict mode for critical changes (blocks on errors)
/git strict

# Custom commit message
/git safe "feat: add launch countdown timer"

# Emergency bypass (not recommended)
/git force
```

## 🎯 Mode Comparison Table

| Mode | CodeRabbit | Browser Test | Blocks on Critical | Blocks on Warnings | Speed | Use Case |
|------|-----------|--------------|-------------------|-------------------|-------|----------|
| **safe** (default) | ✅ Full | ✅ Full | 🛑 **YES** | ⚠️ No | ~10s | Regular development |
| **quick** | ✅ Fast | ✅ Basic | 🛑 **YES** | ⚠️ No | ~5s | Rapid iteration |
| **strict** | ✅ Deep | ✅ Full | 🛑 **YES** | 🛑 **YES** | ~15s | Critical changes |
| **skip** | ⏭️ Skip | ✅ Full | 🛑 **YES** | ⚠️ No | ~8s | Emergency fixes |
| **force** | ⏭️ Skip | ⏭️ Skip | ⚠️ No | ⚠️ No | ~3s | Absolute emergency |

### 🚨 Critical Error Policy

**All modes (except `force`) BLOCK on critical errors** that would crash your application:

**Critical Code Issues** (always blocked):
- 🔒 Security vulnerabilities
- 💥 Data loss risks
- ⚠️ Breaking changes
- 🚫 Dangerous operations

**Critical Browser Errors** (always blocked):
- ❌ React component errors
- 🔴 Build/compilation failures
- 💀 Runtime exceptions (TypeError, ReferenceError, etc.)
- 🔥 Syntax errors
- 🚨 Module not found errors
- 💣 Uncaught exceptions

**Non-Critical Issues** (only blocked in strict mode):
- ⚠️ Deprecation warnings
- 📝 Code style suggestions
- 💡 Performance recommendations
- 🎨 Best practice violations

This ensures **production stability by default** - you cannot accidentally deploy broken code.

---

## Deployment Modes

### 🟢 Safe Mode (Default)
**When to use**: Regular feature development and bug fixes

```bash
/git
/git safe "feat: add feature"
```

**Behavior**:
- ✅ Runs full CodeRabbit review
- 🛑 **BLOCKS** on critical code issues (security, data loss, breaking changes)
- ⚠️ Shows warnings for non-critical issues but proceeds
- ✅ Tests dev server for browser errors
- 🛑 **BLOCKS** on critical browser errors (React crashes, build failures)
- ⚠️ Shows warnings for non-critical issues but proceeds
- ✅ Commits, pushes, and deploys if no critical issues

**Best for**: Daily development, feature additions, UI updates

**Safety guarantee**: Will never deploy code with security vulnerabilities or browser-crashing errors

---

### ⚡ Quick Mode
**When to use**: Rapid iteration during active development

```bash
/git quick
```

**Behavior**:
- ✅ Fast CodeRabbit review (<5s)
- 🛑 **BLOCKS** on critical code issues (security, data loss)
- ⚠️ Shows warnings but proceeds on non-critical issues
- ✅ Basic browser validation
- 🛑 **BLOCKS** on critical browser errors (app crashes)
- ✅ Fast commit and deploy if no critical issues

**Best for**: Documentation, minor fixes, styling tweaks

**Note**: Still blocks on critical errors - "quick" means faster review, not unsafe deployment

---

### 🔒 Strict Mode
**When to use**: Critical changes, security fixes, production hotfixes

```bash
/git strict "fix: security vulnerability in API"
```

**Behavior**:
- ✅ Comprehensive deep CodeRabbit review
- 🛑 **BLOCKS** on critical code issues (security, data loss, breaking changes)
- 🛑 **BLOCKS** on high-priority issues (major bugs)
- 🛑 **BLOCKS** on warnings and suggestions (strictest validation)
- ✅ Thorough browser error checking
- 🛑 **BLOCKS** on critical browser errors (crashes)
- 🛑 **BLOCKS** on non-critical warnings (deprecations, console warnings)
- ⏸️ Confirmation prompt before proceeding

**Best for**: Security patches, data handling changes, API updates, pre-production validation

**Strictest mode**: Ensures absolutely zero issues before deployment

---

### ⏭️ Skip Mode
**When to use**: Emergency hotfixes (use sparingly)

```bash
/git skip "hotfix: emergency fix"
```

**Behavior**:
- ⏭️ Skips CodeRabbit code review
- ✅ Still runs browser testing
- 🛑 **BLOCKS** on critical browser errors (app crashes)
- ⚠️ Shows warnings for non-critical issues but proceeds
- ✅ Commits and deploys quickly if no critical errors

**Best for**: Emergency production fixes, urgent patches

**Note**: Still validates browser safety - only skips code review for speed

---

### 🚨 Force Mode
**When to use**: Absolute emergencies only (⚠️ DANGEROUS)

```bash
/git force
```

**Behavior**:
- ⏭️ Skips **ALL** checks
- ⏭️ No CodeRabbit review
- ⏭️ No browser testing
- ⏭️ No error detection
- ⚠️ Direct commit and deploy **REGARDLESS OF ERRORS**

**⚠️ DANGER**: This can deploy broken, crashing, or insecure code to production!

**Only use when**:
- All other modes are failing due to tool issues (not code issues)
- You have manually verified the code is safe
- You need immediate deployment to fix a worse production issue
- You understand the risks and will monitor deployment closely

**Better alternatives**: Fix the actual errors and use `skip` mode instead

---

## Complete Pipeline Walkthrough

### Step 1: Pre-flight Checks ✈️

The script verifies:
- Git repository is clean or has changes
- Required tools are installed:
  - `coderabbit` CLI
  - `vercel` CLI
  - `git`
  - `npm`
- Git remote is configured

**If checks fail**: Clear error messages with installation instructions

---

### Step 2: CodeRabbit AI Review 🐰

**What happens**:
1. Stages uncommitted changes
2. Runs `coderabbit review --plain --type uncommitted`
3. Uses `CLAUDE.md` and `.coderabbit.yaml` for context
4. Analyzes code for:
   - Security vulnerabilities
   - Code quality issues
   - Performance problems
   - Accessibility violations
   - React/Next.js best practices
   - Educational UX concerns

**Output categories**:
- 🚨 **Critical issues**: Security, breaking changes, data loss risks
- ⚠️ **Warnings**: Code smells, potential bugs, best practice violations
- ℹ️ **Suggestions**: Optimizations, improvements, enhancements

**Mode-specific behavior**:
- **Safe**: Shows warnings, proceeds anyway
- **Strict**: Blocks on critical issues
- **Quick**: Fast review with full output
- **Skip/Force**: Bypassed entirely

---

### Step 3: Browser Console Testing 🎭

**What happens**:
1. Starts `npm run dev` in background
2. Waits up to 30 seconds for server readiness
3. Validates HTTP 200 response from `http://localhost:3000`
4. Checks dev server logs for:
   - Runtime errors
   - Failed module loads
   - React component errors
   - API failures
5. Stops dev server and cleans up

**With Playwright MCP** (future enhancement):
- Navigate to localhost
- Capture `browser_console_messages`
- Check for React errors, warnings, and exceptions
- Take screenshots if errors found
- Test critical user flows

**If errors found**:
- **Safe mode**: Shows warnings, proceeds
- **Strict mode**: Blocks deployment

---

### Step 4: Commit Message Generation 💬

**Automatic message generation**:
```bash
# Analyzes git diff to determine commit type
[type]: [description]

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

**Commit types**:
- `feat`: New features or functionality
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: CSS/styling updates
- `test`: Test additions or updates
- `refactor`: Code refactoring

**Custom messages**:
```bash
/git safe "feat(map): add interactive launch site markers"
```

---

### Step 5: Git Operations 📦

**What happens**:
1. `git add .` - Stages all changes
2. `git commit -m "..."` - Creates commit with message
3. `git push -u origin [branch]` - Pushes to remote

**Commit includes**:
- Your commit message (auto-generated or custom)
- Claude Code attribution footer
- Co-author metadata

**Error handling**:
- Pre-commit hooks are respected
- Push failures show clear error messages
- Automatic rollback on failure

---

### Step 6: Vercel Deployment 🚀

**What happens**:
1. Runs `vercel --prod --yes`
2. Builds Next.js app
3. Deploys to production
4. Captures deployment URL
5. Monitors build output for errors

**Build process**:
- Next.js build with production optimizations
- Static page generation
- API routes deployment
- Asset optimization
- Edge function deployment

**Output**:
- ✅ Deployment URL (e.g., `https://sea-turtle-space-tracker.vercel.app`)
- 📊 Build statistics
- ⚠️ Any build warnings
- ❌ Build errors (blocks deployment)

---

### Step 7: Post-Deployment Validation ✓

**What happens**:
1. Waits 3 seconds for deployment propagation
2. Tests deployment URL with `curl`
3. Validates HTTP 200 response
4. Checks for error pages
5. Reports deployment status

**Success criteria**:
- ✅ HTTP 200 response
- ✅ No error pages
- ✅ All build steps completed

---

## Configuration Files

### `.coderabbit.yaml`
CodeRabbit AI review configuration:
- **Path-specific instructions**: Different rules for components, API routes, styles
- **Knowledge base**: Educational project context for young students
- **Custom rules**: Touch-friendly sizing, kid-friendly errors, theme consistency
- **Code quality checks**: Security, performance, accessibility, React best practices

### `CLAUDE.md`
Project architecture guide used by CodeRabbit:
- Technical stack and dependencies
- Component architecture
- Design system and theming
- Educational requirements
- Development guidelines

### `vercel.json`
Deployment configuration:
- Build commands
- Output directory
- Security headers
- Framework settings

---

## Troubleshooting

### "CodeRabbit not installed"

```bash
# Install CodeRabbit CLI
curl -fsSL https://cli.coderabbit.ai/install.sh | sh
```

### "Vercel not installed"

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login
```

### "Dev server failed to start"

```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill existing processes
pkill -f "next dev"

# Try starting manually
npm run dev
```

### "Git push failed"

```bash
# Check remote is configured
git remote -v

# Check you have push permissions
git push --dry-run

# Ensure you're logged in
gh auth status
```

### "Build errors in Vercel"

```bash
# Test build locally first
npm run build

# Check vercel.json syntax
cat vercel.json | jq .

# Review build logs
vercel logs
```

### "Playwright MCP not working"

```bash
# Check MCP server is configured
claude mcp list

# Add if missing
claude mcp add playwright -- npx -y @playwright/mcp

# Verify connection
claude mcp get playwright
```

---

## Integration with CI/CD

The `/git` command is designed for local development, but the same pipeline can be integrated into GitHub Actions:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm install
      - name: CodeRabbit review
        run: npx coderabbit review --plain
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Best Practices

### ✅ Do:
- Use **safe mode** for regular development
- Use **strict mode** for critical changes
- Write clear commit messages
- Test deployments in Vercel preview before merging
- Review CodeRabbit suggestions even in safe mode
- Keep `CLAUDE.md` up to date with architecture changes

### ❌ Don't:
- Use **force mode** unless absolutely necessary
- Ignore CodeRabbit critical issues without investigation
- Skip browser testing for UI changes
- Deploy directly to main without testing
- Bypass security warnings
- Commit with unresolved merge conflicts

---

## Monitoring and Rollback

### Check deployment status:
```bash
# Vercel dashboard
vercel

# List recent deployments
vercel ls

# View logs
vercel logs [deployment-url]
```

### Rollback if needed:
```bash
# Rollback to previous deployment
vercel rollback

# Or redeploy a specific commit
vercel --prod --yes [git-sha]
```

### Monitor for errors:
- Vercel dashboard error tracking
- Browser console in production
- User feedback from school
- API error logs

---

## Success Metrics

**A successful deployment**:
- ✅ Zero CodeRabbit critical issues
- ✅ No browser console errors
- ✅ Clean git history
- ✅ Vercel build succeeds
- ✅ HTTP 200 on deployment URL
- ✅ No user-facing errors
- ✅ Educational features working
- ✅ Mobile responsive
- ✅ Fast page loads

---

## Support and Help

### Getting help:
```bash
# Show /git command help
/git help

# Check CodeRabbit status
coderabbit --version

# Check Vercel status
vercel whoami

# Check MCP servers
claude mcp list
```

### Common issues:
- See `scripts/README.md` for detailed troubleshooting
- Check `/tmp/sea-turtle-dev.log` for dev server logs
- Review CodeRabbit output for specific code issues
- Check Vercel dashboard for deployment errors

### Emergency contacts:
- Vercel support: https://vercel.com/support
- CodeRabbit support: https://docs.coderabbit.ai
- GitHub support: https://support.github.com

---

## Future Enhancements

Planned improvements:
- 🎭 Full Playwright MCP browser testing integration
- 📊 Automated accessibility testing
- 🧪 Unit test execution before deployment
- 📸 Visual regression testing
- 🔍 Bundle size analysis
- ⚡ Performance budgets
- 🌍 Multi-region testing
- 📧 Email notifications on deployment
- 📱 Mobile device testing

---

## 🛡️ Safety-First Deployment Philosophy

The `/git` command is designed with **production stability as the default behavior**. Here's the safety model:

### Decision Tree: Will My Code Deploy?

```
┌─────────────────────────────────────────┐
│  /git [mode] executed                   │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  Is mode "force"?                       │
└─────────────────────────────────────────┘
      YES ↓                       NO ↓
  ⚠️ DEPLOY                   Run checks
 (dangerous!)                      ↓
                    ┌──────────────────────┐
                    │ CodeRabbit Review    │
                    └──────────────────────┘
                              ↓
                    Critical issues found?
                    (security/data loss)
                              ↓
                         YES → 🛑 BLOCKED
                              ↓
                         NO → Continue
                              ↓
                    ┌──────────────────────┐
                    │ Browser Testing      │
                    └──────────────────────┘
                              ↓
                    Critical errors found?
                    (React/build failures)
                              ↓
                         YES → 🛑 BLOCKED
                              ↓
                         NO → Continue
                              ↓
                    ┌──────────────────────┐
                    │ Warnings found?      │
                    └──────────────────────┘
                              ↓
                    YES → Is mode "strict"?
                              ↓
                         YES → 🛑 BLOCKED
                         NO  → ⚠️ DEPLOY
                              ↓
                         NO → ✅ DEPLOY
```

### Error Classification System

| Error Type | Example | Safe | Quick | Strict | Skip | Force |
|-----------|---------|------|-------|--------|------|-------|
| **Security vulnerability** | SQL injection risk | 🛑 | 🛑 | 🛑 | 🛑 | ⚠️ |
| **Data loss risk** | Deletes without backup | 🛑 | 🛑 | 🛑 | 🛑 | ⚠️ |
| **React error** | Component crash | 🛑 | 🛑 | 🛑 | 🛑 | ⚠️ |
| **Build failure** | Module not found | 🛑 | 🛑 | 🛑 | 🛑 | ⚠️ |
| **Runtime exception** | TypeError | 🛑 | 🛑 | 🛑 | 🛑 | ⚠️ |
| **High-priority bug** | Major logic error | ⚠️ | ⚠️ | 🛑 | ⚠️ | ⚠️ |
| **Deprecation warning** | Old API usage | ⚠️ | ⚠️ | 🛑 | ⚠️ | ⚠️ |
| **Style suggestion** | Code formatting | ⚠️ | ⚠️ | 🛑 | ⚠️ | ⚠️ |

**Legend**: 🛑 = Blocks deployment | ⚠️ = Allows deployment

### Why This Matters

**Before this update**, the `/git` command would:
- ⚠️ Show warnings for React errors
- ⚠️ Show warnings for security issues
- ✅ Deploy broken code to production
- 😱 Students see crashed website

**After this update**, the `/git` command will:
- 🛑 Block React errors that crash the app
- 🛑 Block security vulnerabilities
- ✅ Only deploy working, safe code
- 😊 Students always see a working website

**Result**: **Zero-downtime educational experience** for elementary school students! 🎓🐢

### The Three-Tier Safety Model

1. **🔴 CRITICAL (Always blocked)**: Code that crashes or compromises security
   - React component errors, build failures, TypeErrors
   - Security vulnerabilities, data loss, breaking changes
   - **Can't deploy even if you wanted to** (except with `force`)

2. **🟡 HIGH (Blocked only in strict)**: Major issues that should be fixed
   - Significant bugs, logical errors
   - Performance problems
   - **Deploys with warning** in normal modes

3. **🟢 LOW (Never blocked)**: Suggestions and best practices
   - Code style, formatting
   - Minor optimizations
   - **Always deploys** (shown in strict mode for awareness)

This ensures the Sea Turtle Space Tracker is **always accessible to students**, while still maintaining **code quality and security standards**.

---

**Created for PVPV/Rawlings Elementary School Sea Turtles 🐢🚀**

*"From the ocean to the stars - with quality code every step of the way!"*
*"Critical errors blocked by default - because students deserve a working website!"*
