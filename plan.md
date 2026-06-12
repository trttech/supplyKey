# supplyKey × Sage 300 — Integration Analysis & Development Plan

## 1. What supplyKey is today

A B2B procurement storefront: magic-link auth (`users` with admin/member roles), `products` (SKU, price_cents, stock_status), `cart_items`, `orders` + `order_items` (local order numbering, flat 1.5% tax, hardcoded carrier tiers), `enquiries` (RFQ threads), pg-boss queue (one job: `send-auth-link-email`), nodemailer, Kysely repositories, and a shared-types boundary (`shared/*`). Everything that matters for this integration already has a home: typed queue workers, repository layer, migration discipline, and a `queue.schedule` table (pg-boss cron) that is currently unused — that's the sync scheduler.

The important structural observation: **supplyKey currently treats itself as the system of record for products, prices, and orders. Sage 300 integration inverts that** — Sage becomes the source of truth for customers, items, prices, and order state; supplyKey becomes a synced storefront plus an outbox that pushes orders in.

## 2. Sage 300 Web API — verified surface

Confirmed from the Sage 300 SDK repo, endpoint references, and release notes:

### Mechanics

- URL shape: `{https}://{server}/Sage300WebApi/v1.0/-/{COMPANY}/{MODULE}/{Resource}` (e.g. `/-/SAMLTD/AR/ARCustomers`)
- **Auth is HTTP Basic only** — a dedicated Sage 300 user (e.g. `WEBAPI`) granted Web API security rights. No OAuth, no API keys, no webhooks. All inbound change detection is polling.
- OData query options: `$filter`, `$select`, `$top`, `$skip`, `$orderby`, `$expand`; append `('$template')` to any resource to get a sample payload.
- Verbs: GET / POST / PATCH (DELETE on some entities).
- Swagger UI + Swagger 2.0 JSON served per-company from the `{server}/Sage300WebApi` landing page — this is what feeds the SDK generator.

### Endpoints to use

| Purpose | Endpoint | Notes |
|---|---|---|
| Customer create/read/update | `AR/ARCustomers` | POST requires `CustomerNumber`, `GroupCode`, `AccountSet`, `BillingCycle`, `InterestProfile`, `Terms`, `TaxGroup`, `CurrencyCode`; also carries `CustomerPriceList` |
| Ship-to addresses | `AR/ARShipToLocations` | maps to `delivery_site` |
| Order creation | `OE/OEOrders` | POST with `CustomerNumber`, `OrderDate`, `OrderDetails[]` (`LineType: Item`, `Item`, `Location`, `QuantityOrdered`). **Sage computes unit prices — including contract pricing — taxes, and totals server-side and returns them.** Supports quote-type orders too |
| Order lifecycle | `OE/OEShipments`, `OE/OEInvoices` | poll to advance local order status (processing → shipped → invoiced) |
| Item catalog | `IC/ICItems`, `IC/ICCategories` | source of truth for `products` |
| List pricing | `IC/ICItemPricing`, `IC/ICPriceListCodes` | base/sale price per price list + currency (added in recent product updates — verify it appears in *the target installation's* Swagger; older builds documented it but didn't expose it) |
| Prepayments (if ever needed) | `AR/ARReceiptAndAdjustmentBatches` | |

### ⚠️ The one real gap: contract pricing has no standard Web API endpoint

Contract pricing lives in I/C (`ICPRICC`, the I/C Contract Pricing screen): per **customer + (item or category)**, with price type (fixed price / discount % / discount amount / cost-plus / customer type) and **start + expiration dates** — exactly the duration data to surface. Release notes through Sage 300 **2026** show the only new Web API endpoint is IC Manufacturers' Item; nothing for contract pricing. Options, in order of preference:

1. **Custom Web API endpoint via the Sage 300 Web SDK** (the VS Customization Wizard supports ISV endpoint projects; deploys into the same `Sage300WebApi` host, shows up in the same Swagger doc, so the SDK generation pipeline covers it for free). Read-only GET over the IC Contract Pricing view is a small, low-risk endpoint.
2. **Read-only SQL access to `ICPRICC`** in the Sage company database — common ISV practice, zero Sage-side development, but couples to schema internals and requires DB network access from the sync worker.
3. **Quote simulation** — POST a quote-type `OEOrders` and read back Sage-calculated line prices. Gets the *effective price* but **not** the contract duration/expiry, so it can't power expiry notifications alone. Useful as a cross-check, not the mechanism.

