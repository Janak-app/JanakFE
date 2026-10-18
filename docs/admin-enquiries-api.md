# Admin — Contact & Sales Rep Enquiries API

Frontend integration reference for the **admin panel** changes added in October 2026:

1. [Admin — Contact Enquiries](#1-admin--contact-enquiries)
2. [Admin — Sales Rep Enquiries](#2-admin--sales-rep-enquiries)

Swagger: `{API_HOST}/api/docs` (tags **Admin - Contact Enquiries**, **Admin - Sales Rep Enquiries**).

## Background — where this data comes from

The customer app now creates these records. You don't need to build anything for this in the admin panel; it's here for context.

- **Contact enquiries**: created when a visitor (logged in or anonymous) submits the Contact Us form (`POST /contact`).
- **Sales rep enquiries**: created every time a customer taps "Contact sales rep" on a product (`POST /sales-rep-enquiries`). Repeat clicks on the same product by the same customer within 30 minutes are recorded only once.
- **Customer phone**: signup now requires a 10-digit phone number. It is `null` for accounts created before this change, so handle `null` wherever a customer phone is displayed.

## Base setup

- **Base URL**: `{API_HOST}/api/v1` (staging: `https://stagapi.janakgnss.com/api/v1`)
- **Auth**: every endpoint below needs an **admin** token. It is sent as the httpOnly `accessToken` cookie (send credentials: `fetch(..., { credentials: 'include' })` / axios `withCredentials: true`) or as `Authorization: Bearer <JWT>`.
- **Success envelope**:
  ```json
  { "success": true, "data": { /* payload below */ }, "message": "Success", "timestamp": "..." }
  ```
- **Error envelope** (all errors, including validation):
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "First error message",
    "errors": ["First error message", "..."],
    "path": "/api/v1/admin/...",
    "timestamp": "..."
  }
  ```
  `message` is the first error; show it directly in a toast. `errors` appears only for validation failures and lists every failed rule.
- **Unknown fields are rejected**: the API returns `400` if a request body contains any property not documented below. Send only the documented fields.

---

## 1. Admin — Contact Enquiries

Base: `/admin/contact-enquiries`

### `GET /admin/contact-enquiries`

| Param | Type | Notes |
|---|---|---|
| `page` | number | default `1` |
| `limit` | number | default `20` |
| `status` | `new` \| `in_progress` \| `resolved` | omit for all |
| `search` | string | matches name, email, phone or subject (partial, case-insensitive) |
| `from` | `YYYY-MM-DD` | submitted on/after this day |
| `to` | `YYYY-MM-DD` | submitted on/before this day (inclusive) |

#### Response `data`

```json
{
  "enquiries": [
    {
      "id": "uuid",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "phone": "9876543210",
      "subject": "Bulk order enquiry",
      "message": "I would like pricing for 5 units of the R12i receiver.",
      "status": "new",
      "adminNotes": null,
      "createdAt": "2026-10-17T09:00:00.000Z",
      "updatedAt": "2026-10-17T09:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "totalPages": 1,
  "statusCounts": { "new": 1, "in_progress": 0, "resolved": 0 }
}
```

- Results are sorted newest first.
- `statusCounts` covers **all** enquiries and ignores filters. Use it for tab badges, e.g. "New (12)".
- `phone` and `subject` may be `null`.

### `GET /admin/contact-enquiries/:id`

Returns a single enquiry (same shape as a list item). Returns `404` if not found, or `400` if `id` isn't a UUID.

### `PATCH /admin/contact-enquiries/:id`

```json
{ "status": "in_progress", "adminNotes": "Called customer, sending quote tomorrow" }
```

- Both fields are optional; send only what changed.
- Status flow: `new` → `in_progress` → `resolved`. Any transition is allowed.
- `adminNotes` is internal only and is never shown to the customer.
- Returns the updated enquiry.

### `DELETE /admin/contact-enquiries/:id`

Returns `{ "message": "Enquiry deleted" }`. Deletion is permanent, so confirm in the UI first.

### Suggested UI

- Tabs: All / New / In progress / Resolved, with badges from `statusCounts`.
- Columns: Date, Name, Email, Phone, Subject, Status (a dropdown that sends `PATCH`).
- Row click opens a detail drawer with the full `message` and an editable notes box (`PATCH adminNotes`).
- Filters: a search box (`search`) and a date range (`from` / `to`).

---

## 2. Admin — Sales Rep Enquiries

Base: `/admin/sales-rep-enquiries`

### `GET /admin/sales-rep-enquiries`

| Param | Type | Notes |
|---|---|---|
| `page` | number | default `1` |
| `limit` | number | default `20` |
| `status` | `new` \| `contacted` \| `closed` | omit for all |
| `productId` | uuid | only clicks on this product, e.g. for a "Sales rep enquiries" section on the admin product page |
| `search` | string | matches product name/code, sales rep name, customer name/email/phone |
| `from` | `YYYY-MM-DD` | clicked on/after this day |
| `to` | `YYYY-MM-DD` | clicked on/before this day (inclusive) |

#### Response `data`

```json
{
  "enquiries": [
    {
      "id": "uuid",
      "product": { "id": "uuid", "slug": "trimble-r12i-gnss-receiver" },
      "productName": "Trimble R12i GNSS Receiver",
      "productCode": "JNK-R12I",
      "modelNumber": "R12i",
      "brandName": "Trimble",
      "categoryName": "GNSS Receivers",
      "price": "1250000.00",
      "salesRepName": "Amit Verma",
      "salesRepPhone": "9876500000",
      "user": { "id": "uuid", "email": "rahul@example.com" },
      "guestId": null,
      "customerEmail": "rahul@example.com",
      "customerName": "Sharma Surveys Pvt Ltd",
      "customerPhone": "9876543210",
      "status": "new",
      "adminNotes": null,
      "createdAt": "2026-10-17T09:00:00.000Z",
      "updatedAt": "2026-10-17T09:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "totalPages": 1,
  "statusCounts": { "new": 1, "contacted": 0, "closed": 0 }
}
```

#### Field reference

| Field | Meaning |
|---|---|
| `productName`, `productCode`, `modelNumber`, `brandName`, `categoryName`, `price`, `salesRepName`, `salesRepPhone` | **Snapshot at click time.** Display these rather than the live product; they stay correct if the product is later edited or deleted. |
| `price` | decimal **string** (e.g. `"1250000.00"`); convert it with `Number()` before formatting |
| `product` | link to the live product (`id`, `slug`) for a "View product" link. **`null` if the product was deleted.** |
| `user` | the logged-in customer who clicked; `null` for guests/anonymous visitors or if the user was deleted |
| `guestId` | set for guest visitors (useful for spotting repeat interest from the same guest); otherwise `null` |
| `customerEmail` / `customerName` / `customerPhone` | snapshot of the logged-in customer's email plus their company profile name/phone. All three are `null` for guests/anonymous visitors; name and phone are `null` if the customer hadn't filled in a company profile. |

Suggested "Customer" column value:

```ts
const customerLabel = e.customerName ?? e.customerEmail ?? (e.guestId ? "Guest" : "Anonymous visitor");
```

### `GET /admin/sales-rep-enquiries/:id`

Returns the same fields as a list item, except `product` and `user` are the **full** current records (or `null` if deleted). Returns `404` if not found.

### `PATCH /admin/sales-rep-enquiries/:id`

```json
{ "status": "contacted", "adminNotes": "Rep called, demo scheduled for Monday" }
```

- Both fields are optional; send only what changed.
- Status flow: `new` → `contacted` → `closed`.
- Returns the updated enquiry.

### `DELETE /admin/sales-rep-enquiries/:id`

Returns `{ "message": "Enquiry deleted" }`. Deletion is permanent, so confirm in the UI first.

### Suggested UI

- Tabs: All / New / Contacted / Closed, with badges from `statusCounts`.
- Columns:
  - Date
  - Product (name + code, linked via `product.slug` when it isn't `null`)
  - Brand
  - Price
  - Sales rep (name + phone)
  - Customer
  - Customer phone
  - Status (a dropdown that sends `PATCH`)
- Row click opens a detail drawer with all snapshot fields and an editable notes box (`PATCH adminNotes`).
- Admin product detail page: show that product's enquiries with `GET /admin/sales-rep-enquiries?productId=<id>`.

---

## Implementation checklist

- [ ] Contact Enquiries list page with status tabs, `statusCounts` badges, search, date range and pagination
- [ ] Contact Enquiry detail drawer with the full message and an editable status and admin notes
- [ ] Delete contact enquiry, with a confirmation step
- [ ] Sales Rep Enquiries list page with status tabs, `statusCounts` badges, search, date range and pagination
- [ ] Sales Rep Enquiry detail drawer with snapshot fields, status and admin notes
- [ ] Delete sales rep enquiry, with a confirmation step
- [ ] "Sales rep enquiries" section on the admin product page (`?productId=`)
- [ ] Handle `null` for `phone`, `subject`, `product`, `user`, `guestId` and the `customer*` fields
- [ ] Format `price` with `Number()` before display
- [ ] Add both pages to the admin sidebar/navigation
