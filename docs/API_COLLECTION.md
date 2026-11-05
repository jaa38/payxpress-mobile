# Application API collection

This document inventories API requests found in the application source. It is
not a server-side OpenAPI specification. Request fields and response shapes are
only included where the client code makes them clear; confirm unspecified
contracts with the API owner.

## Backends and conventions

Paths are relative to the relevant base URL unless noted otherwise.

| Client | Base URL used in source | Notes |
|---|---|---|
| Core app (`BaseApi`) | `https://payxpress.com:3000/api/` | Active service backend. A sandbox URL is declared but not selected by this client. |
| Payment gateway (`BasePaymentApi`) | `https://myxpresspay.com:7000/api/` | Payment, bank, and card operations. |
| Tax/collection (`BaseCollectionApi`) | `https://80.88.8.239:5000/api/` | Collection endpoints. |
| Tax/collection timestamp and receipt constants | `https://staging.xpresspayments.com:8096/api/` | Declared as `API.Collection_BASE_URL`; used by timestamp and receipt code. |
| Legacy helper (`APIHelper`) | `http://hop.swiftedgeacademy.com/api/` | Separate legacy API adapter; its endpoint methods have no callers located in the app. |

- Core and payment POST helpers send JSON; the collection client uses JSON and
  collection-specific `ApiKey`/`X-Timestamp` headers. Credential values are
  intentionally not reproduced here.
- In the core and payment API helpers, the method that reads the stored token
  currently returns a masked authorization value (`******`) instead of the
  retrieved token. Do not copy that placeholder into API clients; confirm
  authorization handling before using these requests independently.
- API helpers convert failures to application error objects. In the payment
  helper, HTTP 404 maps to “Resource not found”, HTTP 401 triggers logout, and
  HTTP 400 reads `responseMessage`, `responseCode`, and `data`.
- GET request bodies and query parameters are listed as the app sends them;
  verify the server accepts them.

## Core app API

Base URL: `https://payxpress.com:3000/api/`

These requests use `UserService`, `BillpaymentService`, or `WalletService`.
Protected calls request the app JWT; the helper currently sends the masked
authorization value described above.

### Authentication and account

| Method | Path | Authentication | Request details |
|---|---|---|---|
| GET | `/Auth/verify-bvn/{bvn}` | Not requested | BVN verification. `verifyTag()` currently calls this same route. |
| POST | `/Auth/verify-otp/bvn` | Not requested | JSON body supplied by caller; schema not stated in service. |
| GET | `/Auth/generate-otp//{email}/{phone}` | Not requested | Email and phone are path segments, in that order; the source concatenation produces a double slash after `generate-otp`. |
| POST | `/Auth/verify-otp` | Not requested or app JWT | Used by OTP verification and PIN-OTP verification; JSON body supplied by caller. |
| POST | `/Auth/reset-pin-otp` | App JWT | JSON body supplied by caller. |
| POST | `/Auth/forgot-password/{email}` | Not requested | Email is appended to the path. |
| POST | `/Users/change-password/` | App JWT | JSON body supplied by caller. |
| POST | `/Wallet/changepin` | App JWT | JSON body supplied by caller. |
| POST | `/Auth/refresh-token` | Not requested | JSON body supplied by caller. |
| POST | `/Auth/register` | Not requested | JSON body supplied by caller. |
| POST | `/Auth/login` | Not requested | JSON body supplied by caller. |
| GET | `/Users/getall/{userId}` | App JWT | User ID is appended to the path. |

### Billers, beneficiaries, and payment activity

