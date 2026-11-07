
import {
    fireEvent,
    render,
    screen,
} from "@testing-library/react-native";
import React from "react";

import VerifyEmailScreen from "../register/verify-email";
import { useRegistrationStore } from "@/store/registration-store";

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

jest.mock("@/components/ui/OTPInput", () => {
    const React = require("react");
    const { TextInput } = require("react-native");

    return {
        OTPInput: ({
            length,
            value,
            onChange,
            onComplete,
        }: {
            length: number;
            value: string;
            onChange: (code: string) => void;
            onComplete: (code: string) => void;
        }) =>
            React.createElement(TextInput, {
                accessibilityLabel: "OTP",
                value,
                maxLength: length,
                keyboardType: "number-pad",
                onChangeText: (code: string) => {
                    onChange(code);

                    if (code.length === length) {
                        onComplete(code);
                    }
                },
            }),
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

describe("VerifyEmailScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Reset registration data between tests.
        useRegistrationStore.getState().clearDraft();
    });

    const enterValidOtp = () => {
        fireEvent.changeText(
            screen.getByLabelText("OTP"),
            "123456",
        );
    };

    describe("Rendering", () => {
        it("renders the email verification heading", () => {
            render(<VerifyEmailScreen />);

            expect(
                screen.getByText("Verify your email"),
            ).toBeTruthy();
        });

        it("renders the email OTP instructions", () => {
            render(<VerifyEmailScreen />);

            expect(
                screen.getByText(
                    "Enter the 6-digit OTP sent to your email address.",
                ),
            ).toBeTruthy();
        });

        it("renders the OTP input", () => {
            render(<VerifyEmailScreen />);

            expect(
                screen.getByLabelText("OTP"),
            ).toBeTruthy();
        });

        it("configures the OTP input for six digits", () => {
            render(<VerifyEmailScreen />);

            expect(
                screen.getByLabelText("OTP").props.maxLength,
            ).toBe(6);
        });

        it("configures the OTP input for numeric entry", () => {
            render(<VerifyEmailScreen />);

            expect(
                screen.getByLabelText("OTP").props.keyboardType,
            ).toBe("number-pad");
        });

        it("renders the Resend OTP action", () => {
            render(<VerifyEmailScreen />);

            expect(
                screen.getByRole("button", {
                    name: "Resend OTP",
                }),
            ).toBeTruthy();
        });

        it("renders the Continue button", () => {
            render(<VerifyEmailScreen />);

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeTruthy();
        });

        it("renders the CBN licensing logo", () => {
            render(<VerifyEmailScreen />);

            expect(
                screen.getByLabelText("Central Bank of Nigeria"),
            ).toBeTruthy();
        });
    });

    describe("Registration store integration", () => {
        it("displays the email address from the registration store", () => {
            useRegistrationStore.getState().updateDraft({
                email: "test@example.com",
            });

            render(<VerifyEmailScreen />);

            expect(
                screen.getByText("test@example.com"),
            ).toBeTruthy();
        });

        it("does not display an email address when none is stored", () => {
            render(<VerifyEmailScreen />);

            expect(
                screen.queryByText("test@example.com"),
            ).toBeNull();
        });
    });

    describe("OTP validation", () => {
        it("disables Continue when the OTP is empty", () => {
            render(<VerifyEmailScreen />);

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeDisabled();
        });

        it("keeps Continue disabled when the OTP has fewer than six digits", () => {
            render(<VerifyEmailScreen />);

            fireEvent.changeText(
                screen.getByLabelText("OTP"),
                "12345",
            );

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeDisabled();
        });

        it("enables Continue when the OTP contains six digits", () => {
            render(<VerifyEmailScreen />);

            enterValidOtp();

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeEnabled();
        });

        it("keeps Continue disabled when the OTP contains non-numeric characters", () => {
            render(<VerifyEmailScreen />);

            fireEvent.changeText(
                screen.getByLabelText("OTP"),
                "12AB56",
            );

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeDisabled();
        });

        it("keeps Continue disabled when the OTP contains more than six digits", () => {
            render(<VerifyEmailScreen />);

            fireEvent.changeText(
                screen.getByLabelText("OTP"),
                "1234567",
            );

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeDisabled();
        });
    });

    describe("Error handling", () => {
        it("does not display an error initially", () => {
            render(<VerifyEmailScreen />);

            expect(
                screen.queryByText(
                    "Email verification is not connected yet. Please try again once verification services are available.",
                ),
            ).toBeNull();
        });

        it("does not display an error when a valid OTP is entered", () => {
            render(<VerifyEmailScreen />);

            enterValidOtp();

            expect(
                screen.queryByText(
                    "Email verification is not connected yet. Please try again once verification services are available.",
                ),
            ).toBeNull();
        });

        it("displays an error when Continue is pressed with an unverified OTP", () => {
            render(<VerifyEmailScreen />);

            enterValidOtp();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            );

            expect(
                screen.getByText(
                    "Email verification is not connected yet. Please try again once verification services are available.",
                ),
            ).toBeTruthy();
        });

        it("clears the error when the OTP changes", () => {
            render(<VerifyEmailScreen />);

            enterValidOtp();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            );

            expect(
                screen.getByText(
                    "Email verification is not connected yet. Please try again once verification services are available.",
                ),
            ).toBeTruthy();

            fireEvent.changeText(
                screen.getByLabelText("OTP"),
                "12345",
            );

            expect(
                screen.queryByText(
                    "Email verification is not connected yet. Please try again once verification services are available.",
                ),
            ).toBeNull();
        });
    });

    describe("Resend OTP", () => {
        it("clears the entered OTP when Resend OTP is pressed", () => {
            render(<VerifyEmailScreen />);

            enterValidOtp();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Resend OTP",
                }),
            );

            expect(
                screen.getByLabelText("OTP").props.value,
            ).toBe("");
        });

        it("allows a new OTP to be entered after resending", () => {
            render(<VerifyEmailScreen />);

            enterValidOtp();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Resend OTP",
                }),
            );

            fireEvent.changeText(
                screen.getByLabelText("OTP"),
                "654321",
            );

            expect(
                screen.getByLabelText("OTP").props.value,
            ).toBe("654321");
        });

        it("clears an existing error when Resend OTP is pressed", () => {
            render(<VerifyEmailScreen />);

            enterValidOtp();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            );

            expect(
                screen.getByText(
                    "Email verification is not connected yet. Please try again once verification services are available.",
                ),
            ).toBeTruthy();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Resend OTP",
                }),
            );

            expect(
                screen.queryByText(
                    "Email verification is not connected yet. Please try again once verification services are available.",
                ),
            ).toBeNull();
        });
    });

    describe("Navigation", () => {
        it("navigates back when the back button is pressed", () => {
            render(<VerifyEmailScreen />);

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Go back",
                }),
            );

            expect(mockRouterBack).toHaveBeenCalledTimes(1);
        });

        it("does not navigate to secure password setup with an unverified OTP", () => {
            render(<VerifyEmailScreen />);

            enterValidOtp();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            );

            expect(mockRouterPush).not.toHaveBeenCalled();
        });

        it("does not navigate when the OTP is incomplete", () => {
            render(<VerifyEmailScreen />);

            fireEvent.changeText(
                screen.getByLabelText("OTP"),
                "12345",
            );

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeDisabled();

            expect(mockRouterPush).not.toHaveBeenCalled();
        });
    });
});
