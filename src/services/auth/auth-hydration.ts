
import { authSession } from "@/services/auth/auth-session";
import { useAuthStore } from "@/store/auth-store";

export async function hydrateAuth(): Promise<void> {
  try {
    const session = await authSession.getSession();

    if (!session) {
      useAuthStore.getState().clearAuth();
      return;
    }

    /*
     * A local session exists, but we haven't confirmed
     * whether the access token is still valid.
     *
     * Session restoration will be implemented once the
     * backend refresh-token and user-profile contracts
     * have been confirmed.
     */
  } catch (error) {
    // Fail safely: treat an unreadable session as unauthenticated.
    useAuthStore.getState().clearAuth();
  } finally {
    useAuthStore.getState().setHydrating(false);
  }
}
