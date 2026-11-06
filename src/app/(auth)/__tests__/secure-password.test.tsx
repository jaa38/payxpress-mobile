
import { fireEvent, render, screen } from "@testing-library/react-native";
import SecurePasswordScreen from "../register/secure-password";

const mockBack = jest.fn();
const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
    router: {
        back: (...args: unknown[]) => mockBack(...args),
        replace: (...args: unknown[]) => mockReplace(...args),
    },
}));

jest.mock("expo-status-bar", () => ({
    StatusBar: () => null,
}));

jest.mock("@expo/vector-icons", () => {
    const React = require("react");
    const { Text } = require("react-native");

    return {
        Ionicons: ({ name }: { name: string }) =>
            React.createElement(Text, null, name),
    };
});

jest.mock("@/hooks/use-theme", () => ({
    useTheme: () => ({
        isDark: false,
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

jest.mock("@/components/ui/AppText", () => {
    const React = require("react");
    const { Text } = require("react-native");

    return {
        AppText: ({ children, ...props }: any) =>
            React.createElement(Text, props, children),
    };
});

jest.mock("@/components/ui/Input", () => {
    const React = require("react");
    const {
        View,
        TextInput,
    } = require("react-native");

    return {
        Input: ({
            label,
            value,
            onChangeText,
            placeholder,
            secureTextEntry,
            rightElement,
            ...props
        }: any) =>
            React.createElement(
                View,
                null,
                React.createElement(TextInput, {
                    ...props,
                    accessibilityLabel: label,
                    value,
                    onChangeText,
                    placeholder,
                    secureTextEntry,
                }),
                rightElement,
            ),
    };
});

jest.mock("@/components/ui/Button", () => {
    const React = require("react");
    const { Text, Pressable } = require("react-native");

    return {
        Button: ({
            title,
            onPress,
            disabled,
            loading,
        }: any) =>
            React.createElement(
                Pressable,
                {
                    accessibilityRole: "button",
                    accessibilityLabel: title,
                    accessibilityState: {
                        disabled: Boolean(disabled || loading),
                        busy: Boolean(loading),
                    },
                    disabled: Boolean(disabled || loading),
                    onPress,
                },
                React.createElement(Text, null, title),
            ),
    };
});

describe("SecurePasswordScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderScreen = () => render(<SecurePasswordScreen />);

    const enterValidPassword = (
        password = "Password123!",
        confirmation = password,
    ) => {
        fireEvent.changeText(
            screen.getByLabelText("Password"),
            password,
        );

        fireEvent.changeText(
            screen.getByLabelText("Confirm Password"),
            confirmation,
        );
    };

    const getCreateAccountButton = () =>
        screen.getByRole("button", {
            name: "Create Account",
        });

    describe("Rendering", () => {
        it("renders the secure account heading", () => {
            renderScreen();

            expect(
                screen.getByText("Secure your account"),
            ).toBeTruthy();
        });

        it("renders the password security description", () => {
            renderScreen();

            expect(
                screen.getByText(
                    "Create a strong password to keep your PayXpress account secure.",
                ),
            ).toBeTruthy();
        });

        it("renders the password and confirmation inputs", () => {
            renderScreen();

            expect(
                screen.getByLabelText("Password"),
            ).toBeTruthy();

            expect(
                screen.getByLabelText("Confirm Password"),
            ).toBeTruthy();
        });

        it("renders the password placeholders", () => {
            renderScreen();

            expect(
                screen.getByPlaceholderText("Enter your password"),
            ).toBeTruthy();

            expect(
                screen.getByPlaceholderText("Re-enter your password"),
            ).toBeTruthy();
        });

        it("renders all password requirements", () => {
            renderScreen();

            expect(
                screen.getByText(/At least 8 characters/),
            ).toBeTruthy();

            expect(
                screen.getByText(/One uppercase letter/),
            ).toBeTruthy();

            expect(
                screen.getByText(/One lowercase letter/),
            ).toBeTruthy();

            expect(
                screen.getByText(/One number/),
            ).toBeTruthy();

            expect(
                screen.getByText(/One special character/),
            ).toBeTruthy();
        });

        it("renders the Create Account button", () => {
            renderScreen();

            expect(getCreateAccountButton()).toBeTruthy();
        });

        it("renders the CBN licensing logo", () => {
            renderScreen();

            expect(
                screen.getByLabelText("Central Bank of Nigeria"),
            ).toBeTruthy();
        });

        it("hides both passwords initially", () => {
            renderScreen();

            expect(
                screen.getByLabelText("Password").props.secureTextEntry,
            ).toBe(true);

            expect(
                screen.getByLabelText("Confirm Password").props.secureTextEntry,
            ).toBe(true);
        });
    });

    describe("Password requirements", () => {
        it("keeps Create Account disabled when the password is empty", () => {
            renderScreen();

            expect(
                getCreateAccountButton().props.accessibilityState.disabled,
            ).toBe(true);
        });

        it("keeps Create Account disabled when the password has fewer than eight characters", () => {
            renderScreen();

            enterValidPassword("Pass1!", "Pass1!");

            expect(
                getCreateAccountButton().props.accessibilityState.disabled,
            ).toBe(true);
        });

        it("keeps Create Account disabled without an uppercase letter", () => {
            renderScreen();

            enterValidPassword("password123!", "password123!");

            expect(
                getCreateAccountButton().props.accessibilityState.disabled,
            ).toBe(true);
        });

        it("keeps Create Account disabled without a lowercase letter", () => {
            renderScreen();

            enterValidPassword("PASSWORD123!", "PASSWORD123!");

            expect(
                getCreateAccountButton().props.accessibilityState.disabled,
            ).toBe(true);
        });

        it("keeps Create Account disabled without a number", () => {
            renderScreen();

            enterValidPassword("PasswordTest!", "PasswordTest!");

            expect(
                getCreateAccountButton().props.accessibilityState.disabled,
            ).toBe(true);
        });

        it("keeps Create Account disabled without a special character", () => {
            renderScreen();

            enterValidPassword("Password123", "Password123");

            expect(
                getCreateAccountButton().props.accessibilityState.disabled,
            ).toBe(true);
        });

        it("enables Create Account when all requirements are satisfied", () => {
            renderScreen();

            enterValidPassword();

            expect(
                getCreateAccountButton().props.accessibilityState.disabled,
            ).toBe(false);
        });

        it("displays successful password requirement indicators", () => {
            renderScreen();

            enterValidPassword();

            expect(
                screen.getByText("✓ At least 8 characters"),
            ).toBeTruthy();

            expect(
                screen.getByText("✓ One uppercase letter"),
            ).toBeTruthy();

            expect(
                screen.getByText("✓ One lowercase letter"),
            ).toBeTruthy();

            expect(
                screen.getByText("✓ One number"),
            ).toBeTruthy();

            expect(
                screen.getByText("✓ One special character"),
            ).toBeTruthy();
        });
    });

    describe("Password confirmation", () => {
        it("does not display a match message before confirmation is entered", () => {
            renderScreen();

            fireEvent.changeText(
                screen.getByLabelText("Password"),
                "Password123!",
            );

            expect(
                screen.queryByText(/Passwords match/),
            ).toBeNull();
        });

        it("displays a mismatch message when passwords differ", () => {
            renderScreen();

            enterValidPassword("Password123!", "Different123!");

            expect(
                screen.getByText("Passwords do not match"),
            ).toBeTruthy();
        });

        it("displays a match message when passwords are identical", () => {
            renderScreen();

            enterValidPassword();

            expect(
                screen.getByText(/Passwords match/),
            ).toBeTruthy();
        });

        it("keeps Create Account disabled when passwords do not match", () => {
            renderScreen();

            enterValidPassword("Password123!", "Different123!");

            expect(
                getCreateAccountButton().props.accessibilityState.disabled,
            ).toBe(true);
        });
    });

    describe("Password visibility", () => {
        it("shows the password when Show password is pressed", () => {
            renderScreen();

            expect(
                screen.getByLabelText("Password").props.secureTextEntry,
            ).toBe(true);

            fireEvent.press(
                screen.getByLabelText("Show password"),
            );

            expect(
                screen.getByLabelText("Password").props.secureTextEntry,
            ).toBe(false);

            expect(
                screen.getByLabelText("Hide password"),
            ).toBeTruthy();
        });

        it("hides the password when Hide password is pressed", () => {
            renderScreen();

            fireEvent.press(
                screen.getByLabelText("Show password"),
            );

            fireEvent.press(
                screen.getByLabelText("Hide password"),
            );

            expect(
                screen.getByLabelText("Password").props.secureTextEntry,
            ).toBe(true);
        });

        it("shows the confirmation password independently", () => {
            renderScreen();

            expect(
                screen.getByLabelText("Confirm Password").props.secureTextEntry,
            ).toBe(true);

            fireEvent.press(
                screen.getByLabelText("Show confirm password"),
            );

            expect(
                screen.getByLabelText("Confirm Password").props.secureTextEntry,
            ).toBe(false);

            expect(
                screen.getByLabelText("Hide confirm password"),
            ).toBeTruthy();

            expect(
                screen.getByLabelText("Password").props.secureTextEntry,
            ).toBe(true);
        });
    });

    describe("Error handling", () => {
        it("does not display an error initially", () => {
            renderScreen();

            expect(
                screen.queryByText(
                    "Password must be at least 8 characters.",
                ),
            ).toBeNull();
        });

        it("does not display an error for a valid password", () => {
            renderScreen();

            enterValidPassword();

            expect(
                screen.queryByText(
                    "Password must be at least 8 characters.",
                ),
            ).toBeNull();
        });

        it("updates the password match indicator when the password changes", () => {
            renderScreen();

            const password = "Password123!";
            const updatedPassword = "NewPassword123!";

            fireEvent.changeText(
                screen.getByLabelText("Password"),
                password,
            );

            fireEvent.changeText(
                screen.getByLabelText("Confirm Password"),
                password,
            );

            expect(
                screen.getByText(/Passwords match/),
            ).toBeTruthy();

            fireEvent.changeText(
                screen.getByLabelText("Password"),
                updatedPassword,
            );

            expect(
                screen.getByText("Passwords do not match"),
            ).toBeTruthy();
        });
    });

    describe("Navigation", () => {
        it("navigates back when the back button is pressed", () => {
            renderScreen();

            fireEvent.press(
                screen.getByLabelText("Go back"),
            );

            expect(mockBack).toHaveBeenCalledTimes(1);
        });

        it("replaces the route with the tabs screen after successful account creation", () => {
            renderScreen();

            enterValidPassword();

            fireEvent.press(getCreateAccountButton());

            expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
        });
    });
});
