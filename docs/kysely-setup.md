# Kysely Setup

This starter keeps the database layer intentionally small but structured the same way as `midwives`.

## Files to know

- `server/db/base.ts`: singleton Kysely connection
- `server/db/migrate.ts`: custom migration runner
- `server/db/migrations/*`: schema history
- `server/db/repository/*`: query helpers you can grow by domain
- `server/db/types.ts`: hand-authored database types for the starter schema

## Local flow

```bash
cp .env.example .env
make db-up
yarn db:migrate
```

## How to extend it

1. Add a new migration in `server/db/migrations`
2. Update `server/db/types.ts`
3. Add or extend a repository under `server/db/repository`
4. Consume that repository from Nitro routes

The starter keeps types manual to stay lightweight. If you want generated DB types later, add `kysely-codegen` back in.

