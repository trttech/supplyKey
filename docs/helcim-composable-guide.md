# Helcim Note

This starter does not include the Helcim integration from either source repository.

That was intentional:

- `midwives` includes backend payment and customer flows that are not part of a minimal starter
- `dashboard` includes frontend Helcim composables tied to that product surface

If you want Helcim in the starter later, the structure to reuse is:

1. Shared client and schemas from the source repo `shared/helcim`
2. Server utilities and API endpoints
3. Frontend composable and checkout pages

For now the starter keeps auth, database, queue, and dashboard shell as the reusable baseline.
