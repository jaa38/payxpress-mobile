# PayXpress Mobile — Architecture

## 1. Purpose and current state

This document describes the architecture visible in the current PayXpress Mobile codebase. It is an implementation reference, not a statement that every planned product capability or Sprint 01 acceptance criterion has been completed.

The application uses Expo, React Native, TypeScript and Expo Router. Its current organisation is a layered, domain-oriented structure: routes, shared components, configuration, infrastructure, providers, services, state, theme and utilities. The current directory layout is **not** the feature-folder structure shown in some earlier project notes.

## 2. Technology baseline

The package manifest currently specifies:

- Expo SDK `~57.0.32`
- React Native `0.86.3`
- React `19.2.3`
- TypeScript `~6.0.3`
- Expo Router `~57.0.30`
- TanStack Query `^5.104.1`
- Zustand `^5.0.15`
- Axios `^1.20.0`
- React Hook Form `^7.89.0`
- Zod `^4.6.5`
- Expo SecureStore, React Native MMKV and Expo SQLite
- Jest Expo and React Native Testing Library

The exact dependency versions should be read from `package.json` and the lockfile.

## 3. Source layout

```text
src/
├── app/                 # Route definitions and route-level tests
│   ├── (auth)/          # Public/authentication routes
│   │   └── register/    # Registration flow routes
│   ├── (tabs)/          # Authenticated tab area
│   └── index.tsx        # Root redirect
├── components/
│   ├── auth/            # Auth-specific UI
│   └── ui/              # Shared UI primitives
├── config/              # Environment and API configuration
├── constants/           # Shared constants
├── hooks/               # Shared hooks
├── lib/
│   ├── http/            # Axios clients and interceptors
│   └── query-client.ts  # TanStack Query configuration
├── providers/           # AppProviders and AuthBootstrap
├── services/
│   ├── api/
│   ├── auth/
│   ├── collection/
│   ├── payments/
│   └── storage/
├── store/               # Zustand stores
├── theme/               # Colours, fonts, semantic theme and tokens
├── types/
└── utils/               # Error normalization and logging
```

### Responsibilities

| Layer | Responsibility |
|---|---|
| `app` | Expo Router route tree, layouts, redirects and screen composition |
| `components` | Reusable presentation components; `auth` contains auth-specific UI and `ui` contains general primitives |
| `config` | Parse and validate public environment configuration and expose API settings |
| `lib/http` | Configure Axios instances and attach authentication/error interceptors |
| `lib/query-client.ts` | Configure shared TanStack Query defaults |
| `providers` | Compose app-wide providers, fonts, theme and auth bootstrap |
| `services` | Encapsulate API operations, authentication/session logic and storage access |
| `store` | Zustand client-side application and authentication state |
| `theme` | Semantic colours, typography, spacing, radii, fonts and light/dark theme definitions |
| `utils` | Shared error and logging helpers |

## 4. Application startup and navigation

The root layout (`src/app/_layout.tsx`) wraps the route slot in `AppProviders` and renders the animated splash overlay. `AppProviders` configures the query provider, loads fonts, applies the selected theme and mounts `AuthBootstrap`.

`AuthBootstrap` invokes `hydrateAuth()` on mount. The root route (`src/app/index.tsx`) waits for auth hydration and then redirects:
- authenticated state → `/(tabs)`
- unauthenticated state → `/welcome`

The auth layout (`src/app/(auth)/_layout.tsx`) waits for hydration and redirects authenticated users to `/(tabs)`. The tab layout (`src/app/(tabs)/_layout.tsx`) waits for hydration and redirects unauthenticated users to `/welcome`.

These are **client-side navigation guards**. They are not a substitute for server-side authorization; protected API operations must still be authorized by the backend.

Current route groups:
- `(auth)`: welcome, login and registration flow.
- `(tabs)`: Home, Account, Pay Bills and Transactions.

## 5. Providers and server state

`src/providers/AppProviders.tsx` composes the application-level providers. It:
- creates the TanStack Query provider using the shared `queryClient`;
- loads configured font assets;
- reads the user's theme preference and maps it to the app theme;
- mounts the auth bootstrap.

The shared QueryClient (`src/lib/query-client.ts`) currently configures:
- query retry count: `2`;
- query stale time: `30,000 ms`;
- mutation retry count: `0`.

