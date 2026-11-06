import { env } from "@/config/env";

/**
 * Centralised API configuration.
 *
 * All API clients should obtain their base URLs and timeouts
 * from this configuration.
 *
 * Environment-specific backend URLs will be introduced once
 * the backend team provides the confirmed endpoints.
 */
export const apiConfig = {
  environment: env.environment,

  core: {
    baseURL: env.coreApiUrl,
    timeout: 30_000,
  },

  payment: {
    baseURL: env.paymentApiUrl,
    timeout: 30_000,
  },

  collection: {
    baseURL: env.collectionApiUrl,
    timeout: 30_000,
  },

  collectionStaging: {
    baseURL: env.collectionStagingApiUrl,
    timeout: 30_000,
  },
} as const;