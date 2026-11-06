import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

import { STORAGE_KEYS } from "@/constants/storage";
import { biometricAuth } from "@/services/auth/biometric-auth";
import { secureStorage } from "@/services/storage/secure-storage";

jest.mock("expo-local-authentication", () => ({
    AuthenticationType: {
        FINGERPRINT: 1,
        FACIAL_RECOGNITION: 2,
        IRIS: 3,
    },
    hasHardwareAsync: jest.fn(),
    isEnrolledAsync: jest.fn(),
    supportedAuthenticationTypesAsync: jest.fn(),
    authenticateAsync: jest.fn(),
}));

jest.mock("@/services/storage/secure-storage", () => ({
    secureStorage: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
    },
}));

const mockedLocalAuthentication =
    LocalAuthentication as jest.Mocked<typeof LocalAuthentication>;

const mockedSecureStorage =
    secureStorage as jest.Mocked<typeof secureStorage>;

const originalPlatformOS = Object.getOwnPropertyDescriptor(
    Platform,
    "OS",
);

const fingerprint = LocalAuthentication.AuthenticationType.FINGERPRINT;
const facialRecognition =
    LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION;

describe("biometricAuth", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        Object.defineProperty(Platform, "OS", {
            configurable: true,
            value: "ios",
        });
    });

    afterAll(() => {
        if (originalPlatformOS) {
            Object.defineProperty(Platform, "OS", originalPlatformOS);
        }
    });

    describe("getAvailability", () => {
        it("returns unavailable when the device has no biometric hardware", async () => {
            mockedLocalAuthentication.hasHardwareAsync.mockResolvedValue(false);
            mockedLocalAuthentication.isEnrolledAsync.mockResolvedValue(true);
            mockedLocalAuthentication.supportedAuthenticationTypesAsync.mockResolvedValue([
                facialRecognition,
            ]);

            await expect(biometricAuth.getAvailability()).resolves.toEqual({
                isAvailable: false,
                hasHardware: false,
                isEnrolled: true,
                supportedTypes: [facialRecognition],
                biometricType: "Face ID",
                message:
                    "This device does not support biometric authentication.",
            });
        });

        it("returns unavailable when biometrics have not been enrolled", async () => {
            mockedLocalAuthentication.hasHardwareAsync.mockResolvedValue(true);
            mockedLocalAuthentication.isEnrolledAsync.mockResolvedValue(false);
            mockedLocalAuthentication.supportedAuthenticationTypesAsync.mockResolvedValue([
                facialRecognition,
            ]);

            const result = await biometricAuth.getAvailability();

            expect(result.isAvailable).toBe(false);
            expect(result.message).toBe(
                "Set up biometrics in your device settings first.",
            );
        });

        it("returns unavailable when no supported biometric type is found", async () => {
            mockedLocalAuthentication.hasHardwareAsync.mockResolvedValue(true);
            mockedLocalAuthentication.isEnrolledAsync.mockResolvedValue(true);
            mockedLocalAuthentication.supportedAuthenticationTypesAsync.mockResolvedValue(
                [],
            );

            const result = await biometricAuth.getAvailability();

            expect(result).toMatchObject({
                isAvailable: false,
                hasHardware: true,
                isEnrolled: true,
                biometricType: null,
                message:
                    "No supported biometric authentication method was found.",
            });
        });

        it("identifies Face ID on iOS", async () => {
            mockedLocalAuthentication.hasHardwareAsync.mockResolvedValue(true);
            mockedLocalAuthentication.isEnrolledAsync.mockResolvedValue(true);
            mockedLocalAuthentication.supportedAuthenticationTypesAsync.mockResolvedValue([
                facialRecognition,
            ]);

            const result = await biometricAuth.getAvailability();

            expect(result).toMatchObject({
                isAvailable: true,
                biometricType: "Face ID",
                hasHardware: true,
                isEnrolled: true,
            });
            expect(result.message).toBeUndefined();
        });

        it("identifies fingerprint authentication", async () => {
            mockedLocalAuthentication.hasHardwareAsync.mockResolvedValue(true);
            mockedLocalAuthentication.isEnrolledAsync.mockResolvedValue(true);
            mockedLocalAuthentication.supportedAuthenticationTypesAsync.mockResolvedValue([
                fingerprint,
            ]);

            const result = await biometricAuth.getAvailability();

            expect(result).toMatchObject({
                isAvailable: true,
                biometricType: "Fingerprint",
            });
        });

        it("identifies generic biometrics on Android", async () => {
            Object.defineProperty(Platform, "OS", {
                configurable: true,
                value: "android",
            });

            mockedLocalAuthentication.hasHardwareAsync.mockResolvedValue(true);
            mockedLocalAuthentication.isEnrolledAsync.mockResolvedValue(true);
            mockedLocalAuthentication.supportedAuthenticationTypesAsync.mockResolvedValue([
                facialRecognition,
            ]);

            const result = await biometricAuth.getAvailability();

            expect(result).toMatchObject({
                isAvailable: true,
                biometricType: "Biometrics",
            });
        });
    });

    describe("authenticate", () => {
        it("authenticates successfully when biometrics are available", async () => {
            mockedLocalAuthentication.hasHardwareAsync.mockResolvedValue(true);
            mockedLocalAuthentication.isEnrolledAsync.mockResolvedValue(true);
            mockedLocalAuthentication.supportedAuthenticationTypesAsync.mockResolvedValue([
                facialRecognition,
            ]);
            mockedLocalAuthentication.authenticateAsync.mockResolvedValue({
                success: true,
            });

            await expect(biometricAuth.authenticate()).resolves.toEqual({
                success: true,
            });

            expect(
                mockedLocalAuthentication.authenticateAsync,
            ).toHaveBeenCalledWith({
                promptMessage: "Sign in to PayXpress",
                cancelLabel: "Cancel",
                fallbackLabel: "Use another method",
                disableDeviceFallback: true,
            });
        });

        it("does not prompt when biometrics are unavailable", async () => {
            mockedLocalAuthentication.hasHardwareAsync.mockResolvedValue(false);
            mockedLocalAuthentication.isEnrolledAsync.mockResolvedValue(false);
            mockedLocalAuthentication.supportedAuthenticationTypesAsync.mockResolvedValue(
                [],
            );

            await expect(biometricAuth.authenticate()).resolves.toEqual({
                success: false,
                error:
                    "This device does not support biometric authentication.",
            });

            expect(
                mockedLocalAuthentication.authenticateAsync,
            ).not.toHaveBeenCalled();
        });

        it("returns the authentication error when authentication fails", async () => {
            mockedLocalAuthentication.hasHardwareAsync.mockResolvedValue(true);
            mockedLocalAuthentication.isEnrolledAsync.mockResolvedValue(true);
            mockedLocalAuthentication.supportedAuthenticationTypesAsync.mockResolvedValue([
                facialRecognition,
            ]);
            mockedLocalAuthentication.authenticateAsync.mockResolvedValue({
                success: false,
                error: "authentication_failed",
            });

            await expect(biometricAuth.authenticate()).resolves.toEqual({
                success: false,
                error: "authentication_failed",
            });
        });

        it("returns a fallback error when authentication throws", async () => {
            mockedLocalAuthentication.hasHardwareAsync.mockRejectedValue(
                new Error("Hardware error"),
            );

            await expect(biometricAuth.authenticate()).resolves.toEqual({
                success: false,
                error: "Biometric authentication could not be completed.",
            });
        });
    });

    describe("isEnabled", () => {
        it("returns true when biometric authentication is enabled", async () => {
            mockedSecureStorage.getItem.mockResolvedValue("true");

            await expect(biometricAuth.isEnabled()).resolves.toBe(true);

            expect(mockedSecureStorage.getItem).toHaveBeenCalledWith(
                STORAGE_KEYS.biometricEnabled,
            );
        });

        it("returns false when biometric authentication is disabled", async () => {
            mockedSecureStorage.getItem.mockResolvedValue("false");

            await expect(biometricAuth.isEnabled()).resolves.toBe(false);
        });

        it("returns false when no preference is stored", async () => {
            mockedSecureStorage.getItem.mockResolvedValue(null);

            await expect(biometricAuth.isEnabled()).resolves.toBe(false);
        });
    });

    describe("setEnabled", () => {
        it("stores true when biometric authentication is enabled", async () => {
            mockedSecureStorage.setItem.mockResolvedValue(undefined);

            await biometricAuth.setEnabled(true);

            expect(mockedSecureStorage.setItem).toHaveBeenCalledWith(
                STORAGE_KEYS.biometricEnabled,
                "true",
            );
            expect(mockedSecureStorage.removeItem).not.toHaveBeenCalled();
        });

        it("removes the preference when biometric authentication is disabled", async () => {
            mockedSecureStorage.removeItem.mockResolvedValue(undefined);

            await biometricAuth.setEnabled(false);

            expect(mockedSecureStorage.removeItem).toHaveBeenCalledWith(
                STORAGE_KEYS.biometricEnabled,
            );
            expect(mockedSecureStorage.setItem).not.toHaveBeenCalled();
        });
    });
});