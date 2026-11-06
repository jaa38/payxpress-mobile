import axios from "axios";

import { attachResponseInterceptor } from "@/lib/http/interceptors";
import { normalizeError } from "@/utils/errors/normalize-error";

jest.mock("@/utils/errors/normalize-error", () => ({
    normalizeError: jest.fn((error) => ({
        message: "Normalized error",
        originalError: error,
    })),
}));

const mockedNormalizeError = jest.mocked(normalizeError);

describe("HTTP response interceptor", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("passes successful responses through unchanged", async () => {
        const client = axios.create();
        attachResponseInterceptor(client);

        const responseData = { success: true };

        client.defaults.adapter = async (config) => ({
            data: responseData,
            status: 200,
            statusText: "OK",
            headers: {},
            config,
        });

        const response = await client.get("/test");

        expect(response.data).toEqual(responseData);
        expect(mockedNormalizeError).not.toHaveBeenCalled();
    });

    it("normalizes ordinary request errors", async () => {
        const client = axios.create();
        attachResponseInterceptor(client);

        const originalError = new Error("Network failure");

        client.defaults.adapter = async () => {
            throw originalError;
        };

        await expect(client.get("/test")).rejects.toMatchObject({
            message: "Normalized error",
            originalError,
        });

        expect(mockedNormalizeError).toHaveBeenCalledWith(originalError);
    });

    it("preserves app authentication errors", async () => {
        const client = axios.create();
        attachResponseInterceptor(client);

        const authError = new Error(
            "Authentication required. No valid local session was found.",
        );

        client.defaults.adapter = async () => {
            throw authError;
        };

        await expect(client.get("/test")).rejects.toBe(authError);
        expect(mockedNormalizeError).not.toHaveBeenCalled();
    });

    it("preserves payment authentication errors", async () => {
        const client = axios.create();
        attachResponseInterceptor(client);

        const authError = new Error(
            "Payment authentication required. No payment token was found.",
        );

        client.defaults.adapter = async () => {
            throw authError;
        };

        await expect(client.get("/test")).rejects.toBe(authError);
        expect(mockedNormalizeError).not.toHaveBeenCalled();
    });

    it("preserves conflicting authentication errors", async () => {
        const client = axios.create();
        attachResponseInterceptor(client);

        const authError = new Error(
            "A request cannot require both app and payment authentication.",
        );

        client.defaults.adapter = async () => {
            throw authError;
        };

        await expect(client.get("/test")).rejects.toBe(authError);
        expect(mockedNormalizeError).not.toHaveBeenCalled();
    });

    it("normalizes non-Error rejection values", async () => {
        const client = axios.create();
        attachResponseInterceptor(client);

        const originalError = "Unexpected failure";

        client.defaults.adapter = async () => {
            throw originalError;
        };

        await expect(client.get("/test")).rejects.toMatchObject({
            message: "Normalized error",
            originalError,
        });

        expect(mockedNormalizeError).toHaveBeenCalledWith(originalError);
    });
});