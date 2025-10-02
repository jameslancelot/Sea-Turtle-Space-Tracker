---
description: Enhanced git workflow with CodeRabbit code review and AI commit messages
argument-hint: "[mode] [commit-message] - try: quick, safe, strict, skip, force"
allowed-tools: ["Bash"]
---

# Enhanced Git Workflow with CodeRabbit Integration

Execute complete git workflow with AI-powered code review and intelligent commit message generation.

## Command: `/git $ARGUMENTS`

**What this command does:**

1. **Pre-commit Quality Checks**: Verify required tools and git status
2. **CodeRabbit AI Review**: Intelligent code analysis - **blocks on critical issues**
3. **Browser Error Testing**: Start dev server, check for console errors - **blocks on crashes**
4. **Smart Commit Messages**: AI-generated conventional commit messages from diff analysis
5. **Automated Git Flow**: Stage, commit, and push with intelligent error handling
6. **Vercel Deployment**: Deploy to production with build validation
7. **Post-deployment Validation**: Verify deployment URL and check for errors

**🛡️ Safety guarantee**: Critical errors (security, crashes) **block deployment by default**

## Review Modes:

- **`quick`**: Fast review, **blocks on critical errors**, warns on non-critical (<5s)
- **`safe`**: Full review, **blocks on critical errors**, warns on non-critical (~10s) **[Default]**
- **`strict`**: Deep review, **blocks on ALL issues** including warnings (~15s)
- **`skip`**: Skips code review, **still blocks on browser errors** (emergency only)
- **`force`**: Bypasses **ALL checks** - can deploy broken code! (⚠️ DANGEROUS)

## Safety-First Design:

🛡️ **Critical errors ALWAYS block deployment** (except in force mode):
- Security vulnerabilities, data loss risks, breaking changes
- React errors, build failures, runtime exceptions, syntax errors

This ensures you **cannot accidentally deploy crashing or insecure code** to production.

## Usage Patterns:

```bash
/git                           # Safe mode with auto-generated message
/git quick                     # Quick mode for rapid iteration
/git safe "feat: new feature"  # Safe mode with custom message
/git strict "fix: security"    # Strict mode for critical fixes
/git skip "hotfix: emergency"  # Skip review for emergencies
```

## Smart Message Generation:

When no custom message is provided, the system:
- Analyzes staged changes with AI
- Generates conventional commit format (feat/fix/docs/refactor/etc.)
- Includes context from file changes and patterns
- Adds standard Claude Code attribution footer

## Integration Features:

- **Fallback Graceful**: If CodeRabbit fails, falls back to standard git workflow
- **Cost Optimized**: Smart caching and incremental reviews
- **Team Consistent**: Shared review standards via `.coderabbit.yml`
- **CI/CD Ready**: Works with GitHub Actions and automated pipelines

## Requirements:

- **Execute automatically** without unnecessary prompts
- **Handle failures gracefully** with informative error messages
- **Provide actionable feedback** when issues are detected
- **Maintain git history integrity** with proper commit messages

## Context:

Works with any project using git version control. Automatically detects your tech stack and adapts review focus accordingly.

**Expected behavior:** Intelligent automation that maintains code quality while enabling rapid development flow.