Recommendation: build the custom endpoint (option 1); fall back to option 2 if SDK development can't be deployed into the Sage environment. Either way, the supplyKey side is identical because everything lands in a local cache table.

## 3. Architecture

```
                         ┌─ supplyKey (Nuxt/Nitro) ─────────────────────────┐
 Customer browser ──────▶│ server/api/*  ──▶ repositories ──▶ Postgres      │
                         │      │                               ▲           │
                         │      ▼                               │           │
                         │  pg-boss queue ──▶ sage workers ─────┘           │
                         │                       │                          │
                         └───────────────────────┼──────────────────────────┘
                                                 ▼  Basic auth over HTTPS/VPN
                                  Sage 300 Web API (IIS, on-prem)
                                  AR/ARCustomers · OE/OEOrders · IC/* · custom ContractPricing
```

Principles:

- **The browser never talks to Sage.** All Sage calls happen in Nitro server code (consistent with the existing server-only DB rule).
- **No synchronous Sage calls in request handlers** except where the user is explicitly waiting on Sage (none in v1 — see flows below). Everything goes through typed pg-boss jobs: Sage's on-prem API is slow and occasionally down, and checkout must not depend on it being up.
- **Outbox pattern for writes, cache tables for reads.** Orders are written locally first, then pushed by a worker with retry. Items/prices/contract prices are pulled on schedule into Postgres and served from there.

### Code layout (new)

```
server/integrations/sage300/
  generated/            # SDK output from OpenAPI — never hand-edited (mirrors types.d.ts rule)
  client.ts             # Sage300Client: base URL/company/Basic auth from runtimeConfig,
                        #   timeouts, retry-with-backoff on 5xx/network, error normalization
  customers.ts          # provisionCustomer, findByNumber, nextCustomerNumber
  orders.ts             # pushOrder (OEOrders POST), fetchOrderStatus, fetchShipments
  pricing.ts            # pullItemPricing, pullContractPrices
  mapping.ts            # pure mappers: SupplyKey order → OEOrders payload, ICItem → product row
server/db/repository/
  sage-links.ts         # customer link CRUD + provisioning state machine
  contract-prices.ts    # cache CRUD, expiring-soon queries
  sage-outbox.ts        # order push outbox
shared/types/sage.ts    # SageLinkStatus, ContractPriceRow, OrderSyncStatus — frontend-safe DTOs
```

Mappers in `mapping.ts` stay pure so they're testable without a Sage connection.

### SDK generation pipeline

Sage emits **Swagger 2.0**, and the heavyweight generators produce bloated clients, so:

