#!/usr/bin/env bash
# Deploy launchfolio to Azure App Service (Windows) via zip deploy.
# Prereqs: Azure CLI (az), logged in (`az login`). Settings in deploy.config.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$DIR/lib.sh"
load_config
need az; need zip

: "${AZURE_RESOURCE_GROUP:?set AZURE_RESOURCE_GROUP in deploy.config}"
: "${AZURE_APP_NAME:?set AZURE_APP_NAME in deploy.config}"

TMP="$(mktemp -d)"; STAGE="$TMP/site"; ZIP="$TMP/site.zip"
stage_site "$STAGE"
( cd "$STAGE" && zip -qr "$ZIP" . )

echo "Deploying to Azure App Service '$AZURE_APP_NAME' (rg: $AZURE_RESOURCE_GROUP)…"
az webapp deploy \
  --resource-group "$AZURE_RESOURCE_GROUP" \
  --name "$AZURE_APP_NAME" \
  --src-path "$ZIP" --type zip --clean true --restart true

rm -rf "$TMP"
echo "Done → https://$AZURE_APP_NAME.azurewebsites.net/"
