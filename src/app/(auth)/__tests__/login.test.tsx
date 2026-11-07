
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

import LoginScreen from "../login";

const mockRouterBack = jest.fn();
const mockRouterPush = jest.fn();
const mockAuthenticate = jest.fn();
const mockLogin = jest.fn();
const mockLoggerInfo = jest.fn();
const mockLoggerError = jest.fn();

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
                secondary: "#666666",
            },
        },
    }),
}));

jest.mock("@/services/auth/auth-service", () => ({
    authService: {
        login: (...args: unknown[]) => mockLogin(...args),
    },
}));

jest.mock("@/services/auth/biometric-auth", () => ({
    biometricAuth: {
        authenticate: (...args: unknown[]) =>
            mockAuthenticate(...args),
    },
}));

jest.mock("@/utils/logger", () => ({
    logger: {
        info: (...args: unknown[]) => mockLoggerInfo(...args),
        error: (...args: unknown[]) => mockLoggerError(...args),
    },
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
            rightElement,
            ...props
        }: {
            label?: string;
            error?: string;
            rightElement?: React.ReactNode;
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
                rightElement,
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

describe("LoginScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockAuthenticate.mockResolvedValue({
            success: true,
        });

        mockLogin.mockResolvedValue({});
    });

    const renderScreen = () => render(<LoginScreen />);

    const enterValidCredentials = (
        email = "customer@example.com",
        password = "Password123",
    ) => {
        fireEvent.changeText(
            screen.getByLabelText("Email Address"),
            email,
        );

        fireEvent.changeText(
            screen.getByLabelText("Password"),
            password,
        );
    };

    describe("Rendering", () => {
        it("renders the welcome heading", () => {
            renderScreen();

            expect(
                screen.getByText("Welcome back"),
            ).toBeTruthy();
        });

        it("renders the login description", () => {
            renderScreen();

            expect(
                screen.getByText("Log in to your PayXpress account."),
            ).toBeTruthy();
        });

        it("renders the email and password inputs", () => {
            renderScreen();

            expect(
                screen.getByLabelText("Email Address"),
            ).toBeTruthy();

            expect(
                screen.getByLabelText("Password"),
            ).toBeTruthy();
        });

        it("renders the login and biometric buttons", () => {
            renderScreen();

            expect(
                screen.getByRole("button", {
                    name: "Login",
                }),
            ).toBeTruthy();

            expect(
                screen.getByRole("button", {
                    name: "Sign In with Face ID",
                }),
            ).toBeTruthy();
        });

        it("renders the forgot password action", () => {
            renderScreen();

            expect(
                screen.getByRole("button", {
                    name: "Forgot password",
                }),
            ).toBeTruthy();
        });

        it("renders the registration action", () => {
            renderScreen();

            expect(
                screen.getByRole("button", {
                    name: "Register",
                }),
            ).toBeTruthy();
        });
    });

    describe("Form validation", () => {
        it("disables login when the form is empty", () => {
            renderScreen();

            expect(
                screen.getByRole("button", {
                    name: "Login",
                }),
            ).toBeDisabled();
        });

        it("keeps login disabled when the email is invalid", () => {
            renderScreen();

            fireEvent.changeText(
                screen.getByLabelText("Email Address"),
                "invalid-email",
            );

            fireEvent.changeText(
                screen.getByLabelText("Password"),
                "Password123",
            );

            expect(
                screen.getByRole("button", {
                    name: "Login",
                }),
            ).toBeDisabled();
        });

        it("keeps login disabled when the password is empty", () => {
            renderScreen();

            fireEvent.changeText(
                screen.getByLabelText("Email Address"),
                "customer@example.com",
            );

            expect(
                screen.getByRole("button", {
                    name: "Login",
                }),
            ).toBeDisabled();
        });

        it("enables login when email and password are provided", () => {
            renderScreen();

            enterValidCredentials();

            expect(
                screen.getByRole("button", {
                    name: "Login",
                }),
            ).toBeEnabled();
        });

        it("accepts an email with surrounding whitespace", () => {
            renderScreen();

            enterValidCredentials(
                " customer@example.com ",
                "Password123",
            );

            expect(
                screen.getByRole("button", {
                    name: "Login",
                }),
            ).toBeEnabled();
        });
    });

    describe("Password visibility", () => {
        it("hides the password by default", () => {
            renderScreen();

            expect(
                screen.getByLabelText("Password").props.secureTextEntry,
            ).toBe(true);

            expect(
                screen.getByRole("button", {
                    name: "Show password",
                }),
            ).toBeTruthy();
        });

        it("shows the password when the visibility button is pressed", () => {
            renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Show password",
                }),
            );

            expect(
                screen.getByLabelText("Password").props.secureTextEntry,
            ).toBe(false);

            expect(
                screen.getByRole("button", {
                    name: "Hide password",
                }),
            ).toBeTruthy();
        });

        it("hides the password again when pressed a second time", () => {
            renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Show password",
                }),
            );

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Hide password",
                }),
            );

            expect(
                screen.getByLabelText("Password").props.secureTextEntry,
            ).toBe(true);
        });
    });

    describe("Navigation", () => {
        it("navigates back when the back button is pressed", () => {
            renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Go back",
                }),
            );

            expect(mockRouterBack).toHaveBeenCalledTimes(1);
        });

        it("navigates to registration when Register is pressed", () => {
            renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Register",
                }),
            );

            expect(mockRouterPush).toHaveBeenCalledWith("/register");
        });

        it("navigates to forgot password when Forgot password is pressed", () => {
            renderScreen();

            fireEvent.press(
                screen.getByText("Forgot password?"),
            );

            expect(mockRouterPush).toHaveBeenCalledWith(
                "/forgot-password",
            );
        });
    });

    describe("Biometric authentication", () => {
        it("calls biometric authentication when Face ID is pressed", async () => {
            renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Sign In with Face ID",
                }),
            );

            await waitFor(() => {
                expect(mockAuthenticate).toHaveBeenCalledTimes(1);
            });
        });

        it("shows a success alert when biometric verification succeeds", async () => {
            const alertSpy = jest.spyOn(Alert, "alert");

            mockAuthenticate.mockResolvedValue({
                success: true,
            });

            renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Sign In with Face ID",
                }),
            );

            await waitFor(() => {
                expect(alertSpy).toHaveBeenCalledWith(
                    "Face ID verified",
                    expect.stringContaining(
                        "device identity has been verified",
                    ),
                );
            });

            alertSpy.mockRestore();
        });

        it.each([
            "user_cancel",
            "system_cancel",
            "app_cancel",
        ])(
            "does not show an error alert when biometric authentication is cancelled: %s",
            async (error) => {
                const alertSpy = jest.spyOn(Alert, "alert");

                mockAuthenticate.mockResolvedValue({
                    success: false,
                    error,
                });

                renderScreen();

                fireEvent.press(
                    screen.getByRole("button", {
                        name: "Sign In with Face ID",
                    }),
                );

                await waitFor(() => {
                    expect(mockAuthenticate).toHaveBeenCalledTimes(1);
                });

                expect(alertSpy).not.toHaveBeenCalled();

                alertSpy.mockRestore();
            },
        );

        it("shows an error alert when biometric authentication fails", async () => {
            const alertSpy = jest.spyOn(Alert, "alert");

            mockAuthenticate.mockResolvedValue({
                success: false,
                error: "Authentication failed",
            });

            renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Sign In with Face ID",
                }),
            );

            await waitFor(() => {
                expect(alertSpy).toHaveBeenCalledWith(
                    "Face ID unavailable",
                    "Authentication failed",
                );
            });

            alertSpy.mockRestore();
        });

        it("shows a fallback message when biometric authentication has no error", async () => {
            const alertSpy = jest.spyOn(Alert, "alert");

            mockAuthenticate.mockResolvedValue({
                success: false,
            });

            renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Sign In with Face ID",
                }),
            );

            await waitFor(() => {
                expect(alertSpy).toHaveBeenCalledWith(
                    "Face ID unavailable",
                    expect.stringContaining(
                        "Unable to complete biometric authentication",
                    ),
                );
            });

            alertSpy.mockRestore();
        });

        it("logs an error when biometric authentication throws", async () => {
            const alertSpy = jest.spyOn(Alert, "alert");

            mockAuthenticate.mockRejectedValue(
                new Error("Unexpected biometric error"),
            );

            renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Sign In with Face ID",
                }),
            );

            await waitFor(() => {
                expect(mockLoggerError).toHaveBeenCalledWith(
                    "Biometric authentication failed.",
                );
            });

            expect(alertSpy).toHaveBeenCalledWith(
                "Authentication error",
                "Unable to complete biometric authentication. Please try again.",
            );

            alertSpy.mockRestore();
        });

        it("resets biometric loading after authentication completes", async () => {
            renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Sign In with Face ID",
                }),
            );

            await waitFor(() => {
                expect(
                    screen.getByRole("button", {
                        name: "Sign In with Face ID",
                    }),
                ).toBeEnabled();
            });
        });
    });

    describe("Login action", () => {
        it("calls the authentication service with normalized customer credentials", async () => {
            renderScreen();

            enterValidCredentials(
                " Customer@Example.com ",
                "Password123",
            );

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Login",
                }),
            );

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledWith({
                    email: "customer@example.com",
                    password: "Password123",
                });
            });

            await waitFor(() => {
                expect(
                    screen.getByRole("button", {
                        name: "Login",
                    }),
                ).toBeEnabled();
            });
        });

        it("does not call biometric authentication when normal login is pressed", async () => {
            renderScreen();

            enterValidCredentials();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Login",
                }),
            );

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledTimes(1);
            });

            await waitFor(() => {
                expect(
                    screen.getByRole("button", {
                        name: "Login",
                    }),
                ).toBeEnabled();
            });

            expect(mockAuthenticate).not.toHaveBeenCalled();
        });

        it("does not navigate to the dashboard before authentication is established", async () => {
            renderScreen();

            enterValidCredentials();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Login",
                }),
            );

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledTimes(1);
            });

            expect(mockRouterPush).not.toHaveBeenCalled();
            expect(mockRouterBack).not.toHaveBeenCalled();
        });

        it("displays the login response message after the service responds", async () => {
            const alertSpy = jest.spyOn(Alert, "alert");

            renderScreen();

            enterValidCredentials();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Login",
                }),
            );

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledTimes(1);
                expect(mockLoggerInfo).toHaveBeenCalledWith(
                    "Login API request completed.",
                );
                expect(alertSpy).toHaveBeenCalledWith(
                    "Login response received",
                    expect.stringContaining(
                        "Session establishment is pending backend response mapping.",
                    ),
                );
            });

            alertSpy.mockRestore();
        });

        it("displays an error when the login service rejects", async () => {
            mockLogin.mockRejectedValue(
                new Error("Invalid credentials"),
            );

            renderScreen();

            enterValidCredentials();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Login",
                }),
            );

            expect(
                await screen.findByText("Invalid credentials"),
            ).toBeTruthy();

            await waitFor(() => {
                expect(
                    screen.getByRole("button", {
                        name: "Login",
                    }),
                ).toBeEnabled();
            });

            expect(mockLoggerError).toHaveBeenCalledWith(
                "Login request failed.",
            );
        });
    });
});
