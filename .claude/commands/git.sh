#!/bin/bash
set -e

# Enhanced Git Workflow with CodeRabbit Integration
# Usage: /git [mode] [commit-message]
# Modes: quick, safe, strict, skip, force

# Parse arguments
MODE="${1:-safe}"
COMMIT_MSG="${2:-}"

# If first arg looks like a commit message (starts with quotes or contains spaces), treat as message
if [[ "$MODE" =~ ^[\"\'[:space:]] ]] || [[ "$MODE" == *" "* ]]; then
  COMMIT_MSG="$MODE"
  MODE="safe"
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐢 Sea Turtle Git Workflow - Mode: $MODE${NC}"

# Step 1: Check for staged/unstaged changes
echo -e "\n${BLUE}📋 Checking git status...${NC}"
if [[ -z $(git status -s) ]]; then
  echo -e "${YELLOW}⚠️  No changes to commit${NC}"
  exit 0
fi

# Step 2: Stage all changes
echo -e "\n${BLUE}➕ Staging changes...${NC}"
git add -A
git status --short

# Step 3: Run linter (if not in force mode)
if [[ "$MODE" != "force" ]]; then
  echo -e "\n${BLUE}🔍 Running ESLint...${NC}"
  if command -v npm &> /dev/null; then
    if npm run lint 2>&1 | tee /tmp/lint-output.txt; then
      echo -e "${GREEN}✅ Linting passed${NC}"
    else
      LINT_EXIT_CODE=$?
      if [[ "$MODE" == "strict" ]]; then
        echo -e "${RED}❌ Linting failed in strict mode - blocking commit${NC}"
        cat /tmp/lint-output.txt
        exit $LINT_EXIT_CODE
      else
        echo -e "${YELLOW}⚠️  Linting warnings detected (continuing in $MODE mode)${NC}"
      fi
    fi
  else
    echo -e "${YELLOW}⚠️  npm not found, skipping linting${NC}"
  fi
fi

# Step 4: Run CodeRabbit review (if not in skip/force mode)
if [[ "$MODE" != "skip" && "$MODE" != "force" ]]; then
  echo -e "\n${BLUE}🤖 Running CodeRabbit AI review...${NC}"
  if command -v coderabbit &> /dev/null; then
    # Use --plain flag and pipe to cat to prevent interactive mode issues
    REVIEW_OUTPUT=$(coderabbit review --type uncommitted --plain -c CLAUDE.md 2>&1 | cat || echo "CodeRabbit review failed")

    echo "$REVIEW_OUTPUT"

    # Check for critical issues in output
    if echo "$REVIEW_OUTPUT" | grep -iq "critical\|error\|security"; then
      if [[ "$MODE" == "strict" ]]; then
        echo -e "${RED}❌ CodeRabbit found critical issues in strict mode - blocking commit${NC}"
        exit 1
      else
        echo -e "${YELLOW}⚠️  CodeRabbit found issues (continuing in $MODE mode)${NC}"
      fi
    else
      echo -e "${GREEN}✅ CodeRabbit review completed${NC}"
    fi
  else
    echo -e "${YELLOW}⚠️  CodeRabbit CLI not found, skipping AI review${NC}"
    echo -e "${YELLOW}    Install: npm install -g @coderabbitai/cli${NC}"
  fi
fi

# Step 5: Generate commit message if not provided
if [[ -z "$COMMIT_MSG" ]]; then
  echo -e "\n${BLUE}✍️  Generating AI commit message...${NC}"

  # Get diff for AI analysis
  DIFF_SUMMARY=$(git diff --cached --stat)
  DIFF_CONTENT=$(git diff --cached | head -100)

  # Simple commit message generation based on files changed
  if echo "$DIFF_SUMMARY" | grep -q "components/"; then
    if echo "$DIFF_CONTENT" | grep -q "fix\|bug\|error"; then
      PREFIX="fix"
    elif echo "$DIFF_CONTENT" | grep -q "feat\|add\|new"; then
      PREFIX="feat"
    else
      PREFIX="refactor"
    fi
  elif echo "$DIFF_SUMMARY" | grep -q "\.md"; then
    PREFIX="docs"
  else
    PREFIX="chore"
  fi

  # Extract main file changed
  MAIN_FILE=$(echo "$DIFF_SUMMARY" | head -1 | awk '{print $1}')

  COMMIT_MSG="${PREFIX}: Update ${MAIN_FILE}"
fi

# Step 6: Create commit
echo -e "\n${BLUE}💾 Creating commit...${NC}"
git commit -m "$(cat <<EOF
${COMMIT_MSG}

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# Step 7: Push to remote
echo -e "\n${BLUE}🚀 Pushing to remote...${NC}"
if git push origin main; then
  echo -e "\n${GREEN}✅ Successfully pushed to remote!${NC}"
else
  echo -e "\n${RED}❌ Push failed${NC}"
  exit 1
fi

echo -e "\n${GREEN}🎉 Git workflow completed successfully!${NC}"
