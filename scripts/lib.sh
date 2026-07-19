#!/usr/bin/env bash
# Shared helpers for the deploy scripts.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

load_config() {
  if [ -f "$ROOT/deploy.config" ]; then
    # shellcheck disable=SC1091
    source "$ROOT/deploy.config"
  else
    echo "!! No deploy.config found. Copy deploy.config.example -> deploy.config and fill it in." >&2
    exit 1
  fi
}

need() {
  command -v "$1" >/dev/null 2>&1 || { echo "!! Required command '$1' not found on PATH." >&2; exit 1; }
}

# Files that make up the deployable site (everything a browser needs, nothing else).
SITE_INCLUDE=(index.html 404.html web.config css js config content assets)

# Stage a clean copy of just the site into $1
stage_site() {
  local dest="$1"
  rm -rf "$dest"; mkdir -p "$dest"
  local item
  for item in "${SITE_INCLUDE[@]}"; do
    [ -e "$ROOT/$item" ] && cp -r "$ROOT/$item" "$dest/"
  done
}
