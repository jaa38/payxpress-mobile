
import axios from "axios";

import { apiConfig } from "@/config/api-config";
import {
    attachPaymentAuthInterceptor,
    attachResponseInterceptor,
} from "@/lib/http/interceptors";
import { paymentClient } from "@/lib/http/payment-client";

jest.mock("axios", () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
    },
}));

jest.mock("@/lib/http/interceptors", () => ({
    attachPaymentAuthInterceptor: jest.fn(),
    attachResponseInterceptor: jest.fn(),
}));

describe("paymentClient", () => {
    it("creates the Axios client with the correct configuration", () => {
        expect(axios.create).toHaveBeenCalledWith({
            baseURL: apiConfig.payment.baseURL,
            timeout: apiConfig.payment.timeout,
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    it("attaches the payment authentication interceptor", () => {
        expect(attachPaymentAuthInterceptor).toHaveBeenCalledWith(
            paymentClient,
        );
    });

    it("attaches the response interceptor", () => {
        expect(attachResponseInterceptor).toHaveBeenCalledWith(
            paymentClient,
        );
    });
});
