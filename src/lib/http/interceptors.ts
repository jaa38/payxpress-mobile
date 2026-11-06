import { type AxiosInstance } from "axios";

import { authSession } from "@/services/auth/auth-session";
import { paymentSession } from "@/services/payments/payment-session";
import { normalizeError } from "@/utils/errors/normalize-error";

export const attachCoreAuthInterceptor = (
    client: AxiosInstance,
): void => {
    client.interceptors.request.use(async (config) => {
        if (config.requiresAuth !== true) {
            return config;
        }

        const session = await authSession.getSession();

        if (!session?.accessToken) {
            throw new Error(
                "Authentication required. No valid local session was found.",
            );
        }

        config.headers.set(
            "Authorization",
            `Bearer ${session.accessToken}`,
        );

        return config;
    });
};

/**
 * Payment Gateway authentication.
 *
 * Supports both the main PayXpress access token and
 * the separate Payment Gateway token.
 *
 * The payment token is currently attached using the
 * Bearer authorization convention. Confirm this format
 * with the Payment Gateway backend before release.
 */
export const attachPaymentAuthInterceptor = (
    client: AxiosInstance,
): void => {
    client.interceptors.request.use(async (config) => {
        if (
            config.requiresAuth === true &&
            config.requiresPaymentAuth === true
        ) {
            throw new Error(
                "A request cannot require both app and payment authentication.",
            );
        }

        if (config.requiresPaymentAuth === true) {
            const token = await paymentSession.getPaymentToken();

            if (!token) {
                throw new Error(
                    "Payment authentication required. No payment token was found.",
                );
            }

            config.headers.set(
                "Authorization",
                `Bearer ${token}`,
            );

            return config;
        }

        if (config.requiresAuth === true) {
            const session = await authSession.getSession();

            if (!session?.accessToken) {
                throw new Error(
                    "Authentication required. No valid local session was found.",
                );
            }

            config.headers.set(
                "Authorization",
                `Bearer ${session.accessToken}`,
            );
        }

        return config;
    });
};

export const attachResponseInterceptor = (
    client: AxiosInstance,
): void => {
    client.interceptors.response.use(
        (response) => response,
        (error) => {
            if (
                error instanceof Error &&
                (
                    error.message.startsWith("Authentication required.") ||
                    error.message.startsWith("Payment authentication required.") ||
                    error.message.startsWith("A request cannot require both")
                )
            ) {
                return Promise.reject(error);
            }

            return Promise.reject(normalizeError(error));
        },
    );
};