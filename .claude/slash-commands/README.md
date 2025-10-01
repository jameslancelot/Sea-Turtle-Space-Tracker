# Claude Code Custom Slash Commands

This directory contains custom slash commands for Claude Code that integrate CodeRabbit AI-powered code review into your development workflow.

## Available Commands

### `/bugs [category] [options]`
Comprehensive bug detection and auto-fixing using CodeRabbit and linting tools.

**Categories:**
- `all` - Run all bug detection categories (default)
- `linting` - ESLint issues only
- `types` - TypeScript errors only
- `security` - Security vulnerabilities
- `performance` - Performance optimizations
- `coderabbit` - CodeRabbit AI analysis only

**Options:**
- `dry-run` - Preview changes without fixing
- `no-fix` - Detect issues without attempting fixes
- `verbose` - Show detailed output

**Examples:**
```bash
/bugs                  # Find and fix all issues
/bugs linting         # Fix linting issues only
/bugs security        # Security scan
/bugs all dry-run     # Preview all fixes
```

### `/git [mode] [message]`
Enhanced git workflow with CodeRabbit review before committing.

**Modes:**
- `quick` - Fast AI feedback (for rapid iteration)
- `safe` - Standard review with warnings (default)
- `strict` - Blocks commit on issues (for critical changes)
- `skip` - Skip CodeRabbit review (emergency only)
- `force` - Force commit bypassing all checks

**Examples:**
```bash
/git                           # Safe mode, auto-generated message
/git quick "feat: new feature" # Quick review with custom message
/git strict                    # Strict mode for critical changes
```

### `/checkin [scope]`
Comprehensive code quality check before committing.

**Scopes:**
- `quick` - Basic checks only
- `standard` - Standard checks (default)
- `full` - All checks including security
- `security` - Security-focused review

**Examples:**
```bash
/checkin           # Standard comprehensive review
/checkin full      # Complete review with security
/checkin quick     # Quick checks before commit
```

## How It Works

1. **Claude Code Integration**: These scripts are automatically recognized as slash commands by Claude Code when placed in `.claude/slash-commands/`

2. **CodeRabbit Integration**: Each command leverages CodeRabbit CLI for AI-powered code review

3. **Project Scripts**: The commands call the main scripts in `/scripts/`:
   - `git-with-coderabbit.sh` - Git workflow
   - `bugs-detector.sh` - Bug detection
   - `code-review-helper.sh` - Review helper

## Setup Requirements

1. **CodeRabbit CLI**: Must be installed and authenticated
   ```bash
   curl -fsSL https://cli.coderabbit.ai/install.sh | sh
   coderabbit auth login
   ```

2. **Project Scripts**: Ensure these exist:
   - `scripts/git-with-coderabbit.sh`
   - `scripts/bugs-detector.sh`
   - `scripts/code-review-helper.sh`

3. **Configuration**: `.coderabbit.yml` in project root

## Workflow Examples

### Standard Development Flow
```bash
# 1. Make changes to your code
# 2. Check for issues
/bugs all

# 3. Review and commit
/git safe "feat: implement new feature"
```

### Critical Bug Fix Flow
```bash
# 1. Full security scan
/bugs security

# 2. Comprehensive review
/checkin full

# 3. Strict commit
/git strict "fix: critical security patch"
```

### Quick Iteration Flow
```bash
# 1. Quick check
/checkin quick

# 2. Fast commit
/git quick "wip: testing approach"
```

## Benefits

- **Instant Feedback**: Get AI-powered code review without leaving Claude Code
- **Automated Fixes**: Auto-fix common issues before committing
- **Quality Gates**: Enforce code quality standards with strict mode
- **Workflow Integration**: Seamlessly integrated with git workflow

## Troubleshooting

### Command Not Found
- Ensure scripts are executable: `chmod +x .claude/slash-commands/*.sh`
- Check Claude Code recognizes the commands

### CodeRabbit Errors
- Verify authentication: `coderabbit auth status`
- Check rate limits
- Ensure `.coderabbit.yml` exists

### Script Errors
- Check project scripts exist in `/scripts/`
- Verify dependencies (pnpm, git, etc.)

## See Also

- [CodeRabbit Integration Guide](../../docs/development/CODERABBIT_INTEGRATION.md)
- [Bug Detection Workflow](../../docs/development/BUG_DETECTION_WORKFLOW.md)
- [Automated Code Review](../../docs/development/AUTOMATED_CODE_REVIEW.md)