1. `curl -u WEBAPI:*** {server}/Sage300WebApi/swagger/docs/... > sage300.swagger.json` (exact JSON path is linked from the landing page; it's per-company but the schema is company-independent)
2. `npx swagger2openapi` → OpenAPI 3
3. `npx openapi-typescript` → types into `server/integrations/sage300/generated/schema.d.ts`, consumed by **`openapi-fetch`** (tiny, fetch-based, fits Nitro — no axios dependency)
4. Makefile target `sage-gen-sdk` chaining 1–3; commit the generated output like `types.d.ts`

The custom contract-pricing endpoint will appear in the same Swagger doc, so regeneration picks it up automatically.

## 4. Schema additions (4 migrations)

**`0009_create_sage_customer_links`** — don't overload `users`; a link table gives a provisioning state machine and leaves room for multiple users per customer account later (real B2B shape):

```
sage_customer_links: id PK, user_id FK UNIQUE, sage_customer_number text UNIQUE NULL,
  status enum('pending','provisioning','linked','failed'),
  last_error text NULL, provisioned_at, last_synced_at, created_at, updated_at
```

**`0010_create_contract_prices`** — local cache, refreshed by sync job:

```
contract_prices: id PK, sage_customer_number, item_number NULL, category_code NULL,
  price_type enum('fixed_price','discount_percent','discount_amount','cost_plus_percent',
                  'cost_plus_amount','customer_type'),
  price_value numeric, calculated_unit_price_cents NULL, currency,
  starts_on date NULL, expires_on date NULL,        -- NULLs = open-ended (matches Sage)
  synced_at, UNIQUE(sage_customer_number, item_number, category_code)

contract_price_notifications: id PK, contract_price_id FK, threshold enum('30d','7d','expired'),
  notified_at, UNIQUE(contract_price_id, threshold)
```

The separate notifications table (rather than flags) keeps the cache table truncate-and-reload-able without losing notification history.

**`0011_create_sage_order_outbox`**:

```
sage_order_outbox: id PK, order_id FK UNIQUE, status enum('pending','pushing','pushed','failed'),
  sage_order_number text NULL, sage_order_uniquifier text NULL,
  attempts int, last_error text NULL, pushed_at NULL, created_at, updated_at
```

`order_id UNIQUE` is the idempotency guard — OEOrders POST is not idempotent, so one outbox row = one Sage order, and the worker checks `status` before posting (and on ambiguous failure, queries Sage by PO number before retrying).

**`0012_alter_products_sage_fields`**: add `sage_item_number UNIQUE NULL`, `price_list_code NULL`, `sage_synced_at NULL` to `products`. Existing demo products keep working; synced items populate these.

Per CLAUDE.md flow: each migration ships with `types.ts` updates, `make db-gen-types`, repository updates, and `shared/types/sage.ts` exports.

## 5. Queue jobs (all following the existing typed-worker discipline)

| Job name | Trigger | What it does |
|---|---|---|
| `sage-provision-customer` | signup / admin create | POST `AR/ARCustomers` with defaults from config (GroupCode, AccountSet, Terms, TaxGroup, etc.), generated `CustomerNumber` (e.g. `WEB-{seq}`), then mark link `linked`. Retry 3×; on exhaustion mark `failed` for admin attention |
| `sage-push-order` | checkout | claim outbox row (`pending`→`pushing`), map order → OEOrders payload, POST, store returned order number + **Sage-calculated totals**, mark `pushed` |
| `sage-sync-order-status` | pg-boss cron, ~15 min | for orders in non-terminal states: poll OEOrders/OEShipments/OEInvoices, advance local `orders.status` |
| `sage-sync-catalog` | cron, nightly | pull `ICItems` (+`ICItemPricing` for base list prices) → upsert `products` |
| `sage-sync-contract-prices` | cron, every few hours | pull contract pricing (custom endpoint or SQL) for linked customers → upsert `contract_prices` |
| `sage-contract-expiry-scan` | cron, daily | find rows with `expires_on` within 30d/7d/past lacking a notification row → enqueue digest emails per customer |
| `send-contract-expiry-email` | from scan | one digest email per customer listing expiring contracts (mailer already in place) |

That's: names centralized in `workers/index.ts`, retry/expiry config in `config.ts`, typed convenience methods on the queue wrapper (`queue.provisionSageCustomer(...)`, `queue.pushOrderToSage(...)`), registration in `queue/index.ts` — six instances of the pattern that already exists once. Use pg-boss **singleton/throttle keys** on the cron jobs so overlapping runs can't double-sync, and `boss.schedule()` for the cron entries (the `queue.schedule` table is already there).

## 6. Nuxt API surface (new/changed)

### Customer-facing

- `GET /api/pricing/contracts` — current user's contract prices from cache: item, price type, computed price, `starts_on`/`expires_on`, days-remaining. Powers a "Contract Pricing" page (the datatable layer fits perfectly: faceted by category, sortable by expiry).
- `GET /api/account/sage-status` — link status for UI states ("account pending activation" while provisioning).
- `POST /api/orders` (existing, modified) — keep local order creation transactional as-is, add outbox row + enqueue `sage-push-order` in the same transaction. Returns immediately; order shows "submitting to ERP" until pushed.
- `GET /api/orders/[number]` (existing, extended) — include `sage_order_number` + sync status from outbox.

### Admin

- `POST /api/admin/customers` — create user + enqueue provisioning (the "we create accounts for customers" path).
- `POST /api/admin/customers/[id]/link` — link an *existing* Sage customer number to a user (validates via `GET ARCustomers('{num}')`). Needed constantly — most customers already exist in Sage.
- `POST /api/admin/customers/[id]/retry-provision` — re-enqueue after `failed`.
- `GET /api/admin/sage/health` — connectivity probe (cheap GET, e.g. a `$top=1` customers read) for an admin status widget.

**Signup flow note:** current auth creates a user on first magic-link request. Auto-provisioning a Sage AR customer from an unverified email is dangerous (ERP pollution). Gate it: enqueue `sage-provision-customer` only **after email verification** (`/auth/verify` success), and consider an admin-approval toggle in config for the public-signup path. The link-status endpoint lets the UI show "pending" honestly either way.

## 7. The pricing-authority decision (most important design call)

Today supplyKey computes totals itself (1.5% flat tax, hardcoded carrier prices). Once Sage is in the loop, **Sage's OE pricing engine is the only correct source** — it applies contract pricing, customer price lists, tax groups, and discounts that can't be replicated locally. So:

- Catalog/contract prices shown in the UI come from the **cache** and are labeled effectively as "your contract price" — fresh to within the sync interval.
- Cart/checkout shows cache-derived totals as an **estimate**.
- The pushed `OEOrders` response carries authoritative line prices and totals → write them back onto the local order (`order_items.unit_price_cents`, totals) so order history matches the eventual invoice. Drop or quarantine the local 1.5%-tax and carrier-fee logic behind the same write-back.
- Optional later: a "quote-type OEOrders" call at checkout for customers who want exact totals pre-submit — synchronous, so only behind an explicit user action.

## 8. Risks & constraints to plan around

- **Network topology:** Sage 300 Web API runs on customer-premise IIS. supplyKey (cloud) needs a route in: VPN/WireGuard tunnel, Cloudflare Tunnel, or IP-allowlisted HTTPS. TLS + Basic auth means credentials ride on every request — never expose the API host publicly without an allowlist.
- **No webhooks:** all inbound state (order status, price changes) is polling. The cron cadences above are the knobs; don't promise real-time stock in the UI.
- **Throughput:** the Web API is not fast. Page with `$top`/`$skip`, sync incrementally where possible, keep nightly full syncs off business hours.
- **Verify the installation's Swagger before building:** `ICItemPricing` in particular has version/PU-dependent availability. Day-1 task: hit the Swagger UI of the actual target system and diff against this plan.
- **Customer-number policy:** decide the web-originated numbering scheme (`WEB-xxxxx` vs. continuing an existing AR sequence) with whoever owns the Sage data — organizationally annoying to change later.
- **Failed provisioning / failed order push** must be visible: admin dashboard widgets over `sage_customer_links.status='failed'` and `sage_order_outbox.status='failed'`, plus an alert email job. An outbox that fails silently is worse than no integration.
- **Dev environment:** Sage ships `SAMLTD`/`SAMINC` sample companies — point dev/staging configs there; the company is just a URL segment, so config is one env var (`SAGE_COMPANY`).

## 9. Suggested build order

1. **Phase 0 — connectivity & SDK:** runtime config (`sage.baseUrl/company/user/password`), `Sage300Client`, `make sage-gen-sdk`, health endpoint. *Proves the pipe.*
2. **Phase 1 — customer linkage:** migration 0009, link repo, provisioning worker, admin create/link/retry endpoints, post-verification hook. *Proves writes.*
3. **Phase 2 — catalog & pricing reads:** migration 0012, catalog sync job; contract-pricing source decision (custom endpoint vs SQL), migration 0010, contract sync job, `/api/pricing/contracts` + UI page. *Proves reads + the gap workaround.*
4. **Phase 3 — order push:** migration 0011, outbox, `sage-push-order`, checkout wiring, totals write-back, status-sync job. *The revenue path — last because it depends on 1 & 2 and is the least reversible.*
5. **Phase 4 — expiry notifications:** scan job + digest email + notification ledger. Small, isolated, ships fast once 0010 exists.

Phases 0–2 are individually demoable and carry no risk of writing bad orders into the ERP; everything irreversible is concentrated in Phase 3 behind the outbox.

## Sources

- [Sage300-SDK (sample payloads, Postman collection, Web API docs)](https://github.com/SageNADev/Sage300-SDK)
- [Sage 300 Web API endpoint reference](https://acutedata.com/pdf/sage-300/Sage-300-Web-API-Endpoint-Reference.pdf)
- [I/C Contract Pricing screen](https://help.sage300.com/en-us/2024/classic/Content/Operations/Inventory/ItemsAndPriceLists/SCREENS/ContractPricing.htm)
- [Sage 300 2026 release notes](https://help.sage300.com/en-us/2026/classic/Content/ReleaseDocs/ReleaseNotes.htm)
- [IC Item Pricing API discussion](https://communityhub.sage.com/us/sage300/f/general-discussion/151277/ic-item-pricing-api)
- [IC item pricing enhancement request](https://www5.v1ideas.com/TheSageGroupplc/Sage300ERP/Idea/Detail/40756)
- [Web API order-entry examples](https://communityhub.sage.com/us/sage300/f/general-discussion/156859/help---using-the-web-api-to-generate-prepaid-orders)
- [Sagekit endpoint coverage](https://lepepe.github.io/sagekit/)
- [Sage 300 Web API setup guide](https://www.accountingadvice.co/sage-300-web-api/)
- [Greytrix REST integration notes](https://www.greytrix.com/blogs/sageaccpacerp/2021/12/06/rest-api-integration-with-sage-300-erp/)
