
import { type AxiosInstance } from "axios";

import { authSession } from "@/services/auth/auth-session";
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

export const attachResponseInterceptor = (
    client: AxiosInstance,
): void => {
    client.interceptors.response.use(
        (response) => response,
        (error) => {
            if (
                error instanceof Error &&
                error.message.startsWith("Authentication required.")
            ) {
                return Promise.reject(error);
            }

            return Promise.reject(normalizeError(error));
        },
    );
};
