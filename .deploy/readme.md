# SupplyKey VPS Deployment Guide

This guide mirrors the `www/midwives` VPS approach and adapts it to `supplyKey`'s actual stack:

- Nuxt 4 SSR app
- Nitro `node-server` output
- PostgreSQL
- Kysely migrations
- `pg-boss` queue
- Nodemailer / SMTP
- PM2 process manager
- Nginx reverse proxy

Target host assumption: Debian 13 on a single VPS with PostgreSQL running on the same machine.

## Deployment Layout

- App directory: `/opt/supplyKey`
- App user: `supplykey`
- PM2 app name: `supplykey`
- Internal app bind: `127.0.0.1:3101`
- Public entrypoint: Nginx on `:80` or `:443`

## Repo Assets

- Nginx config: [`.deploy/vps/nginx/supplykey.conf`](/c:/Users/axel_/www/supplyKey/.deploy/vps/nginx/supplykey.conf)
- PM2 config: [`.deploy/vps/pm2/ecosystem.config.cjs`](/c:/Users/axel_/www/supplyKey/.deploy/vps/pm2/ecosystem.config.cjs)
- Deploy script: [`.deploy/vps/scripts/deploy.sh`](/c:/Users/axel_/www/supplyKey/.deploy/vps/scripts/deploy.sh)
- Nginx setup script: [`.deploy/vps/scripts/setup-nginx.sh`](/c:/Users/axel_/www/supplyKey/.deploy/vps/scripts/setup-nginx.sh)
- GitHub Actions workflow: [`.github/workflows/deploy-vps.yml`](/c:/Users/axel_/www/supplyKey/.github/workflows/deploy-vps.yml)

## 1. System Packages

Install the required system dependencies as `root`:

```bash
apt-get update
apt-get install -y curl git nginx postgresql postgresql-contrib apache2-utils
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt-get install -y nodejs
corepack enable
npm install -g pm2
```

This repo requires Node 24 and Yarn 4. PM2 runs the built Nitro server directly from `.output/server/index.mjs`.

## 2. One-Time Host Setup

```bash
useradd --system --create-home --shell /usr/sbin/nologin supplykey
mkdir -p /opt/supplyKey
chown -R supplykey:supplykey /opt/supplyKey
```

## 3. Clone the Repository

If your deploy SSH key is attached to `root`, clone as `root` and then hand ownership back to the app user:

```bash
cd /opt
git clone <YOUR_GIT_REMOTE> supplyKey
chown -R supplykey:supplykey /opt/supplyKey
cd /opt/supplyKey
```

## 4. Create PostgreSQL Database and User

Create a dedicated database role instead of reusing `postgres`:

```bash
sudo -u postgres psql
```

```sql
CREATE ROLE supplykey_app WITH LOGIN PASSWORD 'Zz7REzVt3y';
CREATE DATABASE supplykey OWNER supplykey_app;
\q
```

If PostgreSQL is local to the VPS, keep `DB_SSL=false`.

## 5. Create Production Environment File

Copy the starter env file and edit it:

```bash
cd /opt/supplyKey
cp .env.example .env
chown supplykey:supplykey .env
nano .env
```

Recommended production baseline:

```dotenv
PORT=3101
HOST=127.0.0.1
NODE_ENV=production

NUXT_PUBLIC_APP_NAME="SupplyKey Industrial"
NUXT_PUBLIC_BASE_URL="https://app.supplykey.ca"
NUXT_SESSION_PASSWORD="generate-a-random-string-with-at-least-32-characters"

AUTH_MAGIC_LINK_TTL_MINUTES=20

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=supplykey_app
DB_PASSWORD=replace-with-a-strong-password
DB_NAME=supplykey
DB_SSL=false
DATABASE_URL=postgresql://supplykey_app:replace-with-a-strong-password@127.0.0.1:5432/supplykey

MAIL_MODE=smtp
SMTP_HOST=127.0.0.1
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_POOL=true
SMTP_MAX_CONNECTIONS=5
SMTP_MAX_MESSAGES=100
SMTP_TLS_REJECT_UNAUTHORIZED=false
SMTP_USER=
SMTP_PASS=
MAILER_DEFAULT_FROM="SupplyKey <noreply@app.supplykey.ca>"
MAILER_DEFAULT_REPLY_TO="support@app.supplykey.ca"
MAILER_DEFAULT_PRIORITY=normal

PGBOSS_APP_NAME=supplykey_queue
PGBOSS_SCHEMA=queue
PGBOSS_MIGRATE=true
PGBOSS_MAX_CONN=10
```

