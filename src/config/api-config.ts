
import { env } from "@/config/env";

export const apiConfig = {
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
