
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import type { BiometricAvailability } from "@/services/auth/biometric-auth";
import { biometricAuth } from "@/services/auth/biometric-auth";

jest.mock("@/services/auth/biometric-auth", () => ({
    biometricAuth: {
        getAvailability: jest.fn(),
        isEnabled: jest.fn(),
        authenticate: jest.fn(),
        setEnabled: jest.fn(),
    },
}));

const mockedBiometricAuth =
    biometricAuth as jest.Mocked<typeof biometricAuth>;

const availableBiometrics: BiometricAvailability = {
    isAvailable: true,
    hasHardware: true,
    isEnrolled: true,
    supportedTypes: [2],
    biometricType: "Face ID",
};

const unavailableBiometrics: BiometricAvailability = {
    isAvailable: false,
    hasHardware: false,
    isEnrolled: false,
    supportedTypes: [],
    biometricType: null,
    message: "This device does not support biometric authentication.",
};

describe("useBiometricAuth", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedBiometricAuth.getAvailability.mockResolvedValue(
            availableBiometrics,
        );

        mockedBiometricAuth.isEnabled.mockResolvedValue(false);

        mockedBiometricAuth.authenticate.mockResolvedValue({
            success: true,
        });

        mockedBiometricAuth.setEnabled.mockResolvedValue(undefined);
    });

    it("starts in a loading state", async () => {
        let resolveAvailability!: (
            value: BiometricAvailability,
        ) => void;

        let resolveEnabled!: (value: boolean) => void;

        mockedBiometricAuth.getAvailability.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveAvailability = resolve;
                }),
        );

        mockedBiometricAuth.isEnabled.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveEnabled = resolve;
                }),
        );

        const { result } = renderHook(() => useBiometricAuth());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.availability).toBeNull();
        expect(result.current.isEnabled).toBe(false);

        await act(async () => {
            resolveAvailability(availableBiometrics);
            resolveEnabled(false);
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });
    });

    it("loads biometric availability and saved preference on mount", async () => {
        mockedBiometricAuth.isEnabled.mockResolvedValue(true);

        const { result } = renderHook(() => useBiometricAuth());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.availability).toEqual(availableBiometrics);
        expect(result.current.isEnabled).toBe(true);

        expect(mockedBiometricAuth.getAvailability).toHaveBeenCalledTimes(1);
        expect(mockedBiometricAuth.isEnabled).toHaveBeenCalledTimes(1);
    });

    it("loads an unavailable biometric state", async () => {
        mockedBiometricAuth.getAvailability.mockResolvedValue(
            unavailableBiometrics,
        );

        const { result } = renderHook(() => useBiometricAuth());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.availability).toEqual(unavailableBiometrics);
        expect(result.current.isEnabled).toBe(false);
    });

    it("refreshes biometric availability and preference", async () => {
        const updatedAvailability: BiometricAvailability = {
            ...availableBiometrics,
            biometricType: "Fingerprint",
        };

        const { result } = renderHook(() => useBiometricAuth());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        mockedBiometricAuth.getAvailability.mockResolvedValue(
            updatedAvailability,
        );

        mockedBiometricAuth.isEnabled.mockResolvedValue(true);

        await act(async () => {
            await result.current.refreshAvailability();
        });

        expect(result.current.availability).toEqual(updatedAvailability);
        expect(result.current.isEnabled).toBe(true);
        expect(result.current.isLoading).toBe(false);

        expect(mockedBiometricAuth.getAvailability).toHaveBeenCalledTimes(2);
        expect(mockedBiometricAuth.isEnabled).toHaveBeenCalledTimes(2);
    });

    it("does not enable biometrics when they are unavailable", async () => {
        mockedBiometricAuth.getAvailability.mockResolvedValue(
            unavailableBiometrics,
        );

        const { result } = renderHook(() => useBiometricAuth());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        let enabled: boolean | undefined;

        await act(async () => {
            enabled = await result.current.enableBiometric();
        });

        expect(enabled).toBe(false);
        expect(mockedBiometricAuth.authenticate).not.toHaveBeenCalled();
        expect(mockedBiometricAuth.setEnabled).not.toHaveBeenCalled();
        expect(result.current.isEnabled).toBe(false);
    });

    it("enables biometrics after successful authentication", async () => {
        const { result } = renderHook(() => useBiometricAuth());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        let enabled: boolean | undefined;

        await act(async () => {
            enabled = await result.current.enableBiometric();
        });

        expect(enabled).toBe(true);
        expect(mockedBiometricAuth.authenticate).toHaveBeenCalledTimes(1);
        expect(mockedBiometricAuth.setEnabled).toHaveBeenCalledWith(true);
        expect(result.current.isEnabled).toBe(true);
    });

    it("does not enable biometrics when authentication fails", async () => {
        mockedBiometricAuth.authenticate.mockResolvedValue({
            success: false,
            error: "authentication_failed",
        });

        const { result } = renderHook(() => useBiometricAuth());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        let enabled: boolean | undefined;

        await act(async () => {
            enabled = await result.current.enableBiometric();
        });

        expect(enabled).toBe(false);
        expect(mockedBiometricAuth.setEnabled).not.toHaveBeenCalled();
        expect(result.current.isEnabled).toBe(false);
    });

    it("disables biometrics and updates the state", async () => {
        mockedBiometricAuth.isEnabled.mockResolvedValue(true);

        const { result } = renderHook(() => useBiometricAuth());

        await waitFor(() => {
            expect(result.current.isEnabled).toBe(true);
        });

        await act(async () => {
            await result.current.disableBiometric();
        });

        expect(mockedBiometricAuth.setEnabled).toHaveBeenCalledWith(false);
        expect(result.current.isEnabled).toBe(false);
    });
});