| Method | Path | Authentication | Request details |
|---|---|---|---|
| GET | `/Beneficiary` | App JWT | List beneficiaries. |
| POST | `/Beneficiary/create` | App JWT | JSON body supplied by caller. |
| GET | `/Billers/get-subcategories` | App JWT | Sends header `catergoryId` (spelling as in source). |
| GET | `/Billers/get-all-Categories` | App JWT | Also used by the service method named `validateName()`. |
| GET | `/Billers/get-product-by-billerid` | App JWT | One call sends `catergoryId` and `billerId` headers; another sends no explicit headers. |
| GET | `/Auth/generate-pin-otp` | App JWT | Generate PIN OTP. |
| GET | `/Auth/verifyTagNameForWalletTransfer//{tagName}` | App JWT | The source constant and caller each add a slash, producing the double slash before the tag name. |
| POST | `/Auth/verify-otp` | App JWT | PIN OTP verification; same endpoint as OTP verification above, different caller/body. |
| POST | `/Billers/cabletv-account-lookup` | App JWT | JSON body supplied by caller. |
| POST | `/Billers/betting-account-lookup` | App JWT | JSON body supplied by caller. |
| POST | `/Billers/electricity-account-lookup` | App JWT | JSON body supplied by caller. |
| POST | `/Billers/waec-` | App JWT | Exact path constant; JSON body supplied by caller. |
| POST | `/Billers/jamb-account-lookup` | App JWT | JSON body supplied by caller. |
| POST | `/Billers/Verify/{transactionId}` | App JWT | POST with transaction ID in path and no explicit request body; used for transaction and cable verification. |
| POST | `/Billers/purchase` | App JWT | JSON body supplied by caller. |
| POST | `/PayXpressAPI/Products/NotifyBiller` | App JWT | JSON body supplied by caller. |
| POST | `/Wallet/Transfer` | App JWT | JSON body supplied by caller. |
| POST | `/Recurring/create` | App JWT | JSON body supplied by caller. |
| POST | `/Recurring/Stop` | App JWT | JSON body supplied by caller. |
| POST | `/Recurring/restart` | App JWT | JSON body supplied by caller. |
| GET | `/Referral/program/get-by-user` | App JWT | Query parameters supplied by caller. The source constant begins with `/`; verify the resulting URL path with the server. |
| GET | `/Wallet/getstatement` | App JWT | Query parameters supplied by caller. |
| GET | `/Wallet/Statement` | App JWT | Query parameters supplied by caller. |
| GET | `/Recurring/GetRecurringTransactions` | App JWT | Query parameters supplied by caller. |
| GET | `/Billers/Dashboard/AllTransactionHistory` | App JWT | Query parameters supplied by caller. |

### Wallet and bank transfer

| Method | Path | Authentication | Request details |
|---|---|---|---|
| GET | `/Wallet/get-wallet-details` | App JWT | No explicit request data. |
| POST | `/Wallet/createPin` | App JWT | JSON body supplied by caller. |
| GET | `/Wallet/transfer/bank/getall` | App JWT | List transfer banks. |
| POST | `/Wallet/transfer/bank/accounts` | App JWT | JSON body supplied by caller; used to validate bank account details. |
| POST | `/Wallet/transfer/bank` | App JWT | JSON body supplied by caller; performs bank transfer. |

## Payment gateway API

Base URL: `https://myxpresspay.com:7000/api/`

Most payment-service methods request the locally stored payment token.
`GET /Payments/GetPaymentInfo/{accessCode}` instead requests the app JWT;
`POST /Payments/Initialize` does not request either token.

### 1. List USSD banks

```http
GET /Payments/GetUSSDBanks
```

Authentication: payment token.

Response fields parsed by the app:

```json
{
  "responseCode": "string",
  "responseMessage": "string",
  "data": [
    {
      "bankName": "string",
      "bankCode": "string",
      "ussdString": "string"
    }
  ]
}
```

### 2. List banks for account payment

```http
GET /Payments/GetBanksForAccountPayment
```

Authentication: payment token. The app supplies this GET request body:

```json
{
  "type": "Frontend"
}
```

The response contains `responseCode`, `responseMessage`, and a `data` array of
banks. The parsed bank fields include `id`, `bankName`, `bankCode`, `logoUrl`,
requirement flags, `provider`, and date fields.

### 3. List banks for virtual accounts

```http
GET /Payments/GetBanksForVirtualAccount
```

