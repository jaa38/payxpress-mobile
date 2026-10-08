import { authSession } from "@/services/auth/auth-session";
import { useAuthStore } from "@/store/auth-store";

export const authService = {
  async logout(): Promise<void> {
    await authSession.clearSession();
    useAuthStore.getState().clearAuth();
  },
};
