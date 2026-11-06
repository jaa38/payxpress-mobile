import { collectionClient } from "@/lib/http/collection-client";

import type {
    CollectionApiResponse,
    CollectionRequestPayload,
} from "@/services/collection/collection-types";

export const collectionApi = {
    /**
     * Retrieve available merchants.
     */
    async getAvailableMerchants(
        payload: CollectionRequestPayload,
    ): Promise<CollectionApiResponse> {
        const response = await collectionClient.post(
            "/APIGatway/GetAvailableMerchant",
            payload,
        );

        return response.data;
    },

    /**
     * Retrieve tax offices.
     */
    async getTaxOffices(
        payload: CollectionRequestPayload,
    ): Promise<CollectionApiResponse> {
        const response = await collectionClient.post(
            "/APIGatway/GetTaxOffices",
            payload,
        );

        return response.data;
    },

    /**
     * Retrieve available payment options.
     */
    async getPaymentOptions(
        payload: CollectionRequestPayload,
    ): Promise<CollectionApiResponse> {
        const response = await collectionClient.post(
            "/APIGatway/GetPaymentOptions",
            payload,
        );

        return response.data;
    },

    /**
     * Retrieve payment items for a merchant.
     */
    async getMerchantPaymentItems(
        payload: CollectionRequestPayload,
    ): Promise<CollectionApiResponse> {
        const response = await collectionClient.post(
            "/APIGatway/GetMerchantPaymentItems",
            payload,
        );

        return response.data;
    },

    /**
     * Submit a collection transaction.
     *
     * The legacy application JSON-encodes the request object
     * before sending it. Preserve that request format.
     */
    async postTransaction(
        payload: CollectionRequestPayload,
    ): Promise<CollectionApiResponse> {
        const response = await collectionClient.post(
            "/APIGatway/PostTransaction",
            JSON.stringify(payload),
        );

        return response.data;
    },
};