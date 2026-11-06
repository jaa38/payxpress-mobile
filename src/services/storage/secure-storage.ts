
import * as SecureStore from "expo-secure-store";

const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED,
};

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(
      key,
      value,
      SECURE_STORE_OPTIONS,
    );
  },

  async getItem(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(
      key,
      SECURE_STORE_OPTIONS,
    );
  },

  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(
      key,
      SECURE_STORE_OPTIONS,
    );
  },
};
