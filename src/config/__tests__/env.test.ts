
const ENV_KEYS = [
    "EXPO_PUBLIC_ENVIRONMENT",
    "EXPO_PUBLIC_CORE_API_URL",
    "EXPO_PUBLIC_API_URL",
    "EXPO_PUBLIC_PAYMENT_API_URL",
    "EXPO_PUBLIC_COLLECTION_API_URL",
    "EXPO_PUBLIC_COLLECTION_STAGING_API_URL",
] as const;

const originalEnv = { ...process.env };

function resetEnvironmentVariables() {
    ENV_KEYS.forEach((key) => {
        delete process.env[key];
    });
}

function loadEnv() {
    let loadedEnv: typeof import("@/config/env").env;

    jest.isolateModules(() => {
        loadedEnv = require("@/config/env").env;
    });

    return loadedEnv!;
}

describe("application environment configuration", () => {
    beforeEach(() => {
        resetEnvironmentVariables();
    });

    afterAll(() => {
        ENV_KEYS.forEach((key) => {
            const originalValue = originalEnv[key];

            if (originalValue === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = originalValue;
            }
        });
    });

    it("uses default configuration when no environment variables are provided", () => {
        const env = loadEnv();

        expect(env.environment).toBe("development");
        expect(env.coreApiUrl).toBe("https://payxpress.com:3000/api");
        expect(env.paymentApiUrl).toBe("https://myxpresspay.com:7000/api");
        expect(env.collectionApiUrl).toBe(
            "https://80.88.8.239:5000/api",
        );
        expect(env.collectionStagingApiUrl).toBe(
            "https://staging.xpresspayments.com:8096/api",
        );
        expect(env.apiUrl).toBe(env.coreApiUrl);
    });

    it("uses configured environment variables", () => {
        process.env.EXPO_PUBLIC_ENVIRONMENT = "staging";
        process.env.EXPO_PUBLIC_CORE_API_URL = "https://core.example.com/api";
        process.env.EXPO_PUBLIC_PAYMENT_API_URL =
            "https://payment.example.com/api";

        const env = loadEnv();

        expect(env.environment).toBe("staging");
        expect(env.coreApiUrl).toBe("https://core.example.com/api");
        expect(env.paymentApiUrl).toBe(
            "https://payment.example.com/api",
        );
    });

    it("removes trailing slashes from API URLs", () => {
        process.env.EXPO_PUBLIC_CORE_API_URL =
            "https://core.example.com/api///";

        const env = loadEnv();

        expect(env.coreApiUrl).toBe("https://core.example.com/api");
    });

    it("supports the legacy API URL variable", () => {
        process.env.EXPO_PUBLIC_API_URL =
            "https://legacy.example.com/api";

        const env = loadEnv();

        expect(env.coreApiUrl).toBe(
            "https://legacy.example.com/api",
        );
    });

    it("prioritises the new core API URL over the legacy URL", () => {
        process.env.EXPO_PUBLIC_CORE_API_URL =
            "https://core.example.com/api";

        process.env.EXPO_PUBLIC_API_URL =
            "https://legacy.example.com/api";

        const env = loadEnv();

        expect(env.coreApiUrl).toBe(
            "https://core.example.com/api",
        );
    });

    it("rejects an invalid environment", () => {
        process.env.EXPO_PUBLIC_ENVIRONMENT = "testing";

        expect(() => loadEnv()).toThrow(
            "Invalid application environment configuration",
        );
    });

    it("rejects an invalid API URL", () => {
        process.env.EXPO_PUBLIC_CORE_API_URL = "not-a-valid-url";

        expect(() => loadEnv()).toThrow(
            "Invalid application environment configuration",
        );
    });
});
