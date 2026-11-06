import { STORAGE_KEYS } from "@/constants/storage";
import { secureStorage } from "@/services/storage/secure-storage";

export const paymentSession = {
    async getPaymentToken(): Promise<string | null> {
        return secureStorage.getItem(STORAGE_KEYS.paymentToken);
    },

    async savePaymentToken(token: string): Promise<void> {
        const normalizedToken = token.trim();

        if (!normalizedToken) {
            throw new Error("A valid payment token is required.");
        }

        await secureStorage.setItem(
            STORAGE_KEYS.paymentToken,
            normalizedToken,
        );
    },

    async clearPaymentToken(): Promise<void> {
        await secureStorage.removeItem(STORAGE_KEYS.paymentToken);
    },
};