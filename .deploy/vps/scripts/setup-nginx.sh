#!/usr/bin/env bash
set -euo pipefail

if [ "${EUID}" -ne 0 ]; then
	echo "Please run as root or with sudo."
	exit 1
fi

SCRIPT_DIR=$(dirname "$(realpath "$0")")
VPS_DIR=$(dirname "$SCRIPT_DIR")
CONF_FILE="${CONF_FILE:-$VPS_DIR/nginx/supplykey.conf}"
TARGET_NAME="${TARGET_NAME:-supplykey}"
TARGET_FILE="/etc/nginx/sites-available/$TARGET_NAME"
TARGET_LINK="/etc/nginx/sites-enabled/$TARGET_NAME"

echo "=========================================================="
echo " Step 1: Copying Nginx configuration"
echo "=========================================================="
if [ ! -f "$CONF_FILE" ]; then
	echo "ERROR: Nginx config not found at $CONF_FILE"
	exit 1
fi

cp "$CONF_FILE" "$TARGET_FILE"

echo ""
echo "=========================================================="
echo " Step 2: Enabling site"
echo "=========================================================="
ln -sfn "$TARGET_FILE" "$TARGET_LINK"

echo ""
echo "=========================================================="
echo " Step 3: Testing and reloading Nginx"
echo "=========================================================="
nginx -t
systemctl reload nginx

echo ""
echo "Nginx configuration installed at $TARGET_FILE"