Notes:

- `NUXT_SESSION_PASSWORD` must be long and random. Treat it as a secret.
- `MAIL_MODE=console` is fine for smoke testing, but production should use real SMTP.
- `PGBOSS_MIGRATE=true` lets `pg-boss` manage its own schema objects on startup.
- Keep `NUXT_PUBLIC_BASE_URL` set to the real HTTPS origin used by the app.

## 6. Configure Nginx

The repo already includes the Nginx site config at [`.deploy/vps/nginx/supplykey.conf`](/c:/Users/axel_/www/supplyKey/.deploy/vps/nginx/supplykey.conf).

Install it with the helper script:

```bash
cd /opt/supplyKey
sudo bash .deploy/vps/scripts/setup-nginx.sh
```

If you want temporary basic auth like the `midwives` deployment, create a password file and add `auth_basic` directives:

```bash
htpasswd -c /etc/nginx/.htpasswd-supplykey admin
```

## 7. Deploy

Use the repo script for first boot and every redeploy:

```bash
cd /opt/supplyKey
sudo bash .deploy/vps/scripts/deploy.sh
```

The deploy script handles:

- `git fetch/checkout/pull`
- `yarn install --immutable`
- DB migrations
- Nuxt build
- PM2 restart or first start
- `pm2 save`

Useful overrides:

```bash
DEPLOY_BRANCH=main sudo bash .deploy/vps/scripts/deploy.sh
RUN_DB_SEED=true sudo bash .deploy/vps/scripts/deploy.sh
```

Do not use `RUN_DB_SEED=true` on a live production database unless you explicitly want the demo reset behavior.

## 8. PM2 Startup

The deploy script manages the PM2 app itself. The only separate PM2 step is enabling startup on reboot:

```bash
pm2 startup systemd -u supplykey --hp /home/supplykey
```

Run the command PM2 prints, then save again:

```bash
sudo -u supplykey pm2 save
```

## 9. GitHub Actions Deployment

The repo already includes a workflow at [`.github/workflows/deploy-vps.yml`](/c:/Users/axel_/www/supplyKey/.github/workflows/deploy-vps.yml) that SSHes into the VPS and runs the deploy script on pushes to `main`.

Suggested repository secrets:

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_PORT`

If you prefer a protected deployment branch, change both the workflow trigger and the `DEPLOY_BRANCH` value used by the server-side script.

## 10. Smoke Checks

After each deploy:

```bash
sudo -u supplykey pm2 status
sudo -u supplykey pm2 logs supplykey --lines 100
curl -I http://127.0.0.1:3101
systemctl status nginx
tail -n 100 /var/log/nginx/supplykey.error.log
```

Application-specific checks:

- Open `/auth/login` and request a magic link.
- Confirm the mail path works for the configured `MAIL_MODE`.
- Confirm the dashboard loads after authentication.
- Confirm a queue-backed path still works after boot, since `pg-boss` initializes on Nitro startup.

## 11. Operational Notes

- The app expects PostgreSQL, SMTP, and the queue schema to be reachable during startup.
- `server/db/migrate.ts` is the migration entrypoint used by this repo.
- `server/db/seed.ts` is destructive for demo data and should stay out of normal production deploys.
- This repo already bakes in `NITRO_PRESET=node-server` in `package.json`, but setting it explicitly during deploy keeps the build intent unambiguous.
- `DB_SSL=true` currently uses strict certificate validation in the app code. If you move to managed Postgres, verify the server certificate chain before enabling it.
- TLS is assumed to be handled outside these repo scripts. No Certbot setup is required by this deployment guide.
