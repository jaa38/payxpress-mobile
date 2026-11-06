
jest.mock("@/config/env", () => ({
    env: {
        environment: "staging",
        coreApiUrl: "https://core.example.com/api",
        paymentApiUrl: "https://payment.example.com/api",
        collectionApiUrl: "https://collection.example.com/api",
        collectionStagingApiUrl:
            "https://staging-collection.example.com/api",
    },
}));

import { apiConfig } from "@/config/api-config";

describe("apiConfig", () => {
    it("uses the configured environment", () => {
        expect(apiConfig.environment).toBe("staging");
    });

    it("configures the core API", () => {
        expect(apiConfig.core).toEqual({
            baseURL: "https://core.example.com/api",
            timeout: 30_000,
        });
    });

    it("configures the payment API", () => {
        expect(apiConfig.payment).toEqual({
            baseURL: "https://payment.example.com/api",
            timeout: 30_000,
        });
    });

    it("configures the collection API", () => {
        expect(apiConfig.collection).toEqual({
            baseURL: "https://collection.example.com/api",
            timeout: 30_000,
        });
    });

    it("configures the collection staging API", () => {
        expect(apiConfig.collectionStaging).toEqual({
            baseURL: "https://staging-collection.example.com/api",
            timeout: 30_000,
        });
    });
});
