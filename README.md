# PayXpress Mobile

PayXpress Mobile is a React Native application built with Expo and TypeScript. It is intended to bring wallet services, payments, transfers, bill payments and value-added services into one mobile experience.

## Project status

The project is progressing through its 12-sprint delivery plan. The current work has established much of the mobile foundation, including navigation, shared UI components, theme tokens, API clients, state management, local storage and automated tests.

**Sprint 01 — Foundation and mobile architecture: foundation implemented; final acceptance checks and documentation are being closed out.**

Implemented foundation:
- Expo, React Native and strict TypeScript setup.
- Expo Router route structure, including welcome, login, registration and tab routes.
- Root entry routing and authentication-aware route guards.
- Shared UI components and semantic light/dark theme tokens.
- Environment parsing and central API URL configuration.
- Axios clients and request/response interceptors.
- TanStack Query and Zustand state management.
- SecureStore, MMKV and SQLite storage foundations.
- Application providers, font loading and auth bootstrap.
- Jest and React Native Testing Library test infrastructure.

Items that should not be treated as complete yet:
- Backend authentication integration and reliable session restoration depend on confirmed API contracts and belong to the authentication delivery work.
- Environment names are supported, but the current configured API URLs are shared defaults unless environment-specific values are supplied.
- The Android native project/build has not been verified in the current working tree; only the `ios/` directory is present.
- The architecture and setup documentation are being completed.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for implementation details and known limitations.

## Technology stack

| Area | Technology |
|---|---|
| Mobile framework | React Native 0.86, Expo SDK 57 |
| Language | TypeScript 6 |
| Navigation | Expo Router |
| Server state | TanStack Query |
| Client state | Zustand |
| HTTP | Axios |
| Forms and validation | React Hook Form, Zod, `@hookform/resolvers` |
| Secure storage | Expo SecureStore |
| Local key-value storage | React Native MMKV |
| Local database | Expo SQLite |
| Device authentication | Expo Local Authentication |
| UI and animation | React Native, Expo UI, Reanimated |
| Testing | Jest Expo, React Native Testing Library, React Test Renderer |

Versions are maintained in `package.json`.

## Project structure

```text
src/
├── app/                 # Expo Router routes and route-level tests
│   ├── (auth)/          # Welcome, login and registration routes
│   ├── (tabs)/          # Main tab routes
│   └── index.tsx        # Auth-aware root redirect
├── components/
│   ├── auth/            # Authentication-specific components
│   └── ui/              # Reusable UI components
├── config/              # Environment and API configuration
├── constants/           # Application constants
├── hooks/               # Shared React hooks
├── lib/                 # HTTP clients and query client
│   └── http/
├── providers/           # Application and auth bootstrap providers
├── services/
│   ├── api/             # API service exports
│   ├── auth/            # Authentication/session services
│   ├── collection/      # Collection API services
│   ├── payments/        # Payment API and payment session
│   └── storage/         # SecureStore, MMKV and SQLite
├── store/               # Zustand stores
├── theme/               # Semantic colours, typography and tokens
├── types/               # Shared TypeScript types
└── utils/               # Errors and logging utilities

docs/
├── API_COLLECTION.md    # Existing API endpoint inventory
└── ARCHITECTURE.md      # Application architecture and implementation notes
```

## Getting started

### Prerequisites

- Node.js version compatible with the installed Expo SDK.
- npm.
- Xcode and iOS Simulator for local iOS builds.
- Android Studio and Android SDK for Android builds.

### Install dependencies

```bash
npm install
```

### Configure environment

Create a local `.env` file in the project root. Do not commit `.env` or other files containing local credentials.

Supported variables:

```dotenv
EXPO_PUBLIC_ENVIRONMENT=development

EXPO_PUBLIC_CORE_API_URL=
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_PAYMENT_API_URL=
EXPO_PUBLIC_COLLECTION_API_URL=
EXPO_PUBLIC_COLLECTION_STAGING_API_URL=
```

The application validates environment configuration with Zod. If a variable is omitted, the current legacy default URL is used. `EXPO_PUBLIC_API_URL` is retained as a backward-compatible fallback for the core API URL.

**Important:** Expo public environment variables are bundled into the client application. They must never contain secrets, private API keys or credentials. Environment selection currently exists, but separate backend URLs must be supplied and confirmed for each environment.

### Start the development server

```bash
npx expo start
```

### Run native platforms

```bash
npm run ios
npm run android
```

The Android command requires a configured Android native project and local Android development environment. Confirm the native project/build before treating Android as verified.

### Run the web target

```bash
npm run web
```

## Quality checks

```bash
npx tsc --noEmit
npm run lint
npm test -- --runInBand
npm run test:coverage
npx expo-doctor
```

The latest recorded full test run in the project notes was **47 test suites and 557 tests passing**. The recorded coverage at that point was:
- Statements: 82.13%
- Branches: 76.28%
- Functions: 84.58%
- Lines: 82.59%

These figures are a historical checkpoint, not a guarantee that the current working tree has been re-tested. Re-run the commands above after changes.

## Development principles

- Keep route components in `src/app` and reusable UI in `src/components`.
- Keep network access behind the configured API clients and service modules.
- Use semantic theme tokens rather than hard-coded component colours.
- Keep access tokens and other sensitive session material in secure storage, not MMKV or plain-text application state.
- Keep environment-specific configuration outside source changes and never commit local `.env` files.
- Do not assume backend request/response shapes. Confirm API contracts before implementing authentication or payment behaviour.

## Related documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API collection inventory](docs/API_COLLECTION.md)
- [Sprint plan](../Sprint-Plan.txt) — if maintained alongside this repository.

Sprint 2 begins