
import * as SecureStore from "expo-secure-store";

import { secureStorage } from "@/services/storage/secure-storage";

jest.mock("expo-secure-store", () => ({
    WHEN_UNLOCKED: "WHEN_UNLOCKED",
    setItemAsync: jest.fn(),
    getItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

describe("secureStorage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const expectedOptions = {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
    };

    it("stores values securely", async () => {
        await secureStorage.setItem("test.key", "test-value");

        expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
            "test.key",
            "test-value",
            expectedOptions,
        );
    });

    it("retrieves values securely", async () => {
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
            "test-value",
        );

        await expect(
            secureStorage.getItem("test.key"),
        ).resolves.toBe("test-value");

        expect(SecureStore.getItemAsync).toHaveBeenCalledWith(
            "test.key",
            expectedOptions,
        );
    });

    it("returns null when a value does not exist", async () => {
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

        await expect(
            secureStorage.getItem("missing.key"),
        ).resolves.toBeNull();
    });

    it("removes values securely", async () => {
        await secureStorage.removeItem("test.key");

        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
            "test.key",
            expectedOptions,
        );
    });

    it("propagates storage errors", async () => {
        (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(
            new Error("Secure storage unavailable"),
        );

        await expect(
            secureStorage.getItem("test.key"),
        ).rejects.toThrow("Secure storage unavailable");
    });
});
