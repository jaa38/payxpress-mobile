import { STORAGE_KEYS } from "@/constants/storage";
import { secureStorage } from "@/services/storage/secure-storage";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
}

async function removeStoredTokens(): Promise<void> {
  const results = await Promise.allSettled([
    secureStorage.removeItem(STORAGE_KEYS.accessToken),
    secureStorage.removeItem(STORAGE_KEYS.refreshToken),
  ]);

  const failure = results.find(
    (result): result is PromiseRejectedResult =>
      result.status === "rejected",
  );

  if (failure) {
    throw failure.reason;
  }
}

export const authSession = {
  /**
   * Retrieves the stored authentication session.
   *
   * A session is valid locally only when both tokens exist.
   * This does not confirm that the tokens are still valid
   * with the backend.
   */
  async getSession(): Promise<AuthSession | null> {
    const [accessToken, refreshToken] = await Promise.all([
      secureStorage.getItem(STORAGE_KEYS.accessToken),
      secureStorage.getItem(STORAGE_KEYS.refreshToken),
    ]);

    if (!accessToken || !refreshToken) {
      // Remove incomplete credentials so they cannot be reused.
      await Promise.allSettled([
        secureStorage.removeItem(STORAGE_KEYS.accessToken),
        secureStorage.removeItem(STORAGE_KEYS.refreshToken),
      ]);

      return null;
    }

    return {
      accessToken,
      refreshToken,
    };
  },

  /**
   * Saves both authentication tokens.
   *
   * If either write fails, both stored tokens are removed
   * to avoid leaving a partially saved session.
   */
  async saveSession(session: AuthSession): Promise<void> {
    const accessToken = session.accessToken.trim();
    const refreshToken = session.refreshToken.trim();

    if (!accessToken || !refreshToken) {
      throw new Error("Both authentication tokens are required.");
    }

    const results = await Promise.allSettled([
      secureStorage.setItem(
        STORAGE_KEYS.accessToken,
        accessToken,
      ),
      secureStorage.setItem(
        STORAGE_KEYS.refreshToken,
        refreshToken,
      ),
    ]);

    const failure = results.find(
      (result): result is PromiseRejectedResult =>
        result.status === "rejected",
    );

    if (failure) {
      await Promise.allSettled([
        secureStorage.removeItem(STORAGE_KEYS.accessToken),
        secureStorage.removeItem(STORAGE_KEYS.refreshToken),
      ]);

      throw failure.reason;
    }
  },

  /**
   * Removes both authentication tokens.
   */
  async clearSession(): Promise<void> {
    await removeStoredTokens();
  },
};