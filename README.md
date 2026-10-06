# PayXpress Mobile

A modern React Native fintech application for payments, wallet management, transfers, bill payments, and value-added services.

PayXpress is being developed as a multi-service financial platform designed to make everyday financial and utility transactions easier, faster, and more accessible from a single application.

---

## Product Vision

PayXpress aims to provide users with a convenient platform for managing everyday financial and value-added services.

The broader product vision includes:

- Digital wallet management
- Wallet-to-wallet transfers
- Airtime and data purchases
- Electricity bill payments
- Cable TV subscriptions
- Government payments
- Insurance services
- Pension services
- Educational payments
- Ticket booking
- Beneficiary management
- Transaction history
- Automated payments and reminders
- User profiles and customization
- Real-time notifications
- Multilingual support
- Loyalty and rewards
- Referral rewards
- Secure identity verification
- Fraud prevention and transaction security
- Customer support

The product is intended to support multiple platforms, including mobile applications, web portals, and USSD.

---

## Project Status

### Sprint 1 — Foundation & Architecture

**Status: Complete**

Sprint 1 establishes the technical foundation required to build PayXpress as a scalable React Native application.

### Completed

- React Native + Expo foundation
- TypeScript with strict mode
- Expo Router navigation
- Feature-oriented project structure
- Environment configuration
- Centralized Axios API client
- TanStack Query configuration
- Zustand application state
- Expo SecureStore integration
- MMKV storage integration
- SQLite database foundation
- Design system foundations
- Reusable UI components
- Global application providers
- Centralized error handling
- Development logging
- Jest testing foundation
- iOS native build verification
- Android native build verification
- TypeScript validation
- Expo Doctor validation
- GitHub repository and main branch
- Sprint 1 Git checkpoint

---

## Tech Stack

### Core

- React Native
- Expo
- TypeScript
- Expo Router

### State & Data

- TanStack Query
- Zustand
- Axios

### Forms & Validation

- React Hook Form
- Zod
- `@hookform/resolvers`

### Storage

- Expo SecureStore
- React Native MMKV
- Expo SQLite

### Authentication & Device Security

- Expo LocalAuthentication
- Secure device storage
- Biometric authentication foundation

### Testing

- Jest
- Jest Expo
- React Native Testing Library
- React Test Renderer

---

## Architecture

PayXpress follows a feature-oriented React Native architecture.

```text
src/
├── app/
│   ├── _layout.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── transactions.tsx
│       ├── wallet.tsx
│       └── more.tsx
│
├── components/
│   ├── ui/
│   │   ├── AppText/
│   │   ├── Button/
│   │   ├── Card/
│   │   └── Input/
│   └── ...
│
├── config/
│   └── env.ts
│
├── constants/
│   └── storage.ts
│
├── features/
│   └── ...
│
├── hooks/
│   └── ...
│
├── i18n/
│   └── ...
│
├── lib/
│   ├── http-client.ts
│   └── query-client.ts
│
├── providers/
│   └── AppProviders.tsx
│
├── services/
│   ├── api/
│   └── storage/
│       ├── secure-storage.ts
│       ├── mmkv-storage.ts
│       └── database.ts
│
├── store/
│   └── app-store.ts
│
├── theme/
│   ├── colors.ts
│   └── theme.ts
│
├── types/
│   └── ...
│
└── utils/
    ├── errors/
    └── logger/