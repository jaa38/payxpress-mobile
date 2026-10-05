import { render } from "@testing-library/react-native";

import { AppText } from "@/components/ui/AppText";

describe("AppText", () => {
  it("renders text correctly", () => {
    const { getByText } = render(<AppText>Welcome to PayXpress</AppText>);

    expect(getByText("Welcome to PayXpress")).toBeTruthy();
  });

  it("renders the supplied variant", () => {
    const { getByText } = render(<AppText variant="h1">PayXpress</AppText>);

    expect(getByText("PayXpress")).toBeTruthy();
  });

  it("renders children correctly", () => {
    const { getByText } = render(
      <AppText>Make payments quickly and securely.</AppText>,
    );

    expect(getByText("Make payments quickly and securely.")).toBeTruthy();
  });
});
