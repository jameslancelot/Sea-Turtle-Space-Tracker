---
description: Detect and auto-fix code issues using CodeRabbit and linting tools
argument-hint: "[category] [options] - try: all, linting, types, security"
allowed-tools: ["Bash", "SlashCommand"]
---

Execute comprehensive bug detection and automated fixing using CodeRabbit AI and traditional linting tools.

**What this command does:**

1. **Multi-Category Detection**: Analyzes code for linting, type errors, security vulnerabilities, and performance issues
2. **CodeRabbit AI Analysis**: Uses AI-powered code review for deeper insights
3. **Auto-Fix Capabilities**: Automatically fixes simple issues like formatting and unused imports
4. **Detailed Reporting**: Generates HTML reports with comprehensive findings
5. **Integration with Scripts**: Uses the existing `scripts/bugs-detector.sh` system

**Categories Available:** $ARGUMENTS

- **`all`** (default): Complete scan across all categories
- **`linting`**: ESLint issues and code style problems
- **`types`**: TypeScript errors and type safety issues
- **`security`**: Security vulnerabilities and hardcoded secrets
- **`performance`**: React optimizations and bundle size issues
- **`coderabbit`**: AI-detected code quality issues only

**Options:**
- **`dry-run`**: Preview changes without applying fixes
- **`no-fix`**: Detect issues without attempting auto-fixes
- **`verbose`**: Show detailed output and debugging info

**Requirements:**
- Execute automatically without confirmation prompts
- Run the underlying `scripts/bugs-detector.sh` script with the provided arguments
- Generate comprehensive reports at `.coderabbit/bug-reports/latest/`
- Provide actionable next steps after completion

**Context:** Works with any JavaScript/TypeScript codebase. Automatically detects your project structure and available linting tools.

**Expected behavior:** Complete automation with intelligent issue detection, auto-fixing where possible, and detailed reporting for manual review items.