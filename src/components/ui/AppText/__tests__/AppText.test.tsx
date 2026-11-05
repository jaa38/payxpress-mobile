import { render } from "@testing-library/react-native";

import { AppText } from "@/components/ui/AppText";

jest.mock("@/hooks/use-theme", () => ({
  useTheme: () => ({
    theme: {
      text: {
        primary: "#111827",
        heading: "#1F2937",
        strong: "#374151",
        secondary: "#4B5563",
        label: "#666E7A",
        muted: "#6B7280",
        placeholder: "#9CA3AF",
        inverse: "#FFFFFF",
        brand: "#006F01",
        accent: "#FF6D00",
        success: "#16A34A",
        error: "#DC2626",
        warning: "#D97706",
        info: "#2563EB",
        link: "#FF6D00",
      },
    },
    themeMode: "light",
    resolvedTheme: "light",
    setThemeMode: jest.fn(),
    isDark: false,
  }),
}));

describe("AppText", () => {
  it("renders text correctly", () => {
    const { getByText } = render(
      <AppText>Welcome to PayXpress</AppText>,
    );

    expect(getByText("Welcome to PayXpress")).toBeTruthy();
  });

  it("renders the supplied variant", () => {
    const { getByText } = render(
      <AppText variant="h1">PayXpress</AppText>,
    );

    expect(getByText("PayXpress")).toBeTruthy();
  });

  it("renders children correctly", () => {
    const { getByText } = render(
      <AppText>
        Make payments quickly and securely.
      </AppText>,
    );

    expect(
      getByText("Make payments quickly and securely."),
    ).toBeTruthy();
  });

  it("uses Inter Regular for regular body text", () => {
    const { getByText } = render(
      <AppText>Regular text</AppText>,
    );

    expect(getByText("Regular text")).toHaveStyle({
      fontFamily: "Inter-Regular",
    });
  });

  it("uses Inter SemiBold for heading text", () => {
    const { getByText } = render(
      <AppText variant="h1">Heading</AppText>,
    );

    expect(getByText("Heading")).toHaveStyle({
      fontFamily: "Inter-SemiBold",
    });
  });

  it("uses Inter Medium for labels", () => {
    const { getByText } = render(
      <AppText variant="label">Label</AppText>,
    );

    expect(getByText("Label")).toHaveStyle({
      fontFamily: "Inter-Medium",
    });
  });

  it("uses Inter Bold for display text", () => {
    const { getByText } = render(
      <AppText variant="displayLarge">Display</AppText>,
    );

    expect(getByText("Display")).toHaveStyle({
      fontFamily: "Inter-Bold",
    });
  });
});