
import {
    fireEvent,
    render,
    screen,
} from "@testing-library/react-native";
import React from "react";

import RegisterScreen from "../register";

const mockRouterBack = jest.fn();
const mockRouterPush = jest.fn();

jest.mock("expo-router", () => ({
    router: {
        back: (...args: unknown[]) => mockRouterBack(...args),
        push: (...args: unknown[]) => mockRouterPush(...args),
    },
}));

jest.mock("expo-status-bar", () => ({
    StatusBar: () => null,
}));

jest.mock("@/hooks/use-theme", () => ({
    useTheme: () => ({
        theme: {
            background: {
                surface: "#FFFFFF",
            },
            icon: {
                primary: "#000000",
                secondary: "#666666",
                success: "#008000",
            },
            action: {
                primary: {
                    background: "#008000",
                },
            },
        },
        isDark: false,
    }),
}));

jest.mock("@expo/vector-icons", () => {
    const React = require("react");
    const { Text } = require("react-native");

    return {
        Ionicons: ({ name }: { name: string }) =>
            React.createElement(Text, null, name),
    };
});

jest.mock("@/components/ui/AppText", () => {
    const React = require("react");
    const { Text } = require("react-native");

    return {
        AppText: ({
            children,
            ...props
        }: {
            children: React.ReactNode;
            [key: string]: unknown;
        }) => React.createElement(Text, props, children),
    };
});

jest.mock("@/components/ui/Input", () => {
    const React = require("react");
    const {
        Text,
        TextInput,
        View,
    } = require("react-native");

    return {
        Input: ({
            label,
            error,
            ...props
        }: {
            label?: string;
            error?: string;
            [key: string]: unknown;
        }) =>
            React.createElement(
                View,
                null,
                label
                    ? React.createElement(Text, null, label)
                    : null,
                React.createElement(TextInput, {
                    ...props,
                    accessibilityLabel: label,
                }),
                error
                    ? React.createElement(Text, null, error)
                    : null,
            ),
    };
});

jest.mock("@/components/ui/Button", () => {
    const React = require("react");
    const {
        ActivityIndicator,
        Pressable,
        Text,
    } = require("react-native");

    return {
        Button: ({
            title,
            onPress,
            disabled,
            loading,
        }: {
            title: string;
            onPress?: () => void;
            disabled?: boolean;
            loading?: boolean;
        }) =>
            React.createElement(
                Pressable,
                {
                    accessibilityRole: "button",
                    accessibilityLabel: loading
                        ? `${title} loading`
                        : title,
                    accessibilityState: {
                        disabled: Boolean(disabled || loading),
                        busy: Boolean(loading),
                    },
                    disabled: Boolean(disabled || loading),
                    onPress,
                },
                loading
                    ? React.createElement(ActivityIndicator)
                    : React.createElement(Text, null, title),
            ),
    };
});

describe("RegisterScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("renders the ID Verification heading", () => {
            render(<RegisterScreen />);

            expect(
                screen.getByText("ID Verification"),
            ).toBeTruthy();
        });

        it("renders the BVN verification description", () => {
            render(<RegisterScreen />);

            expect(
                screen.getByText(
                    "Enter your BVN to verify your account opening application.",
                ),
            ).toBeTruthy();
        });

        it("renders the BVN input", () => {
            render(<RegisterScreen />);

            expect(
                screen.getByLabelText("BVN"),
            ).toBeTruthy();
        });

        it("renders the BVN input placeholder", () => {
            render(<RegisterScreen />);

            expect(
                screen.getByPlaceholderText(
                    "Enter your 11-digit BVN",
                ),
            ).toBeTruthy();
        });

        it("configures the BVN input for numeric entry", () => {
            render(<RegisterScreen />);

            expect(
                screen.getByLabelText("BVN").props.keyboardType,
            ).toBe("number-pad");
        });

        it("limits the BVN input to 11 characters", () => {
            render(<RegisterScreen />);

            expect(
                screen.getByLabelText("BVN").props.maxLength,
            ).toBe(11);
        });

        it("renders the BVN assistance section", () => {
            render(<RegisterScreen />);

            expect(
                screen.getByText("Forgot BVN?"),
            ).toBeTruthy();

            expect(
                screen.getByRole("button", {
                    name: "Find your BVN",
                }),
            ).toBeTruthy();
        });

        it("renders the security information", () => {
            render(<RegisterScreen />);

            expect(
                screen.getByText(/In line with the latest regulatory requirement from the CBN/),
            ).toBeTruthy();
        });

        it("renders the CBN licensing logo", () => {
            render(<RegisterScreen />);

            expect(
                screen.getByLabelText("Central Bank of Nigeria"),
            ).toBeTruthy();
        });

        it("renders the CBN licensing statement", () => {
            render(<RegisterScreen />);

            expect(
                screen.getByText(/Licensed by the/),
            ).toBeTruthy();
        });

        it("renders the Next button", () => {
            render(<RegisterScreen />);

            expect(
                screen.getByRole("button", { name: "Next" }),
            ).toBeTruthy();
        });
    });

    describe("BVN validation", () => {
        it("disables Next when the BVN is empty", () => {
            render(<RegisterScreen />);

            expect(
                screen.getByRole("button", { name: "Next" }),
            ).toBeDisabled();
        });

        it("keeps Next disabled when the BVN has fewer than 11 digits", () => {
            render(<RegisterScreen />);

            fireEvent.changeText(
                screen.getByLabelText("BVN"),
                "1234567890",
            );

            expect(
                screen.getByRole("button", { name: "Next" }),
            ).toBeDisabled();
        });

        it("enables Next when the BVN contains exactly 11 digits", () => {
            render(<RegisterScreen />);

            fireEvent.changeText(
                screen.getByLabelText("BVN"),
                "12345678901",
            );

            expect(
                screen.getByRole("button", { name: "Next" }),
            ).toBeEnabled();
        });

        it("keeps Next disabled when the BVN contains non-numeric characters", () => {
            render(<RegisterScreen />);

            fireEvent.changeText(
                screen.getByLabelText("BVN"),
                "12345ABC901",
            );

            expect(
                screen.getByRole("button", { name: "Next" }),
            ).toBeDisabled();
        });

        it("keeps Next disabled when the BVN has more than 11 digits", () => {
            render(<RegisterScreen />);

            fireEvent.changeText(
                screen.getByLabelText("BVN"),
                "123456789012",
            );

            expect(
                screen.getByRole("button", { name: "Next" }),
            ).toBeDisabled();
        });
    });

    describe("Navigation", () => {
        it("navigates back when the back button is pressed", () => {
            render(<RegisterScreen />);

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Go back",
                }),
            );

            expect(mockRouterBack).toHaveBeenCalledTimes(1);
        });

        it("navigates to BVN confirmation when Next is pressed with a valid BVN", () => {
            render(<RegisterScreen />);

            fireEvent.changeText(
                screen.getByLabelText("BVN"),
                "12345678901",
            );

            fireEvent.press(
                screen.getByRole("button", { name: "Next" }),
            );

            expect(mockRouterPush).toHaveBeenCalledWith(
                "/register/bvn-confirmation",
            );
        });

        it("does not navigate when Next is pressed with an invalid BVN", () => {
            render(<RegisterScreen />);

            fireEvent.press(
                screen.getByRole("button", { name: "Next" }),
            );

            expect(mockRouterPush).not.toHaveBeenCalled();
        });
    });
});
