
import { paymentClient } from "@/lib/http/payment-client";
import { paymentApi } from "@/services/payments/payment-api";

jest.mock("@/lib/http/payment-client", () => ({
    paymentClient: {
        get: jest.fn(),
        post: jest.fn(),
    },
}));

const mockedGet = jest.mocked(paymentClient.get);
const mockedPost = jest.mocked(paymentClient.post);

describe("paymentApi", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("retrieves USSD banks with payment authentication", async () => {
        const responseData = [{ name: "Test Bank" }];

        mockedGet.mockResolvedValueOnce({
            data: responseData,
        } as never);

        const result = await paymentApi.getUssdBanks();

        expect(mockedGet).toHaveBeenCalledWith(
            "/Payments/GetUSSDBanks",
            { requiresPaymentAuth: true },
        );

        expect(result).toEqual(responseData);
    });

    it("retrieves account payment banks with the documented GET body", async () => {
        const responseData = [{ name: "Test Bank" }];

        mockedGet.mockResolvedValueOnce({
            data: responseData,
        } as never);

        const result = await paymentApi.getBanksForAccountPayment();

        expect(mockedGet).toHaveBeenCalledWith(
            "/Payments/GetBanksForAccountPayment",
            {
                requiresPaymentAuth: true,
                data: { type: "Frontend" },
            },
        );

        expect(result).toEqual(responseData);
    });

    it("retrieves virtual account banks with payment authentication", async () => {
        const responseData = [{ name: "Virtual Bank" }];

        mockedGet.mockResolvedValueOnce({
            data: responseData,
        } as never);

        const result = await paymentApi.getBanksForVirtualAccount();

        expect(mockedGet).toHaveBeenCalledWith(
            "/Payments/GetBanksForVirtualAccount",
            { requiresPaymentAuth: true },
        );

        expect(result).toEqual(responseData);
    });

    it("initialises a payment without authentication", async () => {
        const payload = { amount: "5000", currency: "NGN" };
        const responseData = { reference: "PAY123" };

        mockedPost.mockResolvedValueOnce({
            data: responseData,
        } as never);

        const result = await paymentApi.initializePayment(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/Payments/Initialize",
            payload,
        );

        expect(result).toEqual(responseData);
    });

    it("retrieves payment information with the app JWT", async () => {
        const responseData = { status: "successful" };

        mockedGet.mockResolvedValueOnce({
            data: responseData,
        } as never);

        const result = await paymentApi.getPaymentInfo("access-code-123");

        expect(mockedGet).toHaveBeenCalledWith(
            "/Payments/GetPaymentInfo/access-code-123",
            { requiresAuth: true },
        );

        expect(result).toEqual(responseData);
    });

    it("encodes special characters in payment access codes", async () => {
        mockedGet.mockResolvedValueOnce({
            data: {},
        } as never);

        await paymentApi.getPaymentInfo("access/code 123");

        expect(mockedGet).toHaveBeenCalledWith(
            "/Payments/GetPaymentInfo/access%2Fcode%20123",
            { requiresAuth: true },
        );
    });

    it("makes a payment with payment authentication", async () => {
        const payload = { payload: "payment-data" };
        const responseData = { transactionId: "TX123" };

        mockedPost.mockResolvedValueOnce({
            data: responseData,
        } as never);

        const result = await paymentApi.makePayment(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/Payments/MakePayment",
            payload,
            { requiresPaymentAuth: true },
        );

        expect(result).toEqual(responseData);
    });

    it("validates a payment with payment authentication", async () => {
        const payload = { transactionId: "TX123" };
        const responseData = { valid: true };

        mockedPost.mockResolvedValueOnce({
            data: responseData,
        } as never);

        const result = await paymentApi.validatePayment(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/Payments/ValidatePayment",
            payload,
            { requiresPaymentAuth: true },
        );

        expect(result).toEqual(responseData);
    });

    it("saves a payment card with payment authentication", async () => {
        const payload = { cardToken: "token-123" };
        const responseData = { saved: true };

        mockedPost.mockResolvedValueOnce({
            data: responseData,
        } as never);

        const result = await paymentApi.saveCard(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/Payments/SaveCard",
            payload,
            { requiresPaymentAuth: true },
        );

        expect(result).toEqual(responseData);
    });

    it("retrieves saved cards with payment authentication", async () => {
        const responseData = [{ lastFour: "1234" }];

        mockedGet.mockResolvedValueOnce({
            data: responseData,
        } as never);

        const result = await paymentApi.getSavedCards("test@example.com");

        expect(mockedGet).toHaveBeenCalledWith(
            "/Payments/Getsavecard/test%40example.com",
            { requiresPaymentAuth: true },
        );

        expect(result).toEqual(responseData);
    });

    it("tokenizes a payment card with payment authentication", async () => {
        const payload = { cardNumber: "test-card-number" };
        const responseData = { token: "card-token-123" };

        mockedPost.mockResolvedValueOnce({
            data: responseData,
        } as never);

        const result = await paymentApi.tokenizeCard(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/Payments/Tokenization",
            payload,
            { requiresPaymentAuth: true },
        );

        expect(result).toEqual(responseData);
    });

    it("validates a user bank account with payment authentication", async () => {
        const payload = { accountNumber: "1234567890" };
        const responseData = { valid: true };

        mockedPost.mockResolvedValueOnce({
            data: responseData,
        } as never);

        const result = await paymentApi.validateUserAccount(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/Payments/ValidateUserAccount",
            payload,
            { requiresPaymentAuth: true },
        );

        expect(result).toEqual(responseData);
    });

    it("creates an invoice with payment authentication", async () => {
        const payload = { amount: 5000 };
        const responseData = { invoiceId: "INV123" };

        mockedPost.mockResolvedValueOnce({
            data: responseData,
        } as never);

        const result = await paymentApi.createInvoice(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/Payments/CreateInvoice",
            payload,
            { requiresPaymentAuth: true },
        );

        expect(result).toEqual(responseData);
    });
});
