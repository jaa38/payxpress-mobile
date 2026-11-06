
import axios from "axios";

import { apiConfig } from "@/config/api-config";
import { collectionClient } from "@/lib/http/collection-client";
import { attachResponseInterceptor } from "@/lib/http/interceptors";

jest.mock("axios", () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
    },
}));

jest.mock("@/lib/http/interceptors", () => ({
    attachResponseInterceptor: jest.fn(),
}));

describe("collectionClient", () => {
    it("creates the Axios client with the correct configuration", () => {
        expect(axios.create).toHaveBeenCalledWith({
            baseURL: apiConfig.collection.baseURL,
            timeout: apiConfig.collection.timeout,
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    it("attaches the response interceptor", () => {
        expect(attachResponseInterceptor).toHaveBeenCalledWith(
            collectionClient,
        );
    });
});
