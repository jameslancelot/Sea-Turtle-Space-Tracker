# Vercel CLI Integration Guide

## 🎉 Summary: You're Already Fully Connected!

Your `/git` command has **complete Vercel CLI integration** with enhanced features for production-grade deployments.

---

## ✅ Current Setup Status

### What's Working
- **✅ Vercel CLI**: v48.1.6, authenticated as `jameslancelot`
- **✅ Project Linked**: `sea-turtle-space-tracker` (ID: `prj_Jt9Qj7gK1AS3bt9xiRxGFyceOYKc`)
- **✅ Production URL**: https://sea-turtle-space-tracker.vercel.app
- **✅ Auto-Deploy**: Integrated in `/git` command workflow
- **✅ Team Access**: Part of `jameslancelots-projects` organization

### Recent Improvements (Oct 2, 2025)
1. **Fixed validation logic** - Now checks production URL instead of preview URL (no more false 401 errors)
2. **Added deployment status checks** - Uses `vercel inspect` for accurate status
3. **Environment variable support** - Deploy to preview or production
4. **Auto-rollback capability** - Automatic rollback in strict mode if deployment fails

---

## 🚀 How to Use

### Basic Deployment (Production)
```bash
/git                    # Safe mode, production deploy
/git quick              # Quick mode, production deploy
/git strict             # Strict mode with auto-rollback
```

### Preview Deployments
```bash
DEPLOY_ENV=preview /git              # Deploy to preview environment
DEPLOY_ENV=preview /git "test: new feature"
```

### Strict Mode with Rollback
```bash
/git strict "fix: critical security patch"
# Automatically rolls back if:
# - Production URL returns non-200 status
# - Deployment status is not "Ready"
# - Network validation fails
```

---

## 🔧 What Happens During Deployment

### Step 6: Vercel Deployment
1. **Stores previous deployment** for rollback capability
2. **Deploys based on DEPLOY_ENV**:
   - `production` (default): `vercel --prod --yes`
   - `preview`: `vercel --yes`
3. **Extracts deployment URL** from output
4. **Checks for build errors**

### Step 7: Post-Deployment Validation
1. **Gets production URL** from Vercel project list
2. **HTTP check** - Validates production endpoint (HTTP 200)
3. **Status check** - Uses `vercel inspect` to verify "Ready" status
4. **Rollback logic** (strict mode only):
   - If validation fails → automatically rolls back
   - Shows manual rollback options if auto-rollback fails

---

## 📊 Environment Variables

### DEPLOY_ENV
Controls deployment target:
- `production` (default) - Deploy to production
- `preview` - Deploy to preview/staging

```bash
# Production (default)
/git

# Preview environment
DEPLOY_ENV=preview /git
```

### MODE
Controls review and rollback behavior:
- `quick` - Fast review, no rollback
- `safe` (default) - Standard review, warnings shown
- `strict` - Blocks on issues, auto-rollback on deployment failure
- `skip` - Skip CodeRabbit review
- `force` - Bypass all checks (emergency only)

---

## 🛡️ Rollback System

### Automatic Rollback (Strict Mode Only)

When using `/git strict`, the system automatically rolls back if:

1. **HTTP Validation Fails**
   - Production URL unreachable (000)
   - Non-200 HTTP status code

2. **Status Check Fails**
   - Deployment status is not "Ready"
   - Vercel reports error state

### Rollback Methods

**Automatic** (preferred):
```bash
vercel rollback --yes
```

**Manual** (if automatic fails):
1. Vercel Dashboard → Deployments → Click "Rollback"
2. CLI: `vercel rollback`
3. Git revert: `git revert [COMMIT] && /git`

---

## 🔍 Validation Flow

### Production URL Detection
```bash
# 1. Try to get from Vercel project list
vercel ls --prod | grep "https://" | head -1

# 2. Fallback to standard URL
https://sea-turtle-space-tracker.vercel.app
```

### HTTP Status Check
```bash
curl -s -o /dev/null -w "%{http_code}" "$PRODUCTION_URL"
```

### Deployment Status Check
```bash
vercel inspect "$DEPLOYMENT_URL" | grep "status"
```

---

## 📝 Example Workflows

### Standard Feature Development
```bash
# Work on feature
git checkout -b feature/new-dashboard

# Deploy to preview first
DEPLOY_ENV=preview /git "feat: add new dashboard"

# Test preview URL, then merge to main
git checkout main
git merge feature/new-dashboard

# Deploy to production
/git
```

### Critical Bug Fix (with rollback protection)
```bash
# Create fix
git checkout -b hotfix/security-patch

# Deploy with strict validation and auto-rollback
/git strict "fix: patch XSS vulnerability"

# If deployment fails, automatically rolls back
# If successful, production is updated safely
```

### Emergency Hotfix (bypass all checks)
```bash
# Only for true emergencies!
/git force "hotfix: critical production issue"

# Or skip just CodeRabbit
/git skip "hotfix: emergency patch"
```

---

## 🐛 Troubleshooting

### Issue: "Vercel deployment failed"
**Solution**: Check if authenticated
```bash
vercel whoami        # Should show: jameslancelot
vercel login         # If not authenticated
```

### Issue: "Could not extract deployment URL"
**Solution**: Check vercel CLI output
```bash
vercel --prod --yes  # Run manually to see errors
vercel logs          # Check deployment logs
```

### Issue: "Rollback failed"
**Solution**: Manual rollback options
1. Vercel Dashboard: deployments tab → click "Rollback"
2. Run: `vercel rollback` manually
3. Or: `git revert HEAD && /git`

### Issue: False 401 on validation
**Fixed!** The validation now checks the production URL instead of preview URL.

---

## 🔗 Useful Commands

### Check Vercel Status
```bash
vercel whoami                    # Check authentication
vercel project ls                # List all projects
vercel ls --prod                 # List production deployments
vercel inspect [URL]             # Get deployment details
vercel logs [URL]                # View deployment logs
```

### Deployment Management
```bash
vercel --prod                    # Deploy to production (manual)
vercel                           # Deploy to preview (manual)
vercel rollback                  # Rollback to previous deployment
vercel alias                     # Manage domain aliases
```

### Project Configuration
```bash
vercel env ls                    # List environment variables
vercel env add [KEY]             # Add environment variable
vercel link                      # Link to different project
```

---

## 📚 Additional Resources

- **Vercel CLI Docs**: https://vercel.com/docs/cli
- **Project Dashboard**: https://vercel.com/jameslancelots-projects/sea-turtle-space-tracker
- **CodeRabbit Integration**: See `.coderabbit.yaml` for review config
- **Custom Commands**: See `.claude/commands/git.md` for full usage

---

## 🎯 Key Takeaways

1. **Your Vercel CLI is fully set up** - No additional configuration needed
2. **The /git command handles everything** - Code review → Deploy → Validate → Rollback
3. **Use strict mode for critical changes** - Automatic rollback protection
4. **Preview environments available** - Use DEPLOY_ENV=preview for testing
5. **Validation is now accurate** - Production URL checking, no more false errors

**Your deployment pipeline is production-ready!** 🚀
