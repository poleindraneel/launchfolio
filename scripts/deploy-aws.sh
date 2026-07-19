#!/usr/bin/env bash
# Deploy launchfolio to AWS S3 (+ optional CloudFront invalidation).
# Prereqs: AWS CLI (aws), credentials configured, an existing bucket
# (and CloudFront distribution) — see docs/DEPLOY.md for one-time setup.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$DIR/lib.sh"
load_config
need aws

: "${AWS_S3_BUCKET:?set AWS_S3_BUCKET in deploy.config}"
REGION_ARG=()
[ -n "${AWS_REGION:-}" ] && REGION_ARG=(--region "$AWS_REGION")

TMP="$(mktemp -d)"; STAGE="$TMP/site"
stage_site "$STAGE"
# web.config is IIS-only; not needed on S3.
rm -f "$STAGE/web.config"

echo "Syncing to s3://$AWS_S3_BUCKET …"
# Long-cache the hashed-ish assets, but keep HTML/JS/config fresh.
aws s3 sync "$STAGE" "s3://$AWS_S3_BUCKET" --delete \
  --exclude "*.html" --exclude "*.js" \
  --cache-control "public,max-age=86400" "${REGION_ARG[@]}"
aws s3 sync "$STAGE" "s3://$AWS_S3_BUCKET" \
  --exclude "*" --include "*.html" --include "*.js" \
  --cache-control "public,max-age=300" "${REGION_ARG[@]}"

if [ -n "${AWS_CLOUDFRONT_DISTRIBUTION_ID:-}" ]; then
  echo "Invalidating CloudFront $AWS_CLOUDFRONT_DISTRIBUTION_ID …"
  aws cloudfront create-invalidation \
    --distribution-id "$AWS_CLOUDFRONT_DISTRIBUTION_ID" --paths "/*" >/dev/null
fi

rm -rf "$TMP"
echo "Done."
