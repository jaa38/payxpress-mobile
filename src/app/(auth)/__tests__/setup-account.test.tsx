
import {
    fireEvent,
    render,
    screen,
} from "@testing-library/react-native";
import React from "react";

import SetupAccountScreen from "../register/setup-account";

const mockRouterBack = jest.fn();
const mockRouterPush = jest.fn();

jest.mock("expo-router", () => ({
    router: {
        back: (...args: unknown[]) => mockRouterBack(...args),
        push: (...args: unknown[]) => mockRouterPush(...args),
    },
}));

jest.mock("@/hooks/use-theme", () => ({
    useTheme: () => ({
        theme: {
            background: {
                surface: "#FFFFFF",
            },
            icon: {
                primary: "#000000",
            },
        },
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

describe("SetupAccountScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const fillValidForm = () => {
        fireEvent.changeText(
            screen.getByLabelText("Email Address"),
            "test@example.com",
        );

        fireEvent.changeText(
            screen.getByLabelText("Tag Name"),
            "jeremiah",
        );
    };

    describe("Rendering", () => {
        it("renders the account setup heading", () => {
            render(<SetupAccountScreen />);

            expect(
                screen.getByText("Setup your Account"),
            ).toBeTruthy();
        });

        it("renders the account setup description", () => {
            render(<SetupAccountScreen />);

            expect(
                screen.getByText(
                    "Enter your details to set up your PayXpress account.",
                ),
            ).toBeTruthy();
        });

        it("renders all three input fields", () => {
            render(<SetupAccountScreen />);

            expect(
                screen.getByLabelText("Email Address"),
            ).toBeTruthy();

            expect(
                screen.getByLabelText("Tag Name"),
            ).toBeTruthy();

            expect(
                screen.getByLabelText("Referral Code"),
            ).toBeTruthy();
        });

        it("renders the email placeholder", () => {
            render(<SetupAccountScreen />);

            expect(
                screen.getByPlaceholderText(
                    "Enter your email address",
                ),
            ).toBeTruthy();
        });

        it("renders the tag name placeholder", () => {
            render(<SetupAccountScreen />);

            expect(
                screen.getByPlaceholderText(
                    "Enter your tag name",
                ),
            ).toBeTruthy();
        });

        it("renders the referral code placeholder", () => {
            render(<SetupAccountScreen />);

            expect(
                screen.getByPlaceholderText(
                    "Enter referral code",
                ),
            ).toBeTruthy();
        });

        it("configures the email input for email addresses", () => {
            render(<SetupAccountScreen />);

            expect(
                screen.getByLabelText("Email Address").props.keyboardType,
            ).toBe("email-address");
        });

        it("disables email auto-capitalisation and autocorrect", () => {
            render(<SetupAccountScreen />);

            const emailInput = screen.getByLabelText("Email Address");

            expect(emailInput.props.autoCapitalize).toBe("none");
            expect(emailInput.props.autoCorrect).toBe(false);
        });

        it("disables autocorrect on the tag name input", () => {
            render(<SetupAccountScreen />);

            expect(
                screen.getByLabelText("Tag Name").props.autoCorrect,
            ).toBe(false);
        });

        it("configures the referral code input for uppercase characters", () => {
            render(<SetupAccountScreen />);

            expect(
                screen.getByLabelText("Referral Code").props.autoCapitalize,
            ).toBe("characters");
        });

        it("renders the Continue button", () => {
            render(<SetupAccountScreen />);

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeTruthy();
        });

        it("renders the CBN licensing logo", () => {
            render(<SetupAccountScreen />);

            expect(
                screen.getByLabelText("Central Bank of Nigeria"),
            ).toBeTruthy();
        });
    });

    describe("Form validation", () => {
        it("disables Continue when all fields are empty", () => {
            render(<SetupAccountScreen />);

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeDisabled();
        });

        it("keeps Continue disabled when the email is invalid", () => {
            render(<SetupAccountScreen />);

            fireEvent.changeText(
                screen.getByLabelText("Email Address"),
                "invalid-email",
            );

            fireEvent.changeText(
                screen.getByLabelText("Tag Name"),
                "jeremiah",
            );

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeDisabled();
        });

        it("keeps Continue disabled when the tag name is empty", () => {
            render(<SetupAccountScreen />);

            fireEvent.changeText(
                screen.getByLabelText("Email Address"),
                "test@example.com",
            );

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeDisabled();
        });

        it("keeps Continue disabled when the tag name contains only whitespace", () => {
            render(<SetupAccountScreen />);

            fireEvent.changeText(
                screen.getByLabelText("Email Address"),
                "test@example.com",
            );

            fireEvent.changeText(
                screen.getByLabelText("Tag Name"),
                "   ",
            );

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeDisabled();
        });

        it("enables Continue when email and tag name are valid", () => {
            render(<SetupAccountScreen />);

            fillValidForm();

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeEnabled();
        });

        it("allows Continue without a referral code", () => {
            render(<SetupAccountScreen />);

            fillValidForm();

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeEnabled();
        });

        it("allows an email address with surrounding whitespace", () => {
            render(<SetupAccountScreen />);

            fireEvent.changeText(
                screen.getByLabelText("Email Address"),
                " test@example.com ",
            );

            fireEvent.changeText(
                screen.getByLabelText("Tag Name"),
                "jeremiah",
            );

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeEnabled();
        });

        it("allows a referral code alongside valid required fields", () => {
            render(<SetupAccountScreen />);

            fillValidForm();

            fireEvent.changeText(
                screen.getByLabelText("Referral Code"),
                "XPRESS123",
            );

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeEnabled();
        });
    });

    describe("Error handling", () => {
        it("does not display an error when the form is initially empty", () => {
            render(<SetupAccountScreen />);

            expect(
                screen.queryByText("Enter your email address."),
            ).toBeNull();
        });

        it("does not display an error for valid form data", () => {
            render(<SetupAccountScreen />);

            fillValidForm();

            expect(
                screen.queryByText("Enter a valid email address."),
            ).toBeNull();

            expect(
                screen.queryByText("Enter your tag name."),
            ).toBeNull();
        });

        it("clears an error when the email field changes", () => {
            render(<SetupAccountScreen />);

            fireEvent.changeText(
                screen.getByLabelText("Email Address"),
                "test@example.com",
            );

            fireEvent.changeText(
                screen.getByLabelText("Tag Name"),
                "jeremiah",
            );

            fireEvent.changeText(
                screen.getByLabelText("Email Address"),
                "new@example.com",
            );

            expect(
                screen.queryByText("Enter your email address."),
            ).toBeNull();
        });
    });

    describe("Navigation", () => {
        it("navigates back when the back button is pressed", () => {
            render(<SetupAccountScreen />);

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Go back",
                }),
            );

            expect(mockRouterBack).toHaveBeenCalledTimes(1);
        });

        it("navigates to email verification with valid account details", () => {
            render(<SetupAccountScreen />);

            fillValidForm();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            );

            expect(mockRouterPush).toHaveBeenCalledWith(
                "/register/verify-email",
            );
        });

        it("does not navigate when the form is invalid", () => {
            render(<SetupAccountScreen />);

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeDisabled();

            expect(mockRouterPush).not.toHaveBeenCalled();
        });
    });
});
