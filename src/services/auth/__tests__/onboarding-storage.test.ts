import { STORAGE_KEYS } from "@/constants/storage";
import { onboardingStorage } from "@/services/auth/onboarding-storage";
import { secureStorage } from "@/services/storage/secure-storage";

jest.mock("@/services/storage/secure-storage", () => ({
    secureStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
    },
}));

const mockedGetItem = jest.mocked(secureStorage.getItem);
const mockedSetItem = jest.mocked(secureStorage.setItem);

describe("onboardingStorage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("hasCompleted", () => {
        it("returns true when onboarding is completed", async () => {
            mockedGetItem.mockResolvedValue("true");

            await expect(
                onboardingStorage.hasCompleted(),
            ).resolves.toBe(true);

            expect(mockedGetItem).toHaveBeenCalledWith(
                STORAGE_KEYS.onboardingCompleted,
            );
        });

        it("returns false when onboarding is incomplete", async () => {
            mockedGetItem.mockResolvedValue(null);

            await expect(
                onboardingStorage.hasCompleted(),
            ).resolves.toBe(false);
        });

        it("returns false when stored value is not true", async () => {
            mockedGetItem.mockResolvedValue("false");

            await expect(
                onboardingStorage.hasCompleted(),
            ).resolves.toBe(false);
        });

        it("propagates storage errors", async () => {
            mockedGetItem.mockRejectedValue(
                new Error("Storage unavailable"),
            );

            await expect(
                onboardingStorage.hasCompleted(),
            ).rejects.toThrow("Storage unavailable");
        });
    });

    describe("markCompleted", () => {
        it("persists onboarding completion", async () => {
            mockedSetItem.mockResolvedValue(undefined);

            await onboardingStorage.markCompleted();

            expect(mockedSetItem).toHaveBeenCalledWith(
                STORAGE_KEYS.onboardingCompleted,
                "true",
            );
        });

        it("propagates storage errors", async () => {
            mockedSetItem.mockRejectedValue(
                new Error("Unable to save onboarding"),
            );

            await expect(
                onboardingStorage.markCompleted(),
            ).rejects.toThrow("Unable to save onboarding");
        });
    });
});