TanStack Query is intended for server state and request lifecycle. Zustand is used for client-side state.

## 6. Theme system

The theme is defined under `src/theme`. It includes colour palettes, semantic light and dark theme values, typography, spacing, radius and font definitions.

Components should consume semantic theme values rather than introducing unrelated raw colour values. `AppProviders` selects the effective light/dark theme based on the persisted preference and device colour scheme.

The application store persists `themeMode` (`system`, `light` or `dark`) using Zustand persistence backed by MMKV.

## 7. API and network architecture

### Configuration

`src/config/env.ts` validates configuration with Zod. Supported environment names are:
- `development`
- `staging`
- `production`

Supported public variables:
- `EXPO_PUBLIC_ENVIRONMENT`
- `EXPO_PUBLIC_CORE_API_URL`
- `EXPO_PUBLIC_API_URL` (legacy fallback for the core API URL)
- `EXPO_PUBLIC_PAYMENT_API_URL`
- `EXPO_PUBLIC_COLLECTION_API_URL`
- `EXPO_PUBLIC_COLLECTION_STAGING_API_URL`

The current source defines legacy default URLs. The configuration comments state that backend URLs are shared across environments until separate environment URLs are provided. Therefore, environment labels are supported, but fully isolated development/staging/production backend configuration should not be claimed until the URLs and deployment settings are confirmed.

Do not put secrets in `EXPO_PUBLIC_*` variables. Expo public variables are client-bundled configuration.

### HTTP clients

The current HTTP layer contains separate clients for core, payment, collection and collection staging APIs. The core client uses `apiConfig.core` and attaches:
- a request interceptor that reads the local app session and adds a Bearer access token only when `requiresAuth` is true;
- a response interceptor that normalizes API/network errors.

The payment interceptor supports a separate payment token and the app access token, and rejects requests that request both authentication modes simultaneously. The payment token is currently sent using the Bearer convention; the source code explicitly notes that this must be confirmed with the Payment Gateway backend before release.

Requests that require authentication fail locally if the relevant token is missing. Automatic refresh-token retry is not currently implemented in the HTTP response interceptor.

`src/lib/http-client.ts` also exists as a separate legacy/compatibility module. New network operations should use the dedicated configured clients and service modules; review usages before extending the legacy module.

## 8. Services and authentication

Service modules separate API operations from route components:
- `services/auth`: auth API methods, session storage, auth hydration, auth service and biometric authentication.
- `services/payments`: payment API and payment-session handling.
- `services/collection`: collection API and types.
- `services/storage`: secure storage, MMKV and SQLite access.

### Current authentication boundary

The auth store (`src/store/auth-store.ts`) holds:
- `user`
- `isAuthenticated`
- `isHydrating`
- `setUser`, `clearAuth` and `setHydrating`

The auth session service stores access and refresh tokens through the secure-storage abstraction. The session hydration function checks for a locally stored session and always completes the hydration state. However, the source explicitly defers validating/restoring the user until the backend refresh-token and profile contracts are confirmed.

The auth API module exposes endpoint methods, but the current registration/login screens have not completed backend integration. Do not assume that the presence of an API method means the corresponding user journey is integrated end-to-end.

Authentication integration, session restoration, expiry handling and related user journeys are part of the planned authentication sprint. Confirm backend request/response fields, token expiry behaviour, refresh semantics, profile response and error contract before implementation.

## 9. State and persistence

### Zustand

`src/store/app-store.ts` persists the user's theme mode in MMKV through Zustand's `persist` middleware.

`src/store/auth-store.ts` holds in-memory authentication and user state. It is not the token store.

### SecureStore

`src/services/storage/secure-storage.ts` wraps Expo SecureStore operations (`setItem`, `getItem`, `removeItem`) and sets Keychain accessibility to `WHEN_UNLOCKED`. The auth session service uses this abstraction for access and refresh tokens.

### MMKV

`src/services/storage/mmkv-storage.ts` creates the `payxpress-storage` MMKV instance. It is used for non-secret local persistence, including the Zustand app settings store. Do not use MMKV as a substitute for secure credential storage.

### SQLite

`src/services/storage/database.ts` opens the local database `payxpress.db` using Expo SQLite. This establishes the database connection; schema, migrations and feature-specific persistence should be documented as they are implemented.

