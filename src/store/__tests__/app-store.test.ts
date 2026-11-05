jest.mock('@/services/storage/mmkv-storage', () => ({
  mmkvStorage: {
    getString: jest.fn(() => undefined),
    set: jest.fn(),
    remove: jest.fn(),
  },
}));

import { useAppStore } from '@/store/app-store';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      isHydrated: false,
      themeMode: 'system',
    });
  });

  it('starts with isHydrated set to false', () => {
    expect(useAppStore.getState().isHydrated).toBe(false);
  });

  it('updates isHydrated', () => {
    useAppStore.getState().setHydrated(true);

    expect(useAppStore.getState().isHydrated).toBe(true);
  });

  it('can reset hydration state', () => {
    useAppStore.getState().setHydrated(true);
    useAppStore.getState().setHydrated(false);

    expect(useAppStore.getState().isHydrated).toBe(false);
  });

  it('defaults to system theme mode', () => {
    expect(useAppStore.getState().themeMode).toBe('system');
  });

  it('updates the theme mode', () => {
    useAppStore.getState().setThemeMode('dark');

    expect(useAppStore.getState().themeMode).toBe('dark');
  });
});