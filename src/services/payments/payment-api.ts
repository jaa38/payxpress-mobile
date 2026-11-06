import { paymentClient } from "@/lib/http/payment-client";

export type PaymentRequestPayload = Record<string, unknown>;
export type PaymentApiResponse = unknown;

export const paymentApi = {
    /**
     * Retrieve banks that support USSD payments.
     * Requires a Payment Gateway token.
     */
    async getUssdBanks(): Promise<PaymentApiResponse> {
        const response = await paymentClient.get(
            "/Payments/GetUSSDBanks",
            { requiresPaymentAuth: true },
        );

        return response.data;
    },

    /**
     * Retrieve banks available for account payments.
     *
     * The legacy API documentation specifies a GET request
     * with a request body. Confirm this behaviour with the backend.
     */
    async getBanksForAccountPayment(): Promise<PaymentApiResponse> {
        const response = await paymentClient.get(
            "/Payments/GetBanksForAccountPayment",
            {
                requiresPaymentAuth: true,
                data: { type: "Frontend" },
            },
        );

        return response.data;
    },

    /**
     * Retrieve banks that support virtual accounts.
     * Requires a Payment Gateway token.
     */
    async getBanksForVirtualAccount(): Promise<PaymentApiResponse> {
        const response = await paymentClient.get(
            "/Payments/GetBanksForVirtualAccount",
            { requiresPaymentAuth: true },
        );

        return response.data;
    },

    /**
     * Initialise a payment.
     * This endpoint does not require an authentication token.
     */
    async initializePayment(
        payload: PaymentRequestPayload,
    ): Promise<PaymentApiResponse> {
        const response = await paymentClient.post(
            "/Payments/Initialize",
            payload,
        );

        return response.data;
    },

    /**
     * Retrieve payment information using an access code.
     * Requires the main application JWT.
     */
    async getPaymentInfo(
        accessCode: string,
    ): Promise<PaymentApiResponse> {
        const response = await paymentClient.get(
            `/Payments/GetPaymentInfo/${encodeURIComponent(accessCode)}`,
            { requiresAuth: true },
        );

        return response.data;
    },

    /**
     * Make a payment.
     * Requires a Payment Gateway token.
     */
    async makePayment(
        payload: PaymentRequestPayload,
    ): Promise<PaymentApiResponse> {
        const response = await paymentClient.post(
            "/Payments/MakePayment",
            payload,
            { requiresPaymentAuth: true },
        );

        return response.data;
    },

    /**
     * Validate a payment.
     * Requires a Payment Gateway token.
     */
    async validatePayment(
        payload: PaymentRequestPayload,
    ): Promise<PaymentApiResponse> {
        const response = await paymentClient.post(
            "/Payments/ValidatePayment",
            payload,
            { requiresPaymentAuth: true },
        );

        return response.data;
    },

    /**
     * Save a payment card.
     * Requires a Payment Gateway token.
     */
    async saveCard(
        payload: PaymentRequestPayload,
    ): Promise<PaymentApiResponse> {
        const response = await paymentClient.post(
            "/Payments/SaveCard",
            payload,
            { requiresPaymentAuth: true },
        );

        return response.data;
    },

    /**
     * Retrieve saved payment cards for an email address.
     * Requires a Payment Gateway token.
     */
    async getSavedCards(email: string): Promise<PaymentApiResponse> {
        const response = await paymentClient.get(
            `/Payments/Getsavecard/${encodeURIComponent(email)}`,
            { requiresPaymentAuth: true },
        );

        return response.data;
    },

    /**
     * Tokenize a payment card.
     * Requires a Payment Gateway token.
     */
    async tokenizeCard(
        payload: PaymentRequestPayload,
    ): Promise<PaymentApiResponse> {
        const response = await paymentClient.post(
            "/Payments/Tokenization",
            payload,
            { requiresPaymentAuth: true },
        );

        return response.data;
    },

    /**
     * Validate a bank account.
     * Requires a Payment Gateway token.
     */
    async validateUserAccount(
        payload: PaymentRequestPayload,
    ): Promise<PaymentApiResponse> {
        const response = await paymentClient.post(
            "/Payments/ValidateUserAccount",
            payload,
            { requiresPaymentAuth: true },
        );

        return response.data;
    },

    /**
     * Create a payment invoice.
     * Requires a Payment Gateway token.
     */
    async createInvoice(
        payload: PaymentRequestPayload,
    ): Promise<PaymentApiResponse> {
        const response = await paymentClient.post(
            "/Payments/CreateInvoice",
            payload,
            { requiresPaymentAuth: true },
        );

        return response.data;
    },
};