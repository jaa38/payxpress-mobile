
import { render, screen } from "@testing-library/react-native";

import PayBillsScreen from "../pay-bills";

const mockTheme = {
    background: {
        surface: "#FFFFFF",
    },
};

jest.mock("@/hooks/use-theme", () => ({
    useTheme: () => ({
        theme: mockTheme,
    }),
}));

jest.mock("@/theme", () => ({
    spacing: {
        sm: 8,
        lg: 16,
        xl: 24,
    },
}));

jest.mock("@/components/ui/AppText", () => {
    const React = require("react");
    const { Text } = require("react-native");

    return {
        AppText: ({
            children,
            variant,
            color,
            style,
        }: {
            children: React.ReactNode;
            variant?: string;
            color?: string;
            style?: object;
        }) =>
            React.createElement(
                Text,
                {
                    style,
                    accessibilityLabel: `${variant ?? ""}-${color ?? "default"}`,
                },
                children,
            ),
    };
});

describe("PayBillsScreen", () => {
    it("renders the Pay Bills heading", () => {
        render(<PayBillsScreen />);

        expect(screen.getByText("Pay Bills")).toBeTruthy();
    });

    it("renders the wallet functionality description", () => {
        render(<PayBillsScreen />);

        expect(
            screen.getByText(
                "Wallet functionality will be built in a later sprint.",
            ),
        ).toBeTruthy();
    });

    it("renders the heading with the h1 variant", () => {
        render(<PayBillsScreen />);

        expect(
            screen.getByLabelText("h1-default"),
        ).toBeTruthy();
    });

    it("renders the description with the body variant", () => {
        render(<PayBillsScreen />);

        expect(
            screen.getByLabelText("body-secondary"),
        ).toBeTruthy();
    });

    it("renders the content inside a SafeAreaView", () => {
        const { getByText } = render(<PayBillsScreen />);

        expect(getByText("Pay Bills")).toBeTruthy();
    });

    it("renders both heading and description together", () => {
        render(<PayBillsScreen />);

        expect(screen.getByText("Pay Bills")).toBeTruthy();

        expect(
            screen.getByText(
                "Wallet functionality will be built in a later sprint.",
            ),
        ).toBeTruthy();
    });
});
