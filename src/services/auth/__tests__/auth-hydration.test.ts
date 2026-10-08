import { authSession } from "@/services/auth/auth-session";
import { hydrateAuth } from "@/services/auth/auth-hydration";
import { useAuthStore } from "@/store/auth-store";

jest.mock("@/services/auth/auth-session", () => ({
  authSession: {
    getSession: jest.fn(),
  },
}));

const mockedAuthSession = authSession as jest.Mocked<typeof authSession>;

describe("hydrateAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isHydrating: true,
    });
  });

  it("clears auth and finishes hydration when no session exists", async () => {
    mockedAuthSession.getSession.mockResolvedValue(null);

    await hydrateAuth();

    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isHydrating).toBe(false);
  });

  it("finishes hydration when a session exists", async () => {
    mockedAuthSession.getSession.mockResolvedValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    await hydrateAuth();

    const state = useAuthStore.getState();

    expect(state.isHydrating).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it("finishes hydration even when session loading fails", async () => {
    mockedAuthSession.getSession.mockRejectedValue(
      new Error("Secure storage unavailable"),
    );

    await expect(hydrateAuth()).rejects.toThrow(
      "Secure storage unavailable",
    );

    expect(useAuthStore.getState().isHydrating).toBe(false);
  });
});
