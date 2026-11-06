import axios, {
    type InternalAxiosRequestConfig,
} from "axios";

import { attachPaymentAuthInterceptor } from "@/lib/http/interceptors";
import { authSession } from "@/services/auth/auth-session";
import { paymentSession } from "@/services/payments/payment-session";

jest.mock("@/services/auth/auth-session", () => ({
    authSession: {
        getSession: jest.fn(),
    },
}));

jest.mock("@/services/payments/payment-session", () => ({
    paymentSession: {
        getPaymentToken: jest.fn(),
    },
}));

const mockedGetSession = jest.mocked(authSession.getSession);
const mockedGetPaymentToken = jest.mocked(
    paymentSession.getPaymentToken,
);

describe("Payment Gateway authentication interceptor", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("attaches the payment token to protected payment requests", async () => {
        mockedGetPaymentToken.mockResolvedValue("payment-token");

        const client = axios.create();
        attachPaymentAuthInterceptor(client);

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

        await client.post("/Payments/MakePayment", {}, {
            requiresPaymentAuth: true,
        });

        expect(
            capturedConfig?.headers.get("Authorization"),
        ).toBe("Bearer payment-token");

        expect(mockedGetPaymentToken).toHaveBeenCalledTimes(1);
    });

    it("attaches the app access token when requiresAuth is true", async () => {
        mockedGetSession.mockResolvedValue({
            accessToken: "app-access-token",
            refreshToken: "app-refresh-token",
        });

        const client = axios.create();
        attachPaymentAuthInterceptor(client);

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

        await client.get("/Payments/GetPaymentInfo/access-code", {
            requiresAuth: true,
        });

        expect(
            capturedConfig?.headers.get("Authorization"),
        ).toBe("Bearer app-access-token");

        expect(mockedGetSession).toHaveBeenCalledTimes(1);
    });

    it("does not attach credentials to public requests", async () => {
        const client = axios.create();
        attachPaymentAuthInterceptor(client);

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

        await client.post("/Payments/Initialize", {});

        expect(
            capturedConfig?.headers.get("Authorization"),
        ).toBeUndefined();

        expect(mockedGetPaymentToken).not.toHaveBeenCalled();
        expect(mockedGetSession).not.toHaveBeenCalled();
    });

    it("rejects payment requests without a payment token", async () => {
        mockedGetPaymentToken.mockResolvedValue(null);

        const client = axios.create();
        attachPaymentAuthInterceptor(client);

        const adapter = jest.fn();

        client.defaults.adapter = adapter;

        await expect(
            client.post("/Payments/MakePayment", {}, {
                requiresPaymentAuth: true,
            }),
        ).rejects.toThrow(
            "Payment authentication required. No payment token was found.",
        );

        expect(adapter).not.toHaveBeenCalled();
    });

    it("rejects requests requiring both authentication types", async () => {
        const client = axios.create();
        attachPaymentAuthInterceptor(client);

        await expect(
            client.get("/test", {
                requiresAuth: true,
                requiresPaymentAuth: true,
            }),
        ).rejects.toThrow(
            "A request cannot require both app and payment authentication.",
        );
    });

    it("rejects requests requiring app authentication without a valid session", async () => {
        mockedGetSession.mockResolvedValue(null);

        const client = axios.create();
        attachPaymentAuthInterceptor(client);

        const adapter = jest.fn();
        client.defaults.adapter = adapter;

        await expect(
            client.get("/Payments/GetPaymentInfo/access-code", {
                requiresAuth: true,
            }),
        ).rejects.toThrow(
            "Authentication required. No valid local session was found.",
        );

        expect(mockedGetSession).toHaveBeenCalledTimes(1);
        expect(adapter).not.toHaveBeenCalled();
    });
});