#!/bin/bash
set -e

# =============================================================================
# Upload CDN Assets to AWS S3
# =============================================================================
#
# Usage: ./script/upload-cdn-assets.sh
#
# Prerequisites:
#   - AWS CLI installed and configured
#   - Environment variables set in aicw-app/script/.env:
#     - AWS_ACCESS_KEY_ID
#     - AWS_SECRET_ACCESS_KEY
#     - CLOUDFRONT_DISTRIBUTION_ID
#
# What this script does:
#   1. Validates AWS credentials
#   2. Uploads all files from public-cdn.aicw.io/ to S3
#   3. Optionally invalidates CloudFront cache
#
# =============================================================================

# Configuration
S3_BUCKET="cdn.aicw.io"
S3_REGION="eu-central-1"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE_DIR="$PROJECT_ROOT/public-cdn.aicw.io"

# Load .env file from aicw-app/script (same credentials as tracker)
ENV_FILE="$PROJECT_ROOT/../aicw-app/script/.env"
if [[ -f "$ENV_FILE" ]]; then
    set -a
    source "$ENV_FILE"
    set +a
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
GRAY='\033[0;90m'
NC='\033[0m'

log_info() { echo -e "${BLUE}$1${NC}"; }
log_success() { echo -e "${GREEN}$1${NC}"; }
log_warning() { echo -e "${YELLOW}$1${NC}"; }
log_error() { echo -e "${RED}$1${NC}"; }
log_gray() { echo -e "${GRAY}$1${NC}"; }

print_separator() {
    echo -e "${GRAY}$(printf '─%.0s' {1..50})${NC}"
}

echo ""
log_info "📤 Uploading CDN Assets to S3..."
print_separator

# =============================================================================
# Step 1: Validate Prerequisites
# =============================================================================
log_info "📋 Step 1/3: Validating prerequisites..."

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    log_error "❌ AWS CLI not found. Install with: brew install awscli"
    exit 1
fi
log_gray "   ✓ AWS CLI found"

# Check AWS credentials
if [[ -z "$AWS_ACCESS_KEY_ID" ]]; then
    log_error "❌ AWS_ACCESS_KEY_ID not set"
    log_error "   Add credentials to: $ENV_FILE"
    exit 1
fi
log_gray "   ✓ AWS_ACCESS_KEY_ID is set"

if [[ -z "$AWS_SECRET_ACCESS_KEY" ]]; then
    log_error "❌ AWS_SECRET_ACCESS_KEY not set"
    exit 1
fi
log_gray "   ✓ AWS_SECRET_ACCESS_KEY is set"

# Check source directory
if [[ ! -d "$SOURCE_DIR" ]]; then
    log_error "❌ Source directory not found: $SOURCE_DIR"
    exit 1
fi
log_gray "   ✓ Source directory: $SOURCE_DIR"

# Count files to upload
FILE_COUNT=$(find "$SOURCE_DIR" -type f ! -name '.DS_Store' | wc -l | tr -d ' ')
log_gray "   ✓ Files to upload: $FILE_COUNT"

echo ""

# =============================================================================
# Step 2: Upload files to S3
# =============================================================================
log_info "📋 Step 2/3: Uploading files to S3..."

# Upload each file with appropriate content-type
find "$SOURCE_DIR" -type f ! -name '.DS_Store' | while read -r file; do
    # Get relative path from SOURCE_DIR
    rel_path="${file#$SOURCE_DIR/}"

    # Determine content-type
    case "${file##*.}" in
        pdf)  content_type="application/pdf" ;;
        epub) content_type="application/epub+zip" ;;
        png)  content_type="image/png" ;;
        jpg|jpeg) content_type="image/jpeg" ;;
        webp) content_type="image/webp" ;;
        svg)  content_type="image/svg+xml" ;;
        html) content_type="text/html" ;;
        js)   content_type="application/javascript" ;;
        css)  content_type="text/css" ;;
        json) content_type="application/json" ;;
        *)    content_type="application/octet-stream" ;;
    esac

    # Upload to S3
    aws s3 cp "$file" "s3://${S3_BUCKET}/${rel_path}" \
        --region "$S3_REGION" \
        --content-type "$content_type" \
        --cache-control "public, max-age=31536000, immutable" \
        --metadata-directive REPLACE \
        > /dev/null 2>&1

    file_size=$(du -h "$file" | cut -f1)
    log_gray "   ✓ $rel_path ($file_size)"
done

log_success "   ✓ All files uploaded"
echo ""

# =============================================================================
# Step 3: Invalidate CloudFront (optional)
# =============================================================================
log_info "📋 Step 3/3: CloudFront cache..."

if [[ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]]; then
    read -p "   Invalidate CloudFront cache? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        INVALIDATION_ID=$(aws cloudfront create-invalidation \
            --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
            --paths "/assets/*" \
            --query 'Invalidation.Id' \
            --output text)
        log_gray "   Invalidation ID: $INVALIDATION_ID"
        log_success "   ✓ Cache invalidation started"
    else
        log_gray "   Skipped cache invalidation"
    fi
else
    log_gray "   CLOUDFRONT_DISTRIBUTION_ID not set, skipping invalidation"
fi

echo ""

# =============================================================================
# Done!
# =============================================================================
print_separator
log_success "✅ Upload complete!"
echo ""
echo "   Files are now available at:"
echo "   https://cdn.aicw.io/assets/..."
echo ""
echo "   Example:"
echo "   https://cdn.aicw.io/assets/book/ai-seo-guide/AI%20Search%20Engine%20Optimization%20Guide.pdf"
echo ""
