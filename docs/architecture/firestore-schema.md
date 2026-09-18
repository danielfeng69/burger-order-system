# Firestore schema — buns-out-burger-order-system

Version: 1.0  
Date: 2026-01-18

This document describes a recommended Firestore data model for the project. It uses a hybrid layout:
- Top-level canonical collections for global/admin data (e.g., `products`, `orders`) for efficient admin queries and analytics.
- Per-user subcollections under `users/{uid}` for fast user-scoped reads and privacy (e.g., `users/{uid}/orderSummaries`, `users/{uid}/cart`).

Design goals and assumptions
- Primary reads are user-facing (menus, cart, order history) and admin analytics (orders by status/date).
- We prefer single source of truth for authoritative records (`/orders/{orderId}`) and denormalized snapshots for fast reads (user summaries, product snapshots in orders).
- Use Cloud Functions (or backend server) to mirror/denormalize canonical writes into user subcollections to avoid client-side privilege escalations and race conditions.

Naming recommendation
- Top-level: `products`, `orders`, `config`, `coupons`, `menus`, `categories`.
- User-scoped: use explicit names to avoid ambiguity. Instead of `users/{uid}/orders`, use:
  - `users/{uid}/orderSummaries` (recommended) — small read-optimized doc per order
  - `users/{uid}/ordersMeta` or `users/{uid}/orderReceipts` are alternatives depending on needs

Schema Overview
```text
users/{uid}/
├─ profile (doc)
├─ settings/preferences (doc)
├─ achievements (doc)
├─ privacy/
│  ├─ cookieConsent (doc)
│  └─ dataExportRequests/{requestId} (collection)
├─ cart (doc)                  // users/{uid}/cart (single doc recommended)
├─ paymentMethods/{pmId} (collection)
├─ addresses/{addressId} (collection)
├─ orderSummaries/{orderId} (collection)  // light per-user order snapshots
└─ history/ (collection)

Top-level collections (canonical)
├─ products/{productId}
├─ orders/{orderId}             // canonical full order records (admin/analytics)
├─ config/store (doc)           // single app-level store configuration (single-store apps)
├─ coupons/{couponId}
├─ categories/{categoryId}
├─ menus/{menuId}
└─ adminUsers/{uid}             // optional: admin membership lookup
```

-------------------------
Top-level collections (canonical)
-------------------------

1) `products` — canonical product catalog
- Document ID: `productId` (string)
- Fields:
  - `name` (string, required)
  - `description` (string, optional)
  - `price` (number, required) — smallest currency unit recommended (e.g., cents)
  - `currency` (string, required, e.g., "USD")
  - `images` (array of string urls, optional)
  - `tags` (array of strings, optional)
  - `categoryId` (string, optional)
  - `active` (boolean, default true)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)

Example:
```json
{
  "name": "Classic Cheeseburger",
  "description": "Beef patty, cheddar, lettuce, house sauce",
  "price": 899,
  "currency": "USD",
  "images": ["https://.../burger1.png"],
  "tags": ["beef","cheese"],
  "categoryId": "burgers",
  "active": true,
  "createdAt": "2026-01-01T12:00:00Z",
  "updatedAt": "2026-01-02T09:00:00Z"
}
```

2) `orders` — canonical full order records (top-level)
- Document ID: `orderId` (string)
- Purpose: authoritative order, used for admin queries, exports, and analytics.
- Fields (recommended):
  - `orderId` (string, required) — duplicate of doc id for convenience
  - `userId` (string, required)
  - `storeId` (string, optional) — if multi-store
  - `status` (string, required) — e.g., `pending`, `confirmed`, `preparing`, `out_for_delivery`, `delivered`, `cancelled`
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)
  - `items` (array of objects) — denormalized product snapshots (see below)
  - `subtotal` (number, required)
  - `tax` (number)
  - `deliveryFee` (number)
  - `total` (number, required)
  - `payment` (object) — redacted/safe fields only (e.g., `method`, `brand`, `last4`, `paymentStatus`)
  - `deliveryAddressSnapshot` (object) — store address fields at time of order
  - `fulfillment` (object) — e.g., `type: pickup|delivery`, `eta`, `driverId`
  - `coupons` (array)
  - `notes` (string)
  - `metadata` (map) — arbitrary small key/value data

