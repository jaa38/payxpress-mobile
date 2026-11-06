import { collectionClient } from "@/lib/http/collection-client";
import { collectionApi } from "@/services/collection/collection-api";

jest.mock("@/lib/http/collection-client", () => ({
    collectionClient: {
        post: jest.fn(),
    },
}));

const mockedPost = jest.mocked(collectionClient.post);

describe("collectionApi", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("retrieves available merchants", async () => {
        const payload = { merchantId: "123" };

        mockedPost.mockResolvedValueOnce({ data: [] } as never);

        await collectionApi.getAvailableMerchants(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/APIGatway/GetAvailableMerchant",
            payload,
        );
    });

    it("retrieves tax offices", async () => {
        const payload = { stateCode: "LA" };

        mockedPost.mockResolvedValueOnce({ data: [] } as never);

        await collectionApi.getTaxOffices(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/APIGatway/GetTaxOffices",
            payload,
        );
    });

    it("retrieves payment options", async () => {
        const payload = { merchantId: "123" };

        mockedPost.mockResolvedValueOnce({ data: [] } as never);

        await collectionApi.getPaymentOptions(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/APIGatway/GetPaymentOptions",
            payload,
        );
    });

    it("retrieves merchant payment items", async () => {
        const payload = { merchantId: "123" };

        mockedPost.mockResolvedValueOnce({ data: [] } as never);

        await collectionApi.getMerchantPaymentItems(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/APIGatway/GetMerchantPaymentItems",
            payload,
        );
    });

    it("JSON-encodes the transaction payload", async () => {
        const payload = {
            transactionId: "TX123",
            amount: 5000,
        };

        mockedPost.mockResolvedValueOnce({
            data: { success: true },
        } as never);

        await collectionApi.postTransaction(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/APIGatway/PostTransaction",
            JSON.stringify(payload),
        );
    });

    it("returns the API response data", async () => {
        const responseData = {
            responseCode: "00",
            responseMessage: "Successful",
        };

        mockedPost.mockResolvedValueOnce({
            data: responseData,
        } as never);

        const result = await collectionApi.getPaymentOptions({});

        expect(result).toEqual(responseData);
    });
});