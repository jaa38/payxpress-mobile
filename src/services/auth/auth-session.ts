import { STORAGE_KEYS } from "@/constants/storage";
import { secureStorage } from "@/services/storage/secure-storage";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
}

export const authSession = {
  async getSession(): Promise<AuthSession | null> {
    const [accessToken, refreshToken] = await Promise.all([
      secureStorage.getItem(STORAGE_KEYS.accessToken),
      secureStorage.getItem(STORAGE_KEYS.refreshToken),
    ]);

    if (!accessToken || !refreshToken) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
    };
  },

  async saveSession(session: AuthSession): Promise<void> {
    await Promise.all([
      secureStorage.setItem(
        STORAGE_KEYS.accessToken,
        session.accessToken,
      ),
      secureStorage.setItem(
        STORAGE_KEYS.refreshToken,
        session.refreshToken,
      ),
    ]);
  },

  async clearSession(): Promise<void> {
    await Promise.all([
      secureStorage.removeItem(STORAGE_KEYS.accessToken),
      secureStorage.removeItem(STORAGE_KEYS.refreshToken),
    ]);
  },
};
