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
     * At this stage we only know that a valid-looking local
     * session exists.
     *
     * The authenticated user profile will be restored from
     * the API once the authentication endpoints are available.
     */
  } finally {
    useAuthStore.getState().setHydrating(false);
  }
}
