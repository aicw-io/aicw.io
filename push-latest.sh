#!/bin/bash
set -euo pipefail

# Colors for beautiful output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }
log_step() { echo -e "\n${BLUE}→${NC} $1"; }

branch_name="$(date +'%y%m%d%H%M%S')Update"

# Check for gh CLI
if ! command -v gh &> /dev/null; then
  log_error "GitHub CLI (gh) not installed. Please install it first."
  exit 1
fi

# Ensure we're on main and up to date
log_step "Ensuring main branch is up to date..."
current_branch=$(git branch --show-current)
if [[ "$current_branch" != "main" ]]; then
  log_warning "Not on main branch, switching..."
  git checkout main
fi
git pull origin main
log_success "Main branch is up to date"

# Check if there are changes to commit
log_step "Checking for changes..."
if [[ -z $(git status --porcelain) ]]; then
  log_warning "No changes to commit. Exiting."
  exit 0
fi
git status --short
log_info "Found changes to commit"

# Create new branch BEFORE committing
log_step "Creating branch: $branch_name"
git checkout -b "$branch_name"
log_success "Created and switched to branch: $branch_name"

# Stage and commit on the new branch
log_step "Staging and committing changes..."
git add .
git commit -m 'latest update'
log_success "Changes committed"

# Push branch to origin
log_step "Pushing branch to origin..."
git push -u origin "$branch_name"
log_success "Branch pushed"

# Create pull request
log_step "Creating pull request..."
pr_url=$(gh pr create \
  --title "$branch_name: latest update" \
  --body "Auto-generated PR for latest update at $(date)" \
  --base main \
  --head "$branch_name")
log_success "PR created: $pr_url"

# Merge the PR (this waits for merge to complete, unlike --auto)
log_step "Merging pull request..."
gh pr merge --squash --delete-branch
log_success "PR merged and remote branch deleted"

# Switch back to main and pull
log_step "Switching back to main..."
git checkout main
git pull origin main
log_success "Main branch updated with merged changes"

# Delete local branch (may already be gone if --delete-branch worked)
log_step "Cleaning up local branch..."
git branch -d "$branch_name" 2>/dev/null || log_info "Local branch already cleaned up"

log_success "All done! Changes have been merged to main."
