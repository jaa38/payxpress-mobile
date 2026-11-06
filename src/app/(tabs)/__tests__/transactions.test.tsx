
import { render, screen } from "@testing-library/react-native";

import TransactionsScreen from "../transactions";

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

describe("TransactionsScreen", () => {
    it("renders the Transactions heading", () => {
        render(<TransactionsScreen />);

        expect(screen.getByText("Transactions")).toBeTruthy();
    });

    it("renders the transaction history description", () => {
        render(<TransactionsScreen />);

        expect(
            screen.getByText(
                "Transaction history will be built in a later sprint.",
            ),
        ).toBeTruthy();
    });

    it("renders the heading with the h1 variant", () => {
        render(<TransactionsScreen />);

        expect(
            screen.getByLabelText("h1-default"),
        ).toBeTruthy();
    });

    it("renders the description with the body variant", () => {
        render(<TransactionsScreen />);

        expect(
            screen.getByLabelText("body-secondary"),
        ).toBeTruthy();
    });

    it("renders the content inside a SafeAreaView", () => {
        render(<TransactionsScreen />);

        expect(screen.getByText("Transactions")).toBeTruthy();
    });

    it("renders the heading and description together", () => {
        render(<TransactionsScreen />);

        expect(screen.getByText("Transactions")).toBeTruthy();

        expect(
            screen.getByText(
                "Transaction history will be built in a later sprint.",
            ),
        ).toBeTruthy();
    });
});
