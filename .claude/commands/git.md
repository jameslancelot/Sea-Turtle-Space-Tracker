---
description: Enhanced git workflow with CodeRabbit code review and AI commit messages
argument-hint: "[mode] [commit-message] - try: quick, safe, strict, skip, force"
allowed-tools: ["Bash"]
---

# Enhanced Git Workflow with CodeRabbit Integration

Execute the enhanced git workflow script with linting, CodeRabbit review, and smart commits.

```bash
bash .claude/commands/git.sh $ARGUMENTS
```

## Command: `/git $ARGUMENTS`

**What this command does:**

1. **Pre-commit Quality Checks**: Run ESLint to catch errors
2. **CodeRabbit AI Review**: Intelligent code analysis using `--plain` mode
3. **Smart Commit Messages**: AI-generated conventional commit messages from diff analysis
4. **Automated Git Flow**: Stage, commit, and push with intelligent error handling

**🛡️ Safety guarantee**: Linting errors and critical CodeRabbit issues **block deployment in strict mode**

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
/git strict "fix: security"    # Strict mode with rollback protection
/git skip "hotfix: emergency"  # Skip review for emergencies

# Environment Variables
DEPLOY_ENV=preview /git        # Deploy to preview (non-production)
DEPLOY_ENV=production /git     # Deploy to production (default)
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
- **Vercel Direct**: Fully integrated with Vercel CLI for instant deployments
- **Smart Validation**: Validates production URLs with accurate status checking
- **Auto Rollback**: In strict mode, automatically rolls back failed deployments
- **Environment Control**: Support for preview/staging deployments via DEPLOY_ENV

## Requirements:

- **Execute automatically** without unnecessary prompts
- **Handle failures gracefully** with informative error messages
- **Provide actionable feedback** when issues are detected
- **Maintain git history integrity** with proper commit messages

## Context:

Works with any project using git version control. Automatically detects your tech stack and adapts review focus accordingly.

**Expected behavior:** Intelligent automation that maintains code quality while enabling rapid development flow.