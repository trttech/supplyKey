# Fullstack Nuxt Starter

Starter template
## Included

- Nuxt 4 SSR app shell
- Magic-link auth with `nuxt-auth-utils`
- PostgreSQL + Kysely
- `pg-boss` background queue
- SMTP mail delivery through Mailpit locally or provider credentials in production
- Dashboard layout with reusable datatable components
- Protected example pages backed by real server routes

## Quick start

```bash
cp .env.example .env
yarn install
make up
make db-migrate
yarn dev
```

Open `http://localhost:3000`.

Email is always sent through SMTP. In development, Docker Compose runs Mailpit and exposes its inbox at `http://localhost:3031`; local `yarn dev` sends to `localhost:1025`, while the app container overrides `SMTP_HOST=mailpit`. In production, set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_TLS_REJECT_UNAUTHORIZED=true`.

## Example flow

1. Visit `/auth/login`
2. Request a magic link
3. Open the link from Mailpit
4. Land in the protected dashboard
5. Review the `/users` page for the starter datatable pattern

## Commands

```bash
make up
make db-migrate
make db-gen-types
make db-status
make db-shell
yarn dev
yarn build
make lint
make typecheck
```

`make db-migrate` also refreshes generated Kysely types into `server/db/types.d.ts` via the repo's [`.kysely-codegenrc.json`](/Users/macmini1/www/fullstack-nuxt-starter/.kysely-codegenrc.json). The starter still keeps [server/db/types.ts](/Users/macmini1/www/fullstack-nuxt-starter/server/db/types.ts) as the hand-authored runtime schema contract unless you choose to switch over fully.
