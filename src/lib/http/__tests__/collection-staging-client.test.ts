
import axios from "axios";

import { apiConfig } from "@/config/api-config";
import {
    collectionStagingClient,
} from "@/lib/http/collection-staging-client";
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

describe("collectionStagingClient", () => {
    it("creates the Axios client with the correct configuration", () => {
        expect(axios.create).toHaveBeenCalledWith({
            baseURL: apiConfig.collectionStaging.baseURL,
            timeout: apiConfig.collectionStaging.timeout,
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    it("attaches the response interceptor", () => {
        expect(attachResponseInterceptor).toHaveBeenCalledWith(
            collectionStagingClient,
        );
    });
});
