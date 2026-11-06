
import { authSession } from "@/services/auth/auth-session";
import { paymentSession } from "@/services/payments/payment-session";
import { useAuthStore } from "@/store/auth-store";

export const authService = {
  async logout(): Promise<void> {
    // Immediately remove authenticated access from the app UI.
    useAuthStore.getState().clearAuth();

    // Attempt to clear all locally stored credentials.
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
