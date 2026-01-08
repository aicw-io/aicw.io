#!/bin/bash
set -euo pipefail

branch_name="$(date +'%y%m%d%H%M%S')Update"

git status
git add .
git commit -m 'latest update'

# Create a new branch with the timestamp, switch to it, and push
git checkout -b "$branch_name"
git push -u origin "$branch_name"

# Create a pull request using GitHub CLI (gh)
if ! command -v gh &> /dev/null; then
  echo "GitHub CLI (gh) not installed. Please install it to create a PR automatically."
  exit 1
fi

gh pr create --title "$branch_name: latest update" --body "Auto-generated PR for latest update at $(date)" --base main --head "$branch_name" --fill

# Merge the pull request
gh pr merge --auto --squash

# Switch back to main, pull merged changes, and optionally delete branch locally
git checkout main
git pull origin main
git branch -d "$branch_name"

