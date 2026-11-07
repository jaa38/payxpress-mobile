import { STORAGE_KEYS } from "@/constants/storage";
import { secureStorage } from "@/services/storage/secure-storage";

export const onboardingStorage = {
    async hasCompleted(): Promise<boolean> {
        const value = await secureStorage.getItem(
            STORAGE_KEYS.onboardingCompleted,
        );

        return value === "true";
    },

    async markCompleted(): Promise<void> {
        await secureStorage.setItem(
            STORAGE_KEYS.onboardingCompleted,
            "true",
        );
    },
};