`items` snapshot item example:
```json
{
  "productId": "p_123",
  "name": "Classic Cheeseburger",
  "price": 899,
  "quantity": 2,
  "modifiers": [
    { "name": "Extra cheese", "price": 100 }
  ],
  "subtotal": 1898
}
```

3) `config/store` — single app-level store configuration (document)
- Path: `config/store` (single document; recommended for single-store apps)
- Purpose: store site/store-specific settings used by the app (hours, address, menus, fulfillment settings, timezone, feature flags).
- Fields:
  - `name` (string)
  - `address` (map: `{ line1, city, postalCode, lat, lng }`)
  - `timezone` (string)
  - `hours` (map / structured schedule)
  - `active` (boolean)
  - `settings` (map: e.g., `{ deliveryEnabled: boolean, minOrderCents: number }`)
  - `menuId` (string) — reference to `menus/{menuId}` or the active menu id
  - `createdAt`, `updatedAt` (timestamps)

Example:
```json
{
  "name": "Buns-Out Downtown",
  "address": { "line1":"123 Main St", "city":"Town", "postalCode":"12345", "lat":37.77, "lng":-122.41 },
  "timezone": "America/Los_Angeles",
  "hours": { "mon":"10:00-21:00", "tue":"10:00-21:00" },
  "active": true,
  "settings": { "deliveryEnabled": true, "minOrderCents": 1200 },
  "menuId": "menu_default",
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-10T12:00:00Z"
}
```

4) `coupons`, `categories`, `menus` — supporting catalog collections
- `coupons` documents: `code`, `discountType`, `value`, `expiresAt`, `usageLimit`, `enabled`.
- `categories` documents: `name`, `slug`, `order`.
- `menus` documents: mapping of menus to product IDs or categories.

-------------------------
Per-user subcollections (under `users/{uid}`)
-------------------------

Paths are under `users/{uid}`. Keep sensitive info limited and enforce rules to only allow owner access.

1) `users/{uid}/profile` (recommended as a document under `users/{uid}` or as fields on `users/{uid}` doc)
- Fields:
  - `displayName` (string)
  - `email` (string)
  - `phone` (string)
  - `photoURL` (string)
  - `createdAt`, `lastSeenAt`
  - `preferences` (map) — dietary prefs, notification prefs

2) `users/{uid}/cart` — single doc or collection with a single doc `active` (recommended single doc)
- Path: `users/{uid}/cart/active` (or `users/{uid}/cart` as a single doc)
- Fields:
  - `items` (array of `{productId, name, price, quantity, modifiers, subtotal}`)
  - `updatedAt`
  - `appliedCoupon` (nullable)
  - `estimatedTotal`

Example:
```json
{
  "items": [
    { "productId": "p_123", "name": "Classic Cheeseburger", "price": 899, "quantity": 1, "subtotal": 899 }
  ],
  "appliedCoupon": null,
  "updatedAt": "2026-01-18T10:02:00Z",
  "estimatedTotal": 999
}
```

3) `users/{uid}/orderSummaries/{orderId}` — lightweight hybrid summaries (recommended)
- Document ID: `orderId` (same id as top-level for easy correlation)
- Fields:
  - `orderId` (string)
  - `createdAt` (timestamp)
  - `status` (string)
  - `total` (number)
  - `shortItems` (array of `{name, qty}`) — textual small snapshot for UI
  - `orderRef` (string) — path to `/orders/{orderId}` (optional)
  - `read` (boolean) — if user viewed the order

Example:
```json
{
  "orderId": "o_987",
  "createdAt": "2026-01-18T10:05:00Z",
  "status": "delivered",
  "total": 1298,
  "shortItems": [{"name":"Classic Cheeseburger","qty":2}],
  "orderRef": "/orders/o_987",
  "read": true
}
```

