#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/supplyKey}"
APP_USER="${APP_USER:-supplykey}"
APP_NAME="${APP_NAME:-supplykey}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env}"
PM2_CONFIG="${PM2_CONFIG:-$APP_DIR/.deploy/vps/pm2/ecosystem.config.cjs}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
RUN_DB_SEED="${RUN_DB_SEED:-false}"

echo "=========================================================="
echo " Step 1: Checking environment and app user"
echo "=========================================================="
if [ ! -f "$ENV_FILE" ]; then
	echo "ERROR: Missing env file at $ENV_FILE"
	echo "Create it from .env.example before deploying."
	exit 1
fi

if ! id "$APP_USER" >/dev/null 2>&1; then
	echo "ERROR: System user '$APP_USER' does not exist."
	exit 1
fi

if [ ! -d "$APP_DIR/.git" ]; then
	echo "ERROR: $APP_DIR is not a git repository."
	exit 1
fi

echo ""
echo "=========================================================="
echo " Step 2: Pulling latest code from $DEPLOY_BRANCH"
echo "=========================================================="
cd "$APP_DIR"
git fetch origin "$DEPLOY_BRANCH"
if git show-ref --verify --quiet "refs/heads/$DEPLOY_BRANCH"; then
	git checkout "$DEPLOY_BRANCH"
else
	git checkout -b "$DEPLOY_BRANCH" "origin/$DEPLOY_BRANCH"
fi
git pull --rebase origin "$DEPLOY_BRANCH"
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

echo ""
echo "=========================================================="
echo " Step 3: Installing dependencies"
echo "=========================================================="
if command -v corepack >/dev/null 2>&1; then
	corepack enable
fi

sudo -u "$APP_USER" yarn install --immutable

echo ""
echo "=========================================================="
echo " Step 4: Running database migrations"
echo "=========================================================="
sudo -u "$APP_USER" npx tsx --env-file="$ENV_FILE" server/db/migrate.ts latest

if [ "$RUN_DB_SEED" = "true" ]; then
	echo ""
	echo "=========================================================="
	echo " Step 4b: Running demo seed"
	echo "=========================================================="
	sudo -u "$APP_USER" npx tsx --env-file="$ENV_FILE" server/db/seed.ts
fi

echo ""
echo "=========================================================="
echo " Step 5: Building Nuxt app"
echo "=========================================================="
sudo -u "$APP_USER" env NITRO_PRESET=node-server yarn build

echo ""
echo "=========================================================="
echo " Step 6: Restarting PM2"
echo "=========================================================="
if ! command -v pm2 >/dev/null 2>&1; then
	echo "Installing PM2 globally..."
	npm install -g pm2
fi

sudo -u "$APP_USER" pm2 restart "$PM2_CONFIG" --update-env --env production || sudo -u "$APP_USER" pm2 start "$PM2_CONFIG" --env production
sudo -u "$APP_USER" pm2 save

echo ""
echo "**********************************************************"
echo " Deployment complete"
echo "**********************************************************"
echo "Check status with: sudo -u $APP_USER pm2 status"
echo "Check logs with: sudo -u $APP_USER pm2 logs $APP_NAME"
