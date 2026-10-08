import { authService } from "@/services/auth/auth-service";
import { authSession } from "@/services/auth/auth-session";
import { useAuthStore } from "@/store/auth-store";

jest.mock("@/services/auth/auth-session", () => ({
  authSession: {
    clearSession: jest.fn(),
  },
}));

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

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

  it("clears the session and authentication state on logout", async () => {
    await authService.logout();

    expect(authSession.clearSession).toHaveBeenCalledTimes(1);

    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isAuthenticated: false,
      isHydrating: false,
    });
  });

  it("does not clear auth state when session clearing fails", async () => {
    (authSession.clearSession as jest.Mock).mockRejectedValueOnce(
      new Error("Secure storage failure"),
    );

    await expect(authService.logout()).rejects.toThrow(
      "Secure storage failure",
    );

    expect(useAuthStore.getState()).toMatchObject({
      user: {
        id: "user-1",
        email: "test@example.com",
        tagName: "testuser",
      },
      isAuthenticated: true,
      isHydrating: false,
    });
  });
});
