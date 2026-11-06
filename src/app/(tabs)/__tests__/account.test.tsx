
import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import { Alert } from "react-native";

import AccountScreen from "../account";

const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockSetThemeMode = jest.fn();
const mockLogout = jest.fn();
const mockGetAvailability = jest.fn();
const mockLoggerError = jest.fn();

let mockUser: {
    id: string;
    email: string;
    tagName: string;
} | null = {
    id: "user-001",
    email: "customer@example.com",
    tagName: "Customer One",
};

let mockThemeMode: "system" | "light" | "dark" = "system";

const mockTheme = {
    background: {
        primary: "#FFFFFF",
        surface: "#FFFFFF",
        subtle: "#F5F5F5",
        brand: "#E8F5E9",
    },
    text: {
        primary: "#111111",
        secondary: "#666666",
        brand: "#008000",
        error: "#CC0000",
    },
    border: {
        default: "#DDDDDD",
        error: "#CC0000",
        brand: "#008000",
        strong: "#999999",
    },
    overlay: {
        background: "rgba(0,0,0,0.5)",
    },
};

jest.mock("expo-router", () => ({
    router: {
        back: (...args: unknown[]) => mockBack(...args),
        replace: (...args: unknown[]) => mockReplace(...args),
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
        AppText: ({ children, ...props }: any) =>
            React.createElement(Text, props, children),
    };
});

jest.mock("@/hooks/use-theme", () => ({
    useTheme: () => ({
        theme: mockTheme,
        themeMode: mockThemeMode,
        resolvedTheme: mockThemeMode,
        isDark: mockThemeMode === "dark",
        setThemeMode: mockSetThemeMode,
    }),
}));

jest.mock("@/services/auth/auth-service", () => ({
    authService: {
        logout: (...args: unknown[]) => mockLogout(...args),
    },
}));

jest.mock("@/services/auth/biometric-auth", () => ({
    biometricAuth: {
        getAvailability: (...args: unknown[]) =>
            mockGetAvailability(...args),
    },
}));

jest.mock("@/store/auth-store", () => ({
    useAuthStore: (selector: (state: any) => unknown) =>
        selector({
            user: mockUser,
        }),
}));

jest.mock("@/utils/logger", () => ({
    logger: {
        error: (...args: unknown[]) => mockLoggerError(...args),
    },
}));

describe("AccountScreen", () => {
    let alertSpy: jest.SpyInstance;

    const availableBiometrics = {
        isAvailable: true,
        hasHardware: true,
        isEnrolled: true,
        supportedTypes: [],
        biometricType: "Face ID" as const,
    };

    const unavailableBiometrics = {
        isAvailable: false,
        hasHardware: false,
        isEnrolled: false,
        supportedTypes: [],
        biometricType: null,
        message: "Biometrics unavailable",
    };

    // Wait for the default biometric availability check to finish.
    const renderScreen = async () => {
        const result = render(<AccountScreen />);

        await waitFor(() => {
            expect(mockGetAvailability).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(
                screen.queryByText("Checking device..."),
            ).toBeNull();
        });

        return result;
    };

    // Used by tests that intentionally need biometrics to remain loading.
    const renderScreenWhileLoading = () =>
        render(<AccountScreen />);

    const pressLogoutConfirmation = async (
        action: "Log out" | "Cancel",
    ) => {
        const logoutAlert = alertSpy.mock.calls.find(
            ([title]) => title === "Log out",
        );

        expect(logoutAlert).toBeTruthy();

        const buttons = logoutAlert?.[2] as
            | Array<{
                text: string;
                onPress?: () => void | Promise<void>;
            }>
            | undefined;

        const selectedButton = buttons?.find(
            (button) => button.text === action,
        );

        expect(selectedButton).toBeTruthy();

        await act(async () => {
            await selectedButton?.onPress?.();
        });
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockUser = {
            id: "user-001",
            email: "customer@example.com",
            tagName: "Customer One",
        };

        mockThemeMode = "system";

        mockGetAvailability.mockResolvedValue(
            availableBiometrics,
        );

        mockLogout.mockResolvedValue(undefined);

        alertSpy = jest
            .spyOn(Alert, "alert")
            .mockImplementation(() => { });
    });

    afterEach(() => {
        alertSpy.mockRestore();
    });

    describe("Rendering", () => {
        it("renders the Account heading", async () => {
            await renderScreen();

            expect(screen.getByText("Account")).toBeTruthy();
        });

        it("renders the account description", async () => {
            await renderScreen();

            expect(
                screen.getByText(
                    "Manage your profile and account preferences.",
                ),
            ).toBeTruthy();
        });

        it("renders the authenticated user's tag name", async () => {
            await renderScreen();

            expect(screen.getByText("Customer One")).toBeTruthy();
        });

        it("renders the authenticated user's email", async () => {
            await renderScreen();

            expect(
                screen.getByText("customer@example.com"),
            ).toBeTruthy();
        });

        it("renders fallback profile information when no user exists", async () => {
            mockUser = null;

            await renderScreen();

            expect(
                screen.getByText("PayXpress Customer"),
            ).toBeTruthy();

            expect(
                screen.getByText("Account profile"),
            ).toBeTruthy();
        });

        it("renders the Account section", async () => {
            await renderScreen();

            expect(screen.getByText("ACCOUNT")).toBeTruthy();
            expect(
                screen.getByText("Personal Information"),
            ).toBeTruthy();
        });

        it("renders the Security section", async () => {
            await renderScreen();

            expect(screen.getByText("SECURITY")).toBeTruthy();

            expect(
                screen.getByText("Change Password"),
            ).toBeTruthy();
        });

        it("renders the Preferences section", async () => {
            await renderScreen();

            expect(
                screen.getByText("PREFERENCES"),
            ).toBeTruthy();

            expect(
                screen.getByText("Notifications"),
            ).toBeTruthy();

            expect(screen.getByText("Language")).toBeTruthy();
            expect(screen.getByText("Appearance")).toBeTruthy();
        });

        it("renders the Support section", async () => {
            await renderScreen();

            expect(screen.getByText("SUPPORT")).toBeTruthy();

            expect(screen.getByText("Help Centre")).toBeTruthy();

            expect(
                screen.getByText("Contact Support"),
            ).toBeTruthy();

            expect(
                screen.getByText("Terms and Privacy"),
            ).toBeTruthy();
        });

        it("renders the logout action", async () => {
            await renderScreen();

            expect(
                screen.getByRole("button", {
                    name: "Log out",
                }),
            ).toBeTruthy();
        });

        it("renders the PayXpress footer", async () => {
            await renderScreen();

            expect(
                screen.getByText("PayXpress"),
            ).toBeTruthy();
        });
    });

    describe("Biometric availability", () => {
        it("checks biometric availability when the screen mounts", async () => {
            await renderScreen();

            expect(mockGetAvailability).toHaveBeenCalledTimes(1);
        });

        it("displays the checking state while biometrics are loading", async () => {
            let resolveAvailability!: (
                value: typeof availableBiometrics,
            ) => void;

            mockGetAvailability.mockReturnValue(
                new Promise((resolve) => {
                    resolveAvailability = resolve;
                }),
            );

            renderScreenWhileLoading();

            expect(
                screen.getByText("Checking device..."),
            ).toBeTruthy();

            await act(async () => {
                resolveAvailability(availableBiometrics);
            });

            await waitFor(() => {
                expect(
                    screen.getByText("Available on this device"),
                ).toBeTruthy();
            });
        });

        it("displays Face ID when Face ID is available", async () => {
            await renderScreen();

            expect(screen.getByText("Face ID")).toBeTruthy();
            expect(screen.getByText("Available")).toBeTruthy();
        });

        it("displays Fingerprint when fingerprint authentication is available", async () => {
            mockGetAvailability.mockResolvedValue({
                ...availableBiometrics,
                biometricType: "Fingerprint",
            });

            await renderScreen();

            expect(screen.getByText("Fingerprint")).toBeTruthy();
        });

        it("displays the unavailable state when biometrics are not supported", async () => {
            mockGetAvailability.mockResolvedValue(
                unavailableBiometrics,
            );

            await renderScreen();

            expect(
                screen.getByText("Biometric Sign-in"),
            ).toBeTruthy();

            expect(
                screen.getByText(
                    "Not configured on this device",
                ),
            ).toBeTruthy();

            expect(screen.getByText("Unavailable")).toBeTruthy();
        });

        it("handles biometric availability errors", async () => {
            mockGetAvailability.mockRejectedValue(
                new Error("Biometric check failed"),
            );

            await renderScreen();

            expect(mockLoggerError).toHaveBeenCalledWith(
                "Unable to check biometrics.",
            );

            expect(
                screen.getByText(
                    "Not configured on this device",
                ),
            ).toBeTruthy();
        });

        it("shows an alert when biometric settings are opened before checking finishes", async () => {
            let resolveAvailability!: (
                value: typeof availableBiometrics,
            ) => void;

            mockGetAvailability.mockReturnValue(
                new Promise((resolve) => {
                    resolveAvailability = resolve;
                }),
            );

            renderScreenWhileLoading();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Biometric Sign-in",
                }),
            );

            expect(alertSpy).not.toHaveBeenCalled();

            await act(async () => {
                resolveAvailability(availableBiometrics);
            });
        });

        it("shows an unavailable alert when biometrics are not available", async () => {
            mockGetAvailability.mockResolvedValue(
                unavailableBiometrics,
            );

            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Biometric Sign-in",
                }),
            );

            expect(alertSpy).toHaveBeenCalledWith(
                "Biometrics unavailable",
                "Your device does not currently have an enrolled biometric authentication method.",
            );
        });

        it("shows the biometric type in the unavailable alert when known", async () => {
            mockGetAvailability.mockResolvedValue({
                ...unavailableBiometrics,
                biometricType: "Face ID",
            });

            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Face ID",
                }),
            );

            expect(alertSpy).toHaveBeenCalledWith(
                "Biometrics unavailable",
                "Please configure Face ID on your device before continuing.",
            );
        });

        it("shows an informational alert when biometrics are available", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Face ID",
                }),
            );

            expect(alertSpy).toHaveBeenCalledWith(
                "Face ID available",
                expect.stringContaining(
                    "Face ID is supported and enrolled on this device.",
                ),
                [{ text: "OK" }],
            );
        });
    });

    describe("Account preferences", () => {
        it("shows a coming soon alert for Personal Information", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Personal Information",
                }),
            );

            expect(alertSpy).toHaveBeenCalledWith(
                "Personal Information",
                "This feature will be available in a future PayXpress update.",
            );
        });

        it("shows a coming soon alert for Change Password", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Change Password",
                }),
            );

            expect(alertSpy).toHaveBeenCalledWith(
                "Change Password",
                expect.stringContaining("future PayXpress update"),
            );
        });

        it("shows a coming soon alert for Notifications", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Notifications",
                }),
            );

            expect(alertSpy).toHaveBeenCalledWith(
                "Notifications",
                expect.stringContaining("future PayXpress update"),
            );
        });

        it("shows English as the selected language", async () => {
            await renderScreen();

            expect(screen.getByText("English")).toBeTruthy();
        });

        it("shows a coming soon alert for Language", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Language",
                }),
            );

            expect(alertSpy).toHaveBeenCalledWith(
                "Language",
                expect.stringContaining("future PayXpress update"),
            );
        });

        it("shows a coming soon alert for Help Centre", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Help Centre",
                }),
            );

            expect(alertSpy).toHaveBeenCalledWith(
                "Help Centre",
                expect.stringContaining("future PayXpress update"),
            );
        });

        it("shows a coming soon alert for Contact Support", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Contact Support",
                }),
            );

            expect(alertSpy).toHaveBeenCalledWith(
                "Contact Support",
                expect.stringContaining("future PayXpress update"),
            );
        });

        it("shows a coming soon alert for Terms and Privacy", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Terms and Privacy",
                }),
            );

            expect(alertSpy).toHaveBeenCalledWith(
                "Terms and Privacy",
                expect.stringContaining("future PayXpress update"),
            );
        });
    });

    describe("Appearance settings", () => {
        it("displays System as the default appearance", async () => {
            await renderScreen();

            expect(screen.getByText("System")).toBeTruthy();
        });

        it("opens the appearance selector", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Appearance",
                }),
            );

            expect(
                screen.getByText(
                    "Choose how PayXpress looks on your device.",
                ),
            ).toBeTruthy();

            expect(screen.getByRole("radio", { name: "System" })).toBeTruthy();
            expect(screen.getByRole("radio", { name: "Light" })).toBeTruthy();
            expect(screen.getByRole("radio", { name: "Dark" })).toBeTruthy();
        });

        it("marks the current appearance as selected", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Appearance",
                }),
            );

            expect(
                screen.getByRole("radio", { name: "System" }).props
                    .accessibilityState.checked,
            ).toBe(true);
        });

        it("changes the appearance to Light", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Appearance",
                }),
            );

            fireEvent.press(
                screen.getByRole("radio", {
                    name: "Light",
                }),
            );

            expect(mockSetThemeMode).toHaveBeenCalledWith("light");
        });

        it("changes the appearance to Dark", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Appearance",
                }),
            );

            fireEvent.press(
                screen.getByRole("radio", {
                    name: "Dark",
                }),
            );

            expect(mockSetThemeMode).toHaveBeenCalledWith("dark");
        });

        it("changes the appearance to System", async () => {
            mockThemeMode = "dark";

            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Appearance",
                }),
            );

            fireEvent.press(
                screen.getByRole("radio", {
                    name: "System",
                }),
            );

            expect(mockSetThemeMode).toHaveBeenCalledWith("system");
        });

        it("closes the appearance selector after selecting an option", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Appearance",
                }),
            );

            fireEvent.press(
                screen.getByRole("radio", {
                    name: "Dark",
                }),
            );

            expect(
                screen.queryByText(
                    "Choose how PayXpress looks on your device.",
                ),
            ).toBeNull();
        });

        it("closes the appearance selector using the close button", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Appearance",
                }),
            );

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Close",
                }),
            );

            expect(
                screen.queryByText(
                    "Choose how PayXpress looks on your device.",
                ),
            ).toBeNull();
        });

        it("closes the appearance selector using the backdrop", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Appearance",
                }),
            );

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Close appearance settings",
                }),
            );

            expect(
                screen.queryByText(
                    "Choose how PayXpress looks on your device.",
                ),
            ).toBeNull();
        });

        it("displays the current Light appearance", async () => {
            mockThemeMode = "light";

            await renderScreen();

            expect(screen.getByText("Light")).toBeTruthy();
        });

        it("displays the current Dark appearance", async () => {
            mockThemeMode = "dark";

            await renderScreen();

            expect(screen.getByText("Dark")).toBeTruthy();
        });
    });

    describe("Logout", () => {
        it("shows a logout confirmation alert", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Log out",
                }),
            );

            expect(alertSpy).toHaveBeenCalledWith(
                "Log out",
                "Are you sure you want to log out of your PayXpress account?",
                expect.arrayContaining([
                    expect.objectContaining({
                        text: "Cancel",
                        style: "cancel",
                    }),
                    expect.objectContaining({
                        text: "Log out",
                        style: "destructive",
                    }),
                ]),
            );
        });

        it("does not log out when Cancel is selected", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Log out",
                }),
            );

            await pressLogoutConfirmation("Cancel");

            expect(mockLogout).not.toHaveBeenCalled();
            expect(mockReplace).not.toHaveBeenCalled();
        });

        it("logs out and redirects to Welcome when confirmed", async () => {
            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Log out",
                }),
            );

            await pressLogoutConfirmation("Log out");

            expect(mockLogout).toHaveBeenCalledTimes(1);

            expect(mockReplace).toHaveBeenCalledWith(
                "/welcome",
            );
        });

        it("shows an error alert when logout fails", async () => {
            mockLogout.mockRejectedValue(
                new Error("Unable to clear session"),
            );

            await renderScreen();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Log out",
                }),
            );

            await pressLogoutConfirmation("Log out");

            expect(mockLogout).toHaveBeenCalledTimes(1);

            expect(mockReplace).not.toHaveBeenCalled();

            expect(alertSpy).toHaveBeenCalledWith(
                "Unable to log out",
                "We couldn't securely clear your session. Please try again.",
            );
        });
    });
});
