import { z } from "zod";

/**
 * Current API endpoints.
 *
 * These are the existing endpoints from the legacy API configuration.
 * They are shared across app environments until separate backend URLs
 * are provided.
 */
const DEFAULT_API_URLS = {
  coreApiUrl: "https://payxpress.com:3000/api",
  paymentApiUrl: "https://myxpresspay.com:7000/api",
  collectionApiUrl: "https://80.88.8.239:5000/api",
  collectionStagingApiUrl:
    "https://staging.xpresspayments.com:8096/api",
} as const;

const urlSchema = z
  .string()
  .trim()
  .url("A valid API URL is required")
  .transform((value) => value.replace(/\/+$/, ""));

const environmentSchema = z.enum([
  "development",
  "staging",
  "production",
]);

const envSchema = z.object({
  environment: environmentSchema.default("development"),

  coreApiUrl: urlSchema.default(DEFAULT_API_URLS.coreApiUrl),

  paymentApiUrl: urlSchema.default(DEFAULT_API_URLS.paymentApiUrl),

  collectionApiUrl: urlSchema.default(
    DEFAULT_API_URLS.collectionApiUrl,
  ),

  collectionStagingApiUrl: urlSchema.default(
    DEFAULT_API_URLS.collectionStagingApiUrl,
  ),
});

const parsedEnv = envSchema.safeParse({
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT,

  coreApiUrl:
    process.env.EXPO_PUBLIC_CORE_API_URL ??
    process.env.EXPO_PUBLIC_API_URL ??
    DEFAULT_API_URLS.coreApiUrl,

  paymentApiUrl:
    process.env.EXPO_PUBLIC_PAYMENT_API_URL ??
    DEFAULT_API_URLS.paymentApiUrl,

  collectionApiUrl:
    process.env.EXPO_PUBLIC_COLLECTION_API_URL ??
    DEFAULT_API_URLS.collectionApiUrl,

  collectionStagingApiUrl:
    process.env.EXPO_PUBLIC_COLLECTION_STAGING_API_URL ??
    DEFAULT_API_URLS.collectionStagingApiUrl,
});

if (!parsedEnv.success) {
  throw new Error(
    `Invalid application environment configuration:\n${z.prettifyError(parsedEnv.error)}`,
  );
}

export const env = {
  ...parsedEnv.data,

  // Backward compatibility with the existing HTTP client.
  apiUrl: parsedEnv.data.coreApiUrl,
} as const;

export type AppEnvironment = typeof env.environment;