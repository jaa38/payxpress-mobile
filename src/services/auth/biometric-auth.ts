import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

import { STORAGE_KEYS } from "@/constants/storage";
import { secureStorage } from "@/services/storage/secure-storage";

export interface BiometricAvailability {
    isAvailable: boolean;
    hasHardware: boolean;
    isEnrolled: boolean;
    supportedTypes: LocalAuthentication.AuthenticationType[];
    biometricType: "Face ID" | "Fingerprint" | "Biometrics" | null;
    message?: string;
}

export interface BiometricAuthResult {
    success: boolean;
    error?: string;
}

const getBiometricName = (
    types: LocalAuthentication.AuthenticationType[],
): BiometricAvailability["biometricType"] => {
    if (
        Platform.OS === "ios" &&
        types.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
        )
    ) {
        return "Face ID";
    }

    if (
        types.includes(
            LocalAuthentication.AuthenticationType.FINGERPRINT,
        )
    ) {
        return "Fingerprint";
    }

    if (
        types.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
        )
    ) {
        return "Biometrics";
    }

    return null;
};

export const biometricAuth = {
    async getAvailability(): Promise<BiometricAvailability> {
        const [hasHardware, isEnrolled, supportedTypes] = await Promise.all([
            LocalAuthentication.hasHardwareAsync(),
            LocalAuthentication.isEnrolledAsync(),
            LocalAuthentication.supportedAuthenticationTypesAsync(),
        ]);

        const biometricType = getBiometricName(supportedTypes);

        const isAvailable =
            hasHardware &&
            isEnrolled &&
            biometricType !== null;

        let message: string | undefined;

        if (!hasHardware) {
            message = "This device does not support biometric authentication.";
        } else if (!isEnrolled) {
            message = "Set up biometrics in your device settings first.";
        } else if (!biometricType) {
            message = "No supported biometric authentication method was found.";
        }

        return {
            isAvailable,
            hasHardware,
            isEnrolled,
            supportedTypes,
            biometricType,
            message,
        };
    },

    async authenticate(): Promise<BiometricAuthResult> {
        try {
            const availability = await this.getAvailability();

            if (!availability.isAvailable) {
                return {
                    success: false,
                    error: availability.message,
                };
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: "Sign in to PayXpress",
                cancelLabel: "Cancel",
                fallbackLabel: "Use another method",
                disableDeviceFallback: true,
            });

            if (!result.success) {
                return {
                    success: false,
                    error: result.error,
                };
            }

            return {
                success: true,
            };
        } catch {
            return {
                success: false,
                error: "Biometric authentication could not be completed.",
            };
        }
    },

    async isEnabled(): Promise<boolean> {
        const value = await secureStorage.getItem(
            STORAGE_KEYS.biometricEnabled,
        );

        return value === "true";
    },

    async setEnabled(enabled: boolean): Promise<void> {
        if (enabled) {
            await secureStorage.setItem(
                STORAGE_KEYS.biometricEnabled,
                "true",
            );
            return;
        }

        await secureStorage.removeItem(
            STORAGE_KEYS.biometricEnabled,
        );
    },
};