4) `users/{uid}/paymentMethods/{pmId}` — saved tokens (PII/security note: never store raw card data)
- Fields:
  - `pmId` (string)
  - `provider` (string, e.g., "stripe")
  - `brand` (string)
  - `last4` (string)
  - `expiry` (string)
  - `isDefault` (boolean)
  - `createdAt`

5) `users/{uid}/addresses/{addressId}` — delivery addresses
- Fields: `label`, `line1`, `line2`, `city`, `state`, `postalCode`, `lat`, `lng`, `createdAt`

6) `users/{uid}/history` or `users/{uid}/events` — audit-like events for customer service
- Store lightweight event objects: `{type, text, createdAt, source}`

-------------------------
Data flow & denormalization pattern
-------------------------
- Write flow for an order (recommended):
  1. Client requests order creation to a trusted server or Cloud Function (server validates payment).
  2. Server creates `/orders/{orderId}` (canonical document).
  3. A Cloud Function (onCreate of `/orders/{orderId}`) writes a summary to `/users/{userId}/orderSummaries/{orderId}` and any other user-scoped docs (e.g., increment user stats).
  4. Updates to `/orders/{orderId}` (status changes) trigger onUpdate functions to patch the user summary.

- Reason: prevents clients from writing arbitrary `/orders` and ensures atomicity and validated data.

-------------------------
Security rules (examples)
-------------------------
Notes:
- Prefer using Firebase Auth custom claims for admin roles (e.g., `request.auth.token.admin == true`) OR maintain an `adminUsers` top-level collection and check membership in rules via `get(...)` (less performant).

Example rules (snippet):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public reads for products
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Top-level orders: admin writes/reads, creation only via server with admin claim
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
      // Optionally allow users to read their own orders via index-based rule:
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // User-scoped data: owner-only
    match /users/{uid}/{subcollection=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    // App-level store config (single-store)
    match /config/store {
      allow read: if true; // public reads for store metadata
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

Security caveats:
- Do NOT allow clients to write to `/orders` directly unless you have strict validation and auth checks.
- For `paymentMethods`, never store raw PCI data — only tokenized IDs and safe metadata.

-------------------------
Indexes (suggested)
-------------------------
- `/orders` composite indexes:
  - index: (status ASC, createdAt DESC) — admin dashboard by status
  - index: (userId ASC, createdAt DESC) — query user orders across all time
  - index: (storeId ASC, createdAt DESC) — store-level order queries

- `/products` composite indexes:
  - index: (categoryId ASC, price ASC) — price filters by category

- `users/{uid}/orderSummaries`:
  - single-field index on `createdAt` is automatic; consider composite `(status, createdAt)` if users filter by status client-side often.

-------------------------
Operational recommendations
-------------------------
- Use Cloud Functions (Background) for:
  - Mirroring orders → user summaries (onCreate/onUpdate)
  - Maintaining analytics counters (avoid hot counters; use BigQuery for heavy analytics)

- Exporting/analytics:
  - Stream `orders` to BigQuery via scheduled exports or Firestore Export to GCS → BigQuery for heavy analytics/reporting.

- Retention & GDPR:
  - Keep `orders` for audit period; if a user requests deletion, redact personal fields in `/orders` and remove from `users/{uid}` subcollections, but retain non-identifiable analytics data where permitted.

-------------------------
Appendix: example Cloud Function pseudo-flow for mirroring
-------------------------
```js
// onCreate /orders/{orderId}
exports.onOrderCreated = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, ctx) => {
    const order = snap.data();
    const userId = order.userId;
    const summary = {
      orderId: ctx.params.orderId,
      createdAt: order.createdAt,
      status: order.status,
      total: order.total,
      shortItems: order.items.map(i => ({name: i.name, qty: i.quantity})),
      orderRef: `/orders/${ctx.params.orderId}`
    };
    await admin.firestore().doc(`users/${userId}/orderSummaries/${ctx.params.orderId}`).set(summary);
  });
```

-------------------------
Change log
-------------------------
- 1.0 — initial schema with hybrid per-user summaries (2026-01-18)

-------------------------
Notes & next steps
-------------------------
- If you want stricter typing (TypeScript interfaces) or example security rules adjusted for custom claims vs admin collection lookups, tell me and I will expand the document.

