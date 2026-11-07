
import { authApi } from "@/services/auth/auth-api";
import { authSession } from "@/services/auth/auth-session";
import { paymentSession } from "@/services/payments/payment-session";
import type {
  AuthApiResponse,
  AuthRequestPayload,
} from "@/services/auth/auth-types";
import { useAuthStore } from "@/store/auth-store";

export const authService = {
  /**
   * Register a new PayXpress user.
   *
   * Returns the backend response without assuming
   * a particular response or token structure.
   */
  async register(
    payload: AuthRequestPayload,
  ): Promise<AuthApiResponse> {
    return authApi.register(payload);
  },

  /**
   * Authenticate an existing PayXpress user.
   *
   * Token extraction and session establishment will
   * be added after the backend response contract is confirmed.
   */
  async login(
    payload: AuthRequestPayload,
  ): Promise<AuthApiResponse> {
    return authApi.login(payload);
  },

  /**
   * Retrieve the locally stored authentication session.
   */
  async getSession() {
    return authSession.getSession();
  },

  /**
   * Save an authenticated session securely.
   */
  async saveSession(
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    if (!accessToken.trim() || !refreshToken.trim()) {
      throw new Error("Valid authentication tokens are required.");
    }

    await authSession.saveSession({
      accessToken,
      refreshToken,
    });
  },

  /**
   * Log out the current user.
   *
   * Authentication state is cleared immediately.
   * All local credentials are then removed.
   */
  async logout(): Promise<void> {
    useAuthStore.getState().clearAuth();

    const results = await Promise.allSettled([
      authSession.clearSession(),
      paymentSession.clearPaymentToken(),
    ]);

    const failure = results.find(
      (result): result is PromiseRejectedResult =>
        result.status === "rejected",
    );

    if (failure) {
      throw failure.reason;
    }
  },
};
