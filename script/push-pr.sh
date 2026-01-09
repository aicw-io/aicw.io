#!/bin/bash
# Usage: ./scripts/push-pr.sh "branch-name" "commit message"

set -e

BRANCH="${1:?Branch name required}"
MSG="${2:?Commit message required}"

echo "📦 Creating branch: $BRANCH"
git checkout -b "$BRANCH"

echo "📝 Staging and committing..."
git add .
git commit -m "$MSG"

echo "🚀 Pushing to origin..."
git push --set-upstream origin "$BRANCH"

echo "🔀 Creating and merging PR..."
gh pr create --title "$MSG" --body "Automated via push-pr script" --base main
gh pr merge --auto --squash --delete-branch

echo "🏠 Returning to main..."
git checkout main
git pull

echo "✅ Done! Changes merged to main."