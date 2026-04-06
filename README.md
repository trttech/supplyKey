# Fullstack Nuxt Starter

Starter template
## Included

- Nuxt 4 SSR app shell
- Magic-link auth with `nuxt-auth-utils`
- PostgreSQL + Kysely
- `pg-boss` background queue
- Console or SMTP mail delivery
- Dashboard layout with reusable datatable components
- Protected example pages backed by real server routes

## Quick start

```bash
cp .env.example .env
yarn install
make db-up
yarn db:migrate
yarn dev
```

Open `http://localhost:3000`.

With `MAIL_MODE=console`, auth links are printed to the server logs. If you want real local email delivery, set `MAIL_MODE=smtp` and keep Mailpit running on `http://localhost:8025`.

## Example flow

1. Visit `/auth/login`
2. Request a magic link
3. Open the link from the server log or Mailpit
4. Land in the protected dashboard
5. Review the `/users` page for the starter datatable pattern

## Commands

```bash
yarn dev
yarn build
yarn lint
yarn typecheck
yarn db:migrate
yarn db:status
```
