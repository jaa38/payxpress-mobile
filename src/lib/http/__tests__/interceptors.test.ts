
import axios, {
    type InternalAxiosRequestConfig
} from "axios";

import {
    attachCoreAuthInterceptor,
} from "@/lib/http/interceptors";
import { authSession } from "@/services/auth/auth-session";

jest.mock("@/services/auth/auth-session", () => ({
    authSession: {
        getSession: jest.fn(),
    },
}));

describe("Core API authentication interceptor", () => {
    const mockedGetSession = jest.mocked(authSession.getSession);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("attaches the access token to protected requests", async () => {
        mockedGetSession.mockResolvedValue({
            accessToken: "test-access-token",
            refreshToken: "test-refresh-token",
        });

        const client = axios.create();
        attachCoreAuthInterceptor(client);

        let capturedConfig: InternalAxiosRequestConfig | undefined;

        client.defaults.adapter = async (config) => {
            capturedConfig = config;

            return {
                data: { success: true },
                status: 200,
                statusText: "OK",
                headers: {},
                config,
            };
        };

        await client.get("/protected", {
            requiresAuth: true,
        });

        expect(capturedConfig?.headers.get("Authorization")).toBe(
            "Bearer test-access-token",
        );
    });

    it("does not retrieve a session for public requests", async () => {
        const client = axios.create();
        attachCoreAuthInterceptor(client);

        let capturedConfig: InternalAxiosRequestConfig | undefined;

        client.defaults.adapter = async (config) => {
            capturedConfig = config;

            return {
                data: { success: true },
                status: 200,
                statusText: "OK",
                headers: {},
                config,
            };
        };

        await client.get("/public");

        expect(mockedGetSession).not.toHaveBeenCalled();
        expect(capturedConfig?.headers.get("Authorization")).toBeUndefined();
    });

    it("rejects protected requests without a session", async () => {
        mockedGetSession.mockResolvedValue(null);

        const client = axios.create();
        attachCoreAuthInterceptor(client);

        client.defaults.adapter = jest.fn();

        await expect(
            client.get("/protected", {
                requiresAuth: true,
            }),
        ).rejects.toThrow("Authentication required.");

        expect(client.defaults.adapter).not.toHaveBeenCalled();
    });
});
