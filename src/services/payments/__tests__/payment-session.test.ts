import { STORAGE_KEYS } from "@/constants/storage";
import { paymentSession } from "@/services/payments/payment-session";
import { secureStorage } from "@/services/storage/secure-storage";

jest.mock("@/services/storage/secure-storage", () => ({
    secureStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
    },
}));

const mockedSecureStorage = jest.mocked(secureStorage);

describe("paymentSession", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("retrieves the payment token securely", async () => {
        mockedSecureStorage.getItem.mockResolvedValue("payment-token");

        const result = await paymentSession.getPaymentToken();

        expect(result).toBe("payment-token");
        expect(mockedSecureStorage.getItem).toHaveBeenCalledWith(
            STORAGE_KEYS.paymentToken,
        );
    });

    it("saves the payment token securely", async () => {
        await paymentSession.savePaymentToken("payment-token");

        expect(mockedSecureStorage.setItem).toHaveBeenCalledWith(
            STORAGE_KEYS.paymentToken,
            "payment-token",
        );
    });

    it("trims the payment token before saving", async () => {
        await paymentSession.savePaymentToken("  payment-token  ");

        expect(mockedSecureStorage.setItem).toHaveBeenCalledWith(
            STORAGE_KEYS.paymentToken,
            "payment-token",
        );
    });

    it("rejects an empty payment token", async () => {
        await expect(
            paymentSession.savePaymentToken("  "),
        ).rejects.toThrow("A valid payment token is required.");

        expect(mockedSecureStorage.setItem).not.toHaveBeenCalled();
    });

    it("clears the payment token securely", async () => {
        await paymentSession.clearPaymentToken();

        expect(mockedSecureStorage.removeItem).toHaveBeenCalledWith(
            STORAGE_KEYS.paymentToken,
        );
    });
});