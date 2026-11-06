
import axios from "axios";

import {
    attachCoreAuthInterceptor,
    attachResponseInterceptor,
} from "@/lib/http/interceptors";

import { apiConfig } from "@/config/api-config";
import { coreClient } from "@/lib/http/core-client";

jest.mock("axios", () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
    },
}));

jest.mock("@/lib/http/interceptors", () => ({
    attachCoreAuthInterceptor: jest.fn(),
    attachResponseInterceptor: jest.fn(),
}));

describe("coreClient", () => {
    it("creates the Axios client with the correct configuration", () => {
        expect(axios.create).toHaveBeenCalledWith({
            baseURL: apiConfig.core.baseURL,
            timeout: apiConfig.core.timeout,
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    it("attaches the core authentication interceptor", () => {
        expect(attachCoreAuthInterceptor).toHaveBeenCalledWith(
            coreClient,
        );
    });

    it("attaches the response interceptor", () => {
        expect(attachResponseInterceptor).toHaveBeenCalledWith(
            coreClient,
        );
    });
});
