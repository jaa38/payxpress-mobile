
import { authService } from "@/services/auth/auth-service";
import { authSession } from "@/services/auth/auth-session";
import { paymentSession } from "@/services/payments/payment-session";
import { useAuthStore } from "@/store/auth-store";

jest.mock("@/services/auth/auth-session", () => ({
  authSession: {
    clearSession: jest.fn(),
  },
}));

jest.mock("@/services/payments/payment-session", () => ({
  paymentSession: {
    clearPaymentToken: jest.fn(),
  },
}));

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (authSession.clearSession as jest.Mock).mockResolvedValue(undefined);
    (paymentSession.clearPaymentToken as jest.Mock).mockResolvedValue(
      undefined,
    );

    useAuthStore.setState({
      user: {
        id: "user-1",
        email: "test@example.com",
        tagName: "testuser",
      },
      isAuthenticated: true,
      isHydrating: false,
    });
  });

  it("clears the auth session, payment token and authentication state", async () => {
    await authService.logout();

    expect(authSession.clearSession).toHaveBeenCalledTimes(1);
    expect(paymentSession.clearPaymentToken).toHaveBeenCalledTimes(1);

    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isAuthenticated: false,
      isHydrating: false,
    });
  });

  it("clears authentication state when session cleanup fails", async () => {
    (authSession.clearSession as jest.Mock).mockRejectedValueOnce(
      new Error("Secure storage failure"),
    );

    await expect(authService.logout()).rejects.toThrow(
      "Secure storage failure",
    );

    expect(paymentSession.clearPaymentToken).toHaveBeenCalledTimes(1);

    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isAuthenticated: false,
      isHydrating: false,
    });
  });

  it("clears authentication state when payment token cleanup fails", async () => {
    (paymentSession.clearPaymentToken as jest.Mock).mockRejectedValueOnce(
      new Error("Payment token cleanup failure"),
    );

    await expect(authService.logout()).rejects.toThrow(
      "Payment token cleanup failure",
    );

    expect(authSession.clearSession).toHaveBeenCalledTimes(1);

    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isAuthenticated: false,
      isHydrating: false,
    });
  });

  it("attempts both cleanup operations if both fail", async () => {
    (authSession.clearSession as jest.Mock).mockRejectedValueOnce(
      new Error("Session cleanup failure"),
    );

    (paymentSession.clearPaymentToken as jest.Mock).mockRejectedValueOnce(
      new Error("Payment cleanup failure"),
    );

    await expect(authService.logout()).rejects.toThrow(
      "Session cleanup failure",
    );

    expect(authSession.clearSession).toHaveBeenCalledTimes(1);
    expect(paymentSession.clearPaymentToken).toHaveBeenCalledTimes(1);

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
