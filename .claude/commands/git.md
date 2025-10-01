---
description: Enhanced git workflow with CodeRabbit code review and AI commit messages
argument-hint: "[mode] [commit-message] - try: quick, safe, strict, skip, force"
allowed-tools: ["Bash"]
---

# Enhanced Git Workflow with CodeRabbit Integration

Execute complete git workflow with AI-powered code review and intelligent commit message generation.

## Command: `/git $ARGUMENTS`

**What this command does:**

1. **Pre-commit Quality Checks**: Run linting, type checking, and basic validations
2. **CodeRabbit AI Review**: Intelligent code analysis with configurable review modes
3. **Smart Commit Messages**: AI-generated conventional commit messages from diff analysis
4. **Automated Git Flow**: Stage, commit, and push with intelligent error handling
5. **Post-commit Analysis**: Optional comprehensive review after successful commit

## Review Modes:

- **`quick`**: Fast AI feedback for rapid development iterations (<5s)
- **`safe`**: Standard review with warnings shown but not blocking (~10s) **[Default]**
- **`strict`**: Review blocks commit on critical issues (~15s, for critical changes)
- **`skip`**: Skip CodeRabbit entirely (emergency commits only)
- **`force`**: Force commit bypassing all checks (use with extreme caution)

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