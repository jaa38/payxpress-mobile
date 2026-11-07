
import {
    fireEvent,
    render,
    screen,
} from "@testing-library/react-native";
import React from "react";

import BVNConfirmationScreen from "../register/bvn-confirmation";

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

describe("BVNConfirmationScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("renders the BVN Confirmation heading", () => {
            render(<BVNConfirmationScreen />);

            expect(
                screen.getByText("BVN Confirmation"),
            ).toBeTruthy();
        });

        it("renders the OTP instructions", () => {
            render(<BVNConfirmationScreen />);

            expect(
                screen.getByText(
                    /A message with an OTP has been sent to your phone number/,
                ),
            ).toBeTruthy();
        });

        it("renders the OTP input", () => {
            render(<BVNConfirmationScreen />);

            expect(
                screen.getByLabelText("OTP"),
            ).toBeTruthy();
        });

        it("configures the OTP input for six digits", () => {
            render(<BVNConfirmationScreen />);

            expect(
                screen.getByLabelText("OTP").props.maxLength,
            ).toBe(6);
        });

        it("renders the Resend OTP action", () => {
            render(<BVNConfirmationScreen />);

            expect(
                screen.getByRole("button", {
                    name: "Resend OTP",
                }),
            ).toBeTruthy();
        });

        it("renders the Verify button", () => {
            render(<BVNConfirmationScreen />);

            expect(
                screen.getByRole("button", {
                    name: "Verify",
                }),
            ).toBeTruthy();
        });

        it("renders the CBN licensing logo", () => {
            render(<BVNConfirmationScreen />);

            expect(
                screen.getByLabelText("Central Bank of Nigeria"),
            ).toBeTruthy();
        });

        it("renders the CBN licensing statement", () => {
            render(<BVNConfirmationScreen />);

            expect(
                screen.getByText(/Licensed by the/),
            ).toBeTruthy();
        });
    });

    describe("OTP validation", () => {
        it("disables Verify when the OTP is empty", () => {
            render(<BVNConfirmationScreen />);

            expect(
                screen.getByRole("button", {
                    name: "Verify",
                }),
            ).toBeDisabled();
        });

        it("keeps Verify disabled when the OTP has fewer than six digits", () => {
            render(<BVNConfirmationScreen />);

            fireEvent.changeText(
                screen.getByLabelText("OTP"),
                "12345",
            );

            expect(
                screen.getByRole("button", {
                    name: "Verify",
                }),
            ).toBeDisabled();
        });

        it("enables Verify when the OTP contains six digits", () => {
            render(<BVNConfirmationScreen />);

            fireEvent.changeText(
                screen.getByLabelText("OTP"),
                "123456",
            );

            expect(
                screen.getByRole("button", {
                    name: "Verify",
                }),
            ).toBeEnabled();
        });

        it("keeps Verify disabled when the OTP contains non-numeric characters", () => {
            render(<BVNConfirmationScreen />);

            fireEvent.changeText(
                screen.getByLabelText("OTP"),
                "12AB56",
            );

            expect(
                screen.getByRole("button", {
                    name: "Verify",
                }),
            ).toBeDisabled();
        });

        it("keeps Verify disabled when the OTP contains more than six digits", () => {
            render(<BVNConfirmationScreen />);

            fireEvent.changeText(
                screen.getByLabelText("OTP"),
                "1234567",
            );

            expect(
                screen.getByRole("button", {
                    name: "Verify",
                }),
            ).toBeDisabled();
        });
    });

    describe("Error handling", () => {
        it("does not display a validation error while Verify is disabled for an incomplete OTP", () => {
            render(<BVNConfirmationScreen />);

            fireEvent.changeText(
                screen.getByLabelText("OTP"),
                "12345",
            );

            expect(
                screen.queryByText(
                    "Enter the 6-digit OTP sent to your phone number.",
                ),
            ).toBeNull();
        });

        it("does not display an incomplete OTP error for a valid six-digit OTP", () => {
            render(<BVNConfirmationScreen />);

            fireEvent.changeText(
                screen.getByLabelText("OTP"),
                "123456",
            );

            expect(
                screen.queryByText(
                    "Enter the 6-digit OTP sent to your phone number.",
                ),
            ).toBeNull();
        });

        it("does not retain an error when the OTP changes", () => {
            render(<BVNConfirmationScreen />);

            fireEvent.changeText(
                screen.getByLabelText("OTP"),
                "123456",
            );

            fireEvent.changeText(
                screen.getByLabelText("OTP"),
                "12345",
            );

            expect(
                screen.queryByText(
                    "Enter the 6-digit OTP sent to your phone number.",
                ),
            ).toBeNull();
        });
    });

    describe("Resend OTP", () => {
        it("clears the entered OTP when Resend OTP is pressed", () => {
            render(<BVNConfirmationScreen />);

            const otpInput = screen.getByLabelText("OTP");

            fireEvent.changeText(otpInput, "123456");

            expect(otpInput.props.value).toBe("123456");

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
            render(<BVNConfirmationScreen />);

            fireEvent.changeText(
                screen.getByLabelText("OTP"),
                "123456",
            );

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
    });

    describe("Navigation", () => {
        it("navigates back when the back button is pressed", () => {
            render(<BVNConfirmationScreen />);

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Go back",
                }),
            );

            expect(mockRouterBack).toHaveBeenCalledTimes(1);
        });

        it("does not navigate to account setup based only on local OTP validation", () => {
            render(<BVNConfirmationScreen />);

            fireEvent.changeText(
                screen.getByLabelText("OTP"),
                "123456",
            );

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Verify",
                }),
            );

            expect(mockRouterPush).not.toHaveBeenCalled();
        });

        it("does not navigate when the OTP has not been verified by the backend", () => {
            render(<BVNConfirmationScreen />);

            fireEvent.changeText(
                screen.getByLabelText("OTP"),
                "123456",
            );

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Verify",
                }),
            );

            expect(mockRouterPush).not.toHaveBeenCalledWith(
                "/register/setup-account",
            );
        });
    });
});