Authentication: payment token. The response contains `responseCode`,
`responseMessage`, and `data` entries with `bankCode` and `bankName`.

The app's `getAllBanks()` method calls this same path as well; it is not a
separate endpoint.

### 4. Initialize payment

```http
POST /Payments/Initialize
```

Authentication: none requested by the client. The app includes a masked
`Authorization` header override; see [Backends and conventions](#backends-and-conventions).

Example body shape used by the app:

```json
{
  "email": "<customer email>",
  "amount": "100.00",
  "transactionId": "<transaction id>",
  "currency": "NGN",
  "mode": "Debug",
  "publicKey": "<configured public key>",
  "callbackUrl": "<callback URL>",
  "metadata": [
    {
      "name": "string",
      "value": "string"
    }
  ],
  "productId": "MTN",
  "productDescription": "MTN",
  "applyConviniencyCharge": true
}
```

The response contains `responseMessage`, `totalCount`, and `data` with
`paymentUrl` and `accessCode`.

### 5. Get payment information

```http
GET /Payments/GetPaymentInfo/{accessCode}
```

Authentication: app token. Replace `{accessCode}` with the value returned by
Initialize Payment. The response contains `responseCode`, `responseMessage`,
and payment `data`, including the transaction details, merchant settings,
payment methods, and a token used by later payment requests.

### 6. Make payment

```http
POST /Payments/MakePayment
```

Authentication: payment token.

The app submits a JSON object with a `payload` property:

```json
{
  "payload": "<payment payload>"
}
```

The client builds the payload from payment fields such as transaction ID,
amount, card details, account details, payment method, and device information.
The exact fields vary by payment flow. The response has `responseCode`,
`responseMessage`, and `data` with transaction, redirect/authentication,
account, and provider-reference fields.

### 7. Validate payment

```http
POST /Payments/ValidatePayment
```

Authentication: payment token.

Body used by the app:

```json
{
  "transactionId": "<transaction id>",
  "providerReference": "<provider reference>",
  "otp": "<one-time password>",
  "entryType": "Android"
}
```

The response is parsed for `responseCode`, `responseMessage`, `orderReference`,
`chargedAmount`, `providerReference`, and `recurringId`.

### 8. Save card

```http
POST /Payments/SaveCard
```

Authentication: payment token.

The body contains a `payload` property. The app passes an encrypted payload
created from card PAN, expiry month/year, CVV, card brand, first/last name, and
email. Card values are intentionally omitted here.

The response contains `responseCode`, `responseMessage`, and an optional
`data.payload`.

### 9. Get saved cards

```http
GET /Payments/Getsavecard/{email}
```

Authentication: payment token. Replace `{email}` with the account email. The
response is parsed for `responseCode`, `responseMessage`, and an optional
`data.payload`.

### 10. Tokenize card

```http
POST /Payments/Tokenization
```

Authentication: payment token. The app accepts an arbitrary JSON object as the
request body; the field schema is not defined in the client. The response is
parsed for `responseCode` and `responseMessage`.

### 11. Validate settlement account

```http
POST /Payments/ValidateUserAccount
```

Authentication: payment token.

Body used by the app:

```json
{
  "bankCode": "<bank code>",
  "accountNumber": "<account number>"
}
```

The response contains `responseCode`, `responseMessage`, and optional `data`
with `accountName` and `accountNumber`.

### 12. Create invoice

```http
POST /Payments/CreateInvoice
```

Authentication: payment token. The app accepts an arbitrary JSON object as the
request body; the field schema is not defined in the client. Parsed response
fields include `responseCode`, `responseMessage`, `transactionId`, `amount`,
`state`, and `paymentId`.

### Additional payment-related call on the core API

`POST /PayXpressAPI/Products/NotifyBiller` is called from `PaymentService`, but
uses the core app backend and app JWT rather than the payment-gateway backend.

## Tax and collection API

The collection repository uses `BaseCollectionApi` at
`https://80.88.8.239:5000/api/`. These calls send JSON and request
collection-specific `ApiKey` and `X-Timestamp` headers. The key value is
intentionally not reproduced. Request bodies are caller-provided JSON objects
unless otherwise noted.

| Method | Path | Purpose / request detail |
|---|---|---|
| POST | `/APIGatway/GetAvailableMerchant` | Fetch merchants. |
| POST | `/APIGatway/GetTaxOffices` | Fetch tax offices. |
| POST | `/APIGatway/GetPaymentOptions` | Fetch payment options. |
| POST | `/APIGatway/GetMerchantPaymentItems` | Fetch payment items for a merchant. |
| POST | `/APIGatway/PostTransaction` | Submit a transaction; the service JSON-encodes the request object before sending it. |
| POST | `/APIGatway/PaymentNotification` | Payment notification; method exists but no active caller was found. |
| GET | `Test/GetTimestampHeader` | Timestamp request using `https://staging.xpresspayments.com:8096/api/`; stores response data as `timestampToken`. |
| GET | `/APIGatway/DownloadReciept` | Receipt download uses query parameters from the receipt model and expects PDF bytes. The current URL expression inserts a literal `+` before `APIGatway`; check the target URL before relying on this request. |

`API.Collection_BASE_URL` points to the staging backend, but the main
collection repository's active requests use the IP-address base URL above.

## Real-time notification connection

The app also opens a SignalR WebSocket connection to:

```text
wss://myxpresspay.com:7070/NotificationHub?access_token={token}
```

It subscribes to `ReceivePaymentNotification` and can invoke `SendMessage`.
This is a hub connection rather than a REST endpoint.

## Declared but not active or not wired

These routes/constants occur in source but are not used by an active service
call in the app, or are part of a legacy adapter without callers identified:

| Method | Path | Source status |
|---|---|---|
| POST | `/Payments/VerifyPayment` | Payment constant and commented-out service call only. |
| — | `/Payments/Removecard` | Constant only; no active request. |
| — | `/APIGatway/PrintReceipt` | Constant only; no active request. |
| — | `/Auth/verify-tagname/{tagName}` | Constant only; commented alternative to wallet tag validation. |
| POST | `http://hop.swiftedgeacademy.com/api/add_salon_rating` | Legacy `APIHelper` method; no callers found. Body: `user_id`, `vendor_id`, `rating`, `description`. |
| POST | `http://hop.swiftedgeacademy.com/api/add_staff_rating` | Legacy `APIHelper` method; no callers found. Body: `user_id`, `staff_id`, `rating`, `description`. |
| POST | `http://hop.swiftedgeacademy.com/api/cancel_booking` | Legacy `APIHelper` method; no callers found. Body: `cart_id`, `reason`. |
| POST | `http://hop.swiftedgeacademy.com/api/cancel_product_orders` | Legacy `APIHelper` method; no callers found. Body: `cart_id`, `reason`. |
| POST | `http://hop.swiftedgeacademy.com/api/delete_all_notifications` | Legacy `APIHelper` method; no callers found. Body: `user_id`. |

The `ApiEndpoints` class in `lib/core/utils/api_endpoints.dart` also declares
`login`, `sign_up`, and `Auth/verify-bvn/` for an older repository layer; that
layer has no active application call sites found during this inventory.

An older core API client declares `https://pgsandbox.xpresspayments.com:5000/api/`
as a sandbox URL and `https://payxpress.com:7000/api/` as a base URL, but no
active service call sites to that separate client were found.

## Scope and limitations

- The inventory covers REST and SignalR request sites in the app's Dart source,
  including service clients, collection screens, and the standalone legacy
  helper. Platform SDK traffic and URLs used only for images, privacy policy,
  redirects, or callbacks are not API operations and are not listed.
- Some API methods accept arbitrary maps, so the exact request/response schema
  is not available in the client. Such shapes are marked as unspecified rather
  than inferred.
- `getAllBanks()` reuses `/Payments/GetBanksForVirtualAccount`; it is not a
  separate endpoint.
