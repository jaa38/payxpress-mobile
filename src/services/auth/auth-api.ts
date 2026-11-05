
import { coreClient } from "@/lib/http/core-client";
import type {
    AuthApiResponse,
    AuthRequestPayload,
} from "@/services/auth/auth-types";

export const authApi = {
    /**
     * Verify a user's BVN.
     */
    async verifyBvn(bvn: string): Promise<AuthApiResponse> {
        const response = await coreClient.get(
            `/Auth/verify-bvn/${encodeURIComponent(bvn)}`,
        );

        return response.data;
    },

    /**
     * Verify BVN OTP.
     */
    async verifyBvnOtp(
        payload: AuthRequestPayload,
    ): Promise<AuthApiResponse> {
        const response = await coreClient.post(
            "/Auth/verify-otp/bvn",
            payload,
        );

        return response.data;
    },

    /**
     * Generate an OTP.
     *
     * The double slash is retained from the documented API path.
     */
    async generateOtp(
        email: string,
        phone: string,
    ): Promise<AuthApiResponse> {
        const response = await coreClient.get(
            `/Auth/generate-otp//${encodeURIComponent(email)}/${encodeURIComponent(phone)}`,
        );

        return response.data;
    },

    /**
     * Verify OTP.
     */
    async verifyOtp(
        payload: AuthRequestPayload,
        requiresAuth = false,
    ): Promise<AuthApiResponse> {
        const response = await coreClient.post(
            "/Auth/verify-otp",
            payload,
            { requiresAuth },
        );

        return response.data;
    },

    /**
     * Request PIN reset OTP.
     */
    async resetPinOtp(
        payload: AuthRequestPayload,
    ): Promise<AuthApiResponse> {
        const response = await coreClient.post(
            "/Auth/reset-pin-otp",
            payload,
            { requiresAuth: true },
        );

        return response.data;
    },

    /**
     * Request password recovery.
     */
    async forgotPassword(email: string): Promise<AuthApiResponse> {
        const response = await coreClient.post(
            `/Auth/forgot-password/${encodeURIComponent(email)}`,
        );

        return response.data;
    },

    /**
     * Refresh the authentication token.
     *
     * Request and response contracts are not yet confirmed.
     */
    async refreshToken(
        payload: AuthRequestPayload,
    ): Promise<AuthApiResponse> {
        const response = await coreClient.post(
            "/Auth/refresh-token",
            payload,
        );

        return response.data;
    },

    /**
     * Register a user.
     */
    async register(
        payload: AuthRequestPayload,
    ): Promise<AuthApiResponse> {
        const response = await coreClient.post(
            "/Auth/register",
            payload,
        );

        return response.data;
    },

    /**
     * Sign in.
     */
    async login(
        payload: AuthRequestPayload,
    ): Promise<AuthApiResponse> {
        const response = await coreClient.post(
            "/Auth/login",
            payload,
        );

        return response.data;
    },


    /**
     * Change the user's password.
     */
    async changePassword(
        payload: AuthRequestPayload,
    ): Promise<AuthApiResponse> {
        const response = await coreClient.post(
            "/Users/change-password/",
            payload,
            { requiresAuth: true },
        );

        return response.data;
    },

    /**
     * Change the user's wallet PIN.
     */
    async changeWalletPin(
        payload: AuthRequestPayload,
    ): Promise<AuthApiResponse> {
        const response = await coreClient.post(
            "/Wallet/changepin",
            payload,
            { requiresAuth: true },
        );

        return response.data;
    },

    /**
     * Retrieve a user's account information.
     */
    async getUser(userId: string): Promise<AuthApiResponse> {
        const response = await coreClient.get(
            `/Users/getall/${encodeURIComponent(userId)}`,
            { requiresAuth: true },
        );

        return response.data;
    },

};
