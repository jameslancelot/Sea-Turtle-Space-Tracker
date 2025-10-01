# 🛠️ Claude Code Debugging Commands

This directory contains custom slash commands for systematic debugging and testing with Claude Code.

## 📚 Available Commands

### 📝 Documentation Management Commands

#### `/docs [scope]`
**Purpose**: Automatically update all documentation including plan.md based on recent code changes
**Model**: Claude 3.5 Sonnet (for comprehensive analysis)
**Arguments**: Optional scope (all|api|features|architecture|guides)
**Use when**:
- After significant code changes
- Before releases
- Weekly documentation maintenance
- After adding new features
- To update project planning status

**Features**:
- Updates plan.md with recent progress
- Git history analysis (last 7 days)
- Automatic template usage
- Cross-reference validation
- Archive management for deprecated docs
- CLAUDE.md updates when needed

#### `/docs-check`
**Purpose**: Quick documentation status check
**Model**: Claude 3.5 Haiku (for speed)
**Use when**:
- Daily/weekly checks
- Before sprint planning
- After merging PRs
- Quick assessment needed

**Features**:
- Recent change analysis
- Priority-based task list
- Documentation coverage report
- Missing documentation identification

#### `/release-notes [version]`
**Purpose**: Generate release notes and update CHANGELOG.md
**Model**: Claude 3.5 Sonnet (for quality writing)
**Arguments**: Version type (major|minor|patch) or specific tag
**Use when**:
- Preparing releases
- Creating version tags
- Updating CHANGELOG
- Generating team announcements

**Features**:
- Conventional commit parsing
- Automatic version determination
- CHANGELOG.md updates
- Migration guide generation
- Team summary creation

### Core Debugging Commands

#### `/debug [issue-description]`
**Purpose**: Comprehensive, methodical debugging with full testing suite  
**Model**: Claude 3.5 Sonnet (for complex reasoning)  
**Use when**: 
- Facing complex bugs with unknown root causes
- Need thorough investigation and testing
- Dealing with multi-system issues

**Features**:
- 6-phase debugging protocol
- Automatic test generation
- Database validation
- Performance and security checks
- Playwright E2E testing

#### `/debug-quick [error-message]`
**Purpose**: Quick fixes for simple errors and type issues  
**Model**: Claude 3.5 Haiku (for speed)  
**Use when**:
- Type errors
- Linting issues
- Simple syntax errors
- Quick fixes needed

### Specialized Debugging Commands

#### `/debug-db [table-name or migration-issue]`
**Purpose**: Database schema debugging and migration management  
**Use when**:
- Schema mismatches
- Migration failures
- Data integrity issues
- Drizzle ORM problems

**Features**:
- Drizzle-kit integration
- Supabase MCP tools
- Migration safety checks
- Schema validation

#### `/debug-e2e [test-scenario]`
**Purpose**: E2E debugging with Playwright browser automation  
**Use when**:
- UI bugs
- User flow issues
- Visual regressions
- Browser-specific problems

**Features**:
- Playwright MCP integration
- Visual testing
- Performance monitoring
- Automated test generation

### Testing Commands

#### `/test-fix [test-name or test-file]`
**Purpose**: Fix failing tests and improve coverage  
**Use when**:
- Tests are failing
- Need to add test coverage
- Refactoring test suites

**Features**:
- Unit test fixes
- Integration test creation
- E2E test development
- Coverage reporting

### Utility Commands

#### `/bug-report [bug-description]`
**Purpose**: Generate comprehensive bug reports  
**Model**: Claude 3.5 Haiku (for efficiency)  
**Use when**:
- Need to document bugs
- Creating GitHub issues
- Sharing issues with team

**Features**:
- Automatic context gathering
- System information collection
- Log aggregation
- Priority assessment

### Existing Commands

#### `/checkin`
Daily standup and progress tracking

#### `/git`
Git workflow automation

#### `/restart-dev`
Restart development server

## 🚀 Usage Examples

### Documentation Commands
```bash
# Update all documentation including plan.md
/docs

# Update only API documentation
/docs api

# Quick check what needs updating
/docs-check

# Generate release notes for minor version
/release-notes minor

# Generate release notes for specific version
/release-notes v2.1.0
```

### Debugging Commands
```bash
# Debug a complex API error
/debug API returning 500 on user creation

# Quick fix a type error
/debug-quick Property 'id' does not exist on type 'Room'

# Fix database schema mismatch
/debug-db notes table room_id column missing

# Debug failing E2E test
/debug-e2e Login flow failing on mobile

# Fix test coverage
/test-fix UserProfile component

# Generate bug report
/bug-report Notes section showing "Error Loading Notes"
```

## 🔒 Safety Features

All commands include:
- **Tool restrictions**: Only allowed tools can be used
- **Git safety**: Atomic commits for easy rollback
- **Test requirements**: Changes must pass tests
- **Migration safety**: Database backups before migrations
- **Performance checks**: No degradation allowed

## 🎯 Best Practices

1. **Start with `/debug-quick`** for simple issues
2. **Use `/debug`** for complex, unknown problems
3. **Always run `/test-fix`** after making changes
4. **Use `/bug-report`** before opening issues
5. **Run `/debug-db`** for any database-related errors

## 📝 Command Customization

Commands support:
- **$ARGUMENTS**: Dynamic input from user
- **$1, $2, $3**: Positional arguments
- **!`command`**: Bash command execution for context
- **@file**: Include file contents

## 🔧 Configuration

Each command includes:
- `allowed-tools`: Restricted tool access for safety
- `argument-hint`: Usage hints
- `description`: Command purpose
- `model`: Optimized model selection

## 🤝 Contributing

To add new debugging commands:
1. Create a `.md` file in this directory
2. Add frontmatter with configuration
3. Follow the structured workflow pattern
4. Include safety protocols
5. Document in this README

## 📊 Command Performance

| Command | Model | Speed | Thoroughness | Best For |
|---------|-------|-------|--------------|----------|
| **Documentation** | | | | |
| `/docs` | Sonnet | Medium | Very High | Full documentation + plan updates |
| `/docs-check` | Haiku | Fast | Medium | Quick status checks |
| `/release-notes` | Sonnet | Medium | High | Release preparation |
| **Debugging** | | | | |
| `/debug` | Sonnet | Slower | Very High | Complex bugs |
| `/debug-quick` | Haiku | Fast | Medium | Simple fixes |
| `/debug-db` | Sonnet | Medium | High | Database issues |
| `/debug-e2e` | Sonnet | Slower | High | UI bugs |
| `/test-fix` | Sonnet | Medium | High | Test coverage |
| `/bug-report` | Haiku | Fast | High | Issue documentation |

## 🔗 Related Documentation

- [Claude Code Slash Commands](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
- [Playwright MCP](https://github.com/executeautomation/mcp-playwright)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/error-handling)