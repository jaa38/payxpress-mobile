import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  async getItem(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  },

  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};