## 10. Shared UI components

Reusable UI components are under `src/components/ui`, including:
- `AppText`
- `Button`
- `Card`
- `Input`
- `NumberInput`
- `OTPInput`
- `PhoneInput`

The directory also contains supporting UI such as `collapsible.tsx`. Authentication-specific components live under `src/components/auth`.

Shared components should remain accessible, typed, theme-aware and independently testable.

## 11. Testing and quality

Jest uses the `jest-expo` preset. Tests are discovered under `__tests__` directories and common `*.test.*` / `*.spec.*` names. The Jest configuration collects coverage from `src/**/*.{ts,tsx}`, excluding declaration files and `index.ts` files.

Useful commands:

```bash
npx tsc --noEmit
npm run lint
npm test -- --runInBand
npm run test:coverage
npx expo-doctor
```

The latest recorded full test checkpoint in the project notes was:
- 47 suites passed
- 557 tests passed
- Statements: 82.13%
- Branches: 76.28%
- Functions: 84.58%
- Lines: 82.59%

This is a recorded historical result. Re-run tests against the current checkout before using it as a release or sprint sign-off metric.

## 12. Environment, native projects and repository hygiene

The current working tree inspection showed an `ios/` directory but no `android/` directory. The README and sprint report must not state that Android native build verification is complete until an Android build has actually been configured and tested.

The repository's `.gitignore` should exclude local `.env` files and generated/native build artefacts as appropriate. Commit only a safe `.env.example` containing variable names and non-secret placeholders. Never commit access tokens, API keys, passwords, signing credentials or real environment values.

## 13. Known gaps and decisions

1. **Backend environment separation:** environment selection exists, but the configured default URLs are shared until confirmed environment-specific endpoints are supplied.
2. **Authentication integration:** screen/API integration and full session restoration remain dependent on backend contracts.
3. **Token refresh:** automatic refresh and retry are not implemented in the HTTP response interceptor.
4. **Payment auth convention:** Bearer formatting is provisional pending backend confirmation.
5. **Android verification:** no Android native directory was present in the inspected working tree; verify project generation and build.
6. **SQLite lifecycle:** database connection exists; schema/migration and feature usage should be documented as added.
7. **Architecture naming:** current codebase is layered/domain-oriented, not yet a strict feature-folder architecture.

## 14. Sprint 01 exit review

The Sprint 01 plan calls for a stable foundation, documented architecture, navigation and route protection, semantic theme, shared components, central API infrastructure, state management, storage and automated tests, with successful iOS and Android builds.

Based on the inspected implementation and project test notes:

| Area | Current evidence | Assessment |
|---|---|---|
| Expo/TypeScript foundation | Expo SDK 57, RN 0.86, strict TypeScript configuration | Implemented |
| Project structure | Existing layered/domain-oriented `src` structure | Implemented; differs from feature-folder wording in plan |
| Navigation | Root redirect and auth/tab route guards, route tests | Implemented; verify full device flows |
| Theme | Semantic light/dark theme and tokens | Implemented |
| Shared UI | Reusable text, button, card and input components with tests | Implemented |
| API infrastructure | Multiple Axios clients, config, interceptors and error normalization | Implemented; environment isolation and backend auth conventions need confirmation |
| State management | Zustand and TanStack Query configured | Implemented |
| Local storage | SecureStore, MMKV and SQLite connection | Foundation implemented; confirm database schema/use |
| Logging | Logging utilities exist | Foundation present; confirm production error reporting requirements |
| Testing | Jest/RNTL configured; latest recorded 47 suites/557 tests | Implemented; re-run current full suite |
| iOS build | `ios/` directory present; prior project notes report iOS run succeeded | Previously verified; re-run for current sign-off |
| Android build | No `android/` directory in inspected working tree | Outstanding verification |
| Documentation | README update and this architecture document | In progress / complete when committed |

**Sprint 01 should be marked fully accepted only after the outstanding acceptance checks—especially Android build verification, environment separation decisions, and current full-suite validation—are resolved or explicitly waived by the project owner.**

## 15. Next planned work

The sprint plan places complete registration, sign-in, OTP, password recovery, session restoration, logout and legal consent in Sprint 02. Proceed only with confirmed backend contracts. Keep Sprint 01 foundation changes separate from feature-level authentication integration.
