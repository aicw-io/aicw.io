#!/bin/bash
# script/push-pr.sh - Full PR workflow automation
# Usage: ./script/push-pr.sh "branch-name" "commit message"

set -e

# Check if we're on main branch FIRST
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Must be on 'main' branch. Currently on '$CURRENT_BRANCH'. Exiting."
    exit 1
fi

# Check if there are any changes to commit
if git diff --quiet && git diff --cached --quiet; then
    echo "❌ No changes to commit. Exiting."
    exit 0
fi

BRANCH="${1:-$(date +%Yjan%d)-update}"
MSG="${2:-Quick update}"

echo "📦 Creating branch: $BRANCH"
git checkout -b "$BRANCH"

echo "📝 Staging all changes and committing..."
git add .
git commit -m "$MSG"

echo "🚀 Pushing to origin..."
git push --set-upstream origin "$BRANCH"

echo "🔀 Creating and merging PR..."
gh pr create --title "$MSG" --body "Automated PR via push-pr script" --base main
gh pr merge --auto --squash --delete-branch

echo "🏠 Returning to main..."
git checkout main
git pull

echo "✅ Done! Changes merged to main."