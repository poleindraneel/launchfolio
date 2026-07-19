#!/usr/bin/env bash
# Preview the site locally at http://localhost:8080
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
PORT="${1:-8080}"
echo "launchfolio → http://localhost:$PORT  (Ctrl+C to stop)"
if command -v python >/dev/null 2>&1; then
  python -m http.server "$PORT"
elif command -v python3 >/dev/null 2>&1; then
  python3 -m http.server "$PORT"
elif command -v npx >/dev/null 2>&1; then
  npx --yes serve -l "$PORT" .
else
  echo "Need python or npx to serve. Install one, or open index.html via any static server." >&2
  exit 1
fi
