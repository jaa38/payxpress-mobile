import { useCallback, useEffect, useState } from "react";

import {
    biometricAuth,
    type BiometricAvailability,
} from "@/services/auth/biometric-auth";

interface UseBiometricAuthReturn {
    availability: BiometricAvailability | null;
    isEnabled: boolean;
    isLoading: boolean;
    refreshAvailability: () => Promise<void>;
    enableBiometric: () => Promise<boolean>;
    disableBiometric: () => Promise<void>;
}

export function useBiometricAuth(): UseBiometricAuthReturn {
    const [availability, setAvailability] =
        useState<BiometricAvailability | null>(null);

    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const refreshAvailability = useCallback(async () => {
        try {
            setIsLoading(true);

            const [result, enabled] = await Promise.all([
                biometricAuth.getAvailability(),
                biometricAuth.isEnabled(),
            ]);

            setAvailability(result);
            setIsEnabled(enabled);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const enableBiometric = useCallback(async (): Promise<boolean> => {
        if (!availability?.isAvailable) {
            return false;
        }

        const result = await biometricAuth.authenticate();

        if (!result.success) {
            return false;
        }

        await biometricAuth.setEnabled(true);
        setIsEnabled(true);

        return true;
    }, [availability]);

    const disableBiometric = useCallback(async (): Promise<void> => {
        await biometricAuth.setEnabled(false);
        setIsEnabled(false);
    }, []);

    useEffect(() => {
        void refreshAvailability();
    }, [refreshAvailability]);

    return {
        availability,
        isEnabled,
        isLoading,
        refreshAvailability,
        enableBiometric,
        disableBiometric,
    };
}