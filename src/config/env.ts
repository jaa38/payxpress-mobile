
import { z } from "zod";

const DEFAULTS = {
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

  coreApiUrl: urlSchema.default(DEFAULTS.coreApiUrl),

  paymentApiUrl: urlSchema.default(DEFAULTS.paymentApiUrl),

  collectionApiUrl: urlSchema.default(DEFAULTS.collectionApiUrl),

  collectionStagingApiUrl: urlSchema.default(
    DEFAULTS.collectionStagingApiUrl,
  ),
});

const parsedEnv = envSchema.safeParse({
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT,

  coreApiUrl:
    process.env.EXPO_PUBLIC_CORE_API_URL ??
    process.env.EXPO_PUBLIC_API_URL ??
    DEFAULTS.coreApiUrl,

  paymentApiUrl:
    process.env.EXPO_PUBLIC_PAYMENT_API_URL ??
    DEFAULTS.paymentApiUrl,

  collectionApiUrl:
    process.env.EXPO_PUBLIC_COLLECTION_API_URL ??
    DEFAULTS.collectionApiUrl,

  collectionStagingApiUrl:
    process.env.EXPO_PUBLIC_COLLECTION_STAGING_API_URL ??
    DEFAULTS.collectionStagingApiUrl,
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
