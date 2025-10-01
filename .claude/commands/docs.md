---
allowed-tools: Bash(git log:*), Bash(git diff:*), Bash(git status:*), Read, Write, Edit, MultiEdit
argument-hint: [scope: all|readme|claude|todos|changelog]
description: Update standard project documentation files based on recent changes
model: claude-sonnet-4-20250514
---

# Documentation Update Command

**Purpose:** Keep standard Claude Code project files up-to-date based on recent code changes.

## Standard Files This Command Updates:

### Core Files (Always Check):
1. **README.md** - Project overview, setup instructions, features
2. **CLAUDE.md** - Claude Code context and project architecture
3. **todos.md** - Task tracking and progress
4. **UPDATE_LOG.md** or **CHANGELOG.md** - Change history

### Extensibility:
You can extend this command to update project-specific files by adding them to the appropriate scope below.

---

## Current Git Context

### Recent Changes (Last 7 Days)
!`git log --oneline --since="7 days ago" -20`

### Modified Files
!`git diff --name-status HEAD~10...HEAD 2>/dev/null | head -30`

### Current Branch
!`git branch --show-current`

---

## Update Scope
Requested scope: **$ARGUMENTS** (default: all)

### Scope Options:
- **`all`** - Update all standard files
- **`readme`** - Update only README.md
- **`claude`** - Update only CLAUDE.md
- **`todos`** - Update only todos.md
- **`changelog`** - Update only UPDATE_LOG.md/CHANGELOG.md

---

## Update Process

### Step 1: Detect What Files Exist
Check which standard documentation files exist in the project:
```bash
ls -la README.md CLAUDE.md todos.md UPDATE_LOG.md CHANGELOG.md 2>/dev/null
```

Only update files that exist. Don't create files unless explicitly needed.

---

### Step 2: Analyze Recent Changes

Review the git history to identify:
- ✅ New features added
- 🐛 Bugs fixed
- 🔧 Configuration changes
- 📦 Dependency updates
- ♻️ Refactoring or improvements
- 🎨 UI/UX changes
- 🚀 Performance improvements

Extract key changes that need documentation updates.

---

### Step 3: Update README.md (if exists and scope includes)

**When to update README.md:**
- New features that change user-facing functionality
- Setup/installation process changed
- New environment variables added
- API endpoints or usage changed
- Dependencies or tech stack changed

**What to update:**
- Features list
- Installation/setup instructions
- Usage examples
- Environment variables section
- Tech stack section
- Screenshots (if visuals changed)

**Keep:**
- Existing structure and tone
- Project description and goals
- License and credits

---

### Step 4: Update CLAUDE.md (if exists and scope includes)

**When to update CLAUDE.md:**
- Project architecture changed
- New development patterns established
- Build/deployment process changed
- Tool preferences changed
- Known issues or solutions discovered

**What to update:**
- Project structure section
- Tech stack details
- Development workflow
- Architecture overview
- Key components and their purposes
- Common issues and solutions

**Optimization guidelines:**
- Keep concise (<500 tokens / ~385 words ideal)
- Remove generic instructions Claude already knows
- Focus on project-specific context
- Use references instead of duplicating README content

---

### Step 5: Update todos.md (if exists and scope includes)

**When to update todos.md:**
- Tasks completed (from git history)
- New tasks discovered during development
- Priorities changed

**What to update:**
- Mark completed tasks with ✅ and completion date
- Add newly discovered tasks
- Update task priorities/status
- Remove obsolete tasks
- Group related tasks

**Format:**
```markdown
## ✅ Completed
- [Date] Task description

## 🚧 In Progress
- Task being worked on

## 📋 Todo
- [ ] Upcoming task
- [ ] Future task

## 💡 Ideas / Backlog
- Nice to have feature
```

---

### Step 6: Update UPDATE_LOG.md or CHANGELOG.md (if exists and scope includes)

**When to update:**
- After significant changes
- New feature releases
- Bug fixes
- Version updates

**What to add:**
Create a new entry with:
- **Date:** Current date
- **Changes:** Bulleted list of changes from git history
- **Category tags:** [Feature], [Fix], [Refactor], [Docs], [Performance]

**Format:**
```markdown
## [Date] - [Summary]

### Added
- New feature descriptions

### Fixed
- Bug fix descriptions

### Changed
- Refactoring or improvement descriptions

### Removed
- Deprecated feature removals
```

---

### Step 7: Project-Specific Extensions

**To add more files to this command:**

If your project has additional documentation files that should be updated regularly, add them here:

#### Example Extensions:
- **API.md** - API documentation (if project is an API/SDK)
- **ARCHITECTURE.md** - Detailed architecture docs (for complex projects)
- **CONTRIBUTING.md** - Contribution guidelines (for open source)
- **DEPLOYMENT.md** - Deployment procedures (for production apps)

To add support for these, modify this command file to include update logic for your specific files.

---

## Quality Checks

Before completing:
- [ ] Only updated files that exist (didn't create unnecessary files)
- [ ] README.md reflects current features and setup
- [ ] CLAUDE.md is optimized and project-specific
- [ ] todos.md has completed tasks marked
- [ ] UPDATE_LOG.md has recent changes documented
- [ ] No broken links in documentation
- [ ] Preserved existing documentation style
- [ ] All technical details are accurate

---

## Important Guidelines

1. **FIRST:** Check which files exist before updating
2. **DO NOT** create files that don't exist (unless explicitly requested)
3. **DO NOT** duplicate content between files - use references
4. Preserve existing style, tone, and structure
5. Use clear, concise language
6. Add "Last Updated: [current date]" if files use this convention
7. Keep CLAUDE.md under 500 tokens for optimal performance
8. Focus on high-impact updates that help users/developers

---

## Output Format

Provide a summary report:
```markdown
## 📝 Documentation Update Summary

### Files Updated:
- ✅ README.md - Added new feature X, updated setup instructions
- ✅ CLAUDE.md - Updated architecture section with new components
- ✅ todos.md - Marked 3 tasks complete, added 2 new tasks
- ✅ UPDATE_LOG.md - Added entry for recent changes

### Key Changes Documented:
1. New print functionality with print-specific layout
2. Interactive map view for launch sites
3. Enhanced filtering capabilities

### Recommendations:
- Consider adding screenshots to README for new visual features
- No additional documentation needed at this time
```

---

Begin by checking which files exist, analyzing recent git changes, then updating only the relevant standard files.