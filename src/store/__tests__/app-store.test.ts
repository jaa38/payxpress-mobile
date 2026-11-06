
jest.mock("@/services/storage/mmkv-storage", () => ({
  mmkvStorage: {
    getString: jest.fn(() => undefined),
    set: jest.fn(),
    remove: jest.fn(),
  },
}));

import { useAppStore } from "@/store/app-store";

describe("useAppStore", () => {
  beforeEach(() => {
    useAppStore.setState({
      themeMode: "system",
    });
  });

  it("defaults to system theme mode", () => {
    expect(useAppStore.getState().themeMode).toBe("system");
  });

  it("updates the theme mode", () => {
    useAppStore.getState().setThemeMode("dark");

    expect(useAppStore.getState().themeMode).toBe("dark");
  });

  it("supports switching back to system theme mode", () => {
    useAppStore.getState().setThemeMode("dark");
    useAppStore.getState().setThemeMode("system");

    expect(useAppStore.getState().themeMode).toBe("system");
  });
});
