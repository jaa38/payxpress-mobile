import { useAppStore } from "@/store/app-store";

describe("useAppStore", () => {
  beforeEach(() => {
    useAppStore.setState({
      isHydrated: false,
    });
  });

  it("starts with isHydrated set to false", () => {
    expect(useAppStore.getState().isHydrated).toBe(false);
  });

  it("updates isHydrated", () => {
    useAppStore.getState().setHydrated(true);

    expect(useAppStore.getState().isHydrated).toBe(true);
  });

  it("can reset hydration state", () => {
    useAppStore.getState().setHydrated(true);
    useAppStore.getState().setHydrated(false);

    expect(useAppStore.getState().isHydrated).toBe(false);
  });
});
