import { useAuthStore } from "@/store/auth-store";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isHydrating: true,
    });
  });

  it("starts unauthenticated", () => {
    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isHydrating).toBe(true);
  });

  it("sets an authenticated user", () => {
    const user = {
      id: "user-123",
      email: "test@example.com",
      tagName: "testuser",
    };

    useAuthStore.getState().setUser(user);

    const state = useAuthStore.getState();

    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
  });

  it("clears authentication", () => {
    const user = {
      id: "user-123",
      email: "test@example.com",
      tagName: "testuser",
    };

    useAuthStore.getState().setUser(user);
    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("updates hydration state", () => {
    useAuthStore.getState().setHydrating(false);

    expect(useAuthStore.getState().isHydrating).toBe(false);
  });
});
