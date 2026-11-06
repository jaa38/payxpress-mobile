
import { render } from "@testing-library/react-native";
import type { ReactNode } from "react";
import * as ReactNative from "react-native";
import { Text } from "react-native";

import { queryClient } from "@/lib/query-client";
import { AppProviders } from "@/providers/AppProviders";
import { darkTheme, lightTheme } from "@/theme/theme";

type MockThemeProviderProps = {
    children: ReactNode;
    value: {
        name?: string;
        dark?: boolean;
        colors: Record<string, unknown>;
    };
};

type MockQueryProviderProps = {
    children: ReactNode;
    client: unknown;
};

const mockUseFonts = jest.fn();
const mockUseAppStore = jest.fn();

const mockThemeProvider = jest.fn(
    ({ children }: MockThemeProviderProps) => children,
);

const mockQueryClientProvider = jest.fn(
    ({ children }: MockQueryProviderProps) => children,
);

const mockAuthBootstrap = jest.fn(
    ({ children }: { children: ReactNode }) => children,
);

jest.mock("expo-font", () => ({
    useFonts: (...args: unknown[]) => mockUseFonts(...args),
}));

jest.mock("expo-router", () => ({
    DarkTheme: {
        name: "DarkTheme",
        dark: true,
        colors: {
            primary: "#ffffff",
            background: "#000000",
            card: "#111111",
            text: "#ffffff",
            border: "#333333",
            notification: "#ff0000",
        },
    },

    DefaultTheme: {
        name: "DefaultTheme",
        dark: false,
        colors: {
            primary: "#000000",
            background: "#ffffff",
            card: "#f5f5f5",
            text: "#000000",
            border: "#dddddd",
            notification: "#ff0000",
        },
    },

    ThemeProvider: (props: MockThemeProviderProps) =>
        mockThemeProvider(props),
}));

jest.mock("@tanstack/react-query", () => {
    const actual = jest.requireActual("@tanstack/react-query");

    return {
        ...actual,
        QueryClientProvider: (props: MockQueryProviderProps) =>
            mockQueryClientProvider(props),
    };
});

jest.mock("@/providers/AuthBootstrap", () => ({
    AuthBootstrap: (props: { children: ReactNode }) =>
        mockAuthBootstrap(props),
}));

jest.mock("@/store/app-store", () => ({
    useAppStore: (selector: (state: { themeMode: string }) => unknown) =>
        mockUseAppStore(selector),
}));

describe("AppProviders", () => {
    const renderApp = () =>
        render(
            <AppProviders>
                <Text>PayXpress application</Text>
            </AppProviders>,
        );

    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(ReactNative, "useColorScheme").mockReturnValue("light");

        mockUseFonts.mockReturnValue([true, null]);

        mockUseAppStore.mockImplementation(
            (selector: (state: { themeMode: string }) => unknown) =>
                selector({ themeMode: "system" }),
        );
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it("renders nothing while fonts are loading", () => {
        mockUseFonts.mockReturnValue([false, null]);

        const { toJSON } = renderApp();

        expect(toJSON()).toBeNull();
        expect(mockQueryClientProvider).not.toHaveBeenCalled();
    });

    it("continues rendering when font loading returns an error", () => {
        mockUseFonts.mockReturnValue([
            false,
            new Error("Font loading failed"),
        ]);

        const { getByText } = renderApp();

        expect(getByText("PayXpress application")).toBeTruthy();
        expect(mockQueryClientProvider).toHaveBeenCalledTimes(1);
    });

    it("renders the application after fonts load successfully", () => {
        const { getByText } = renderApp();

        expect(getByText("PayXpress application")).toBeTruthy();
    });

    it("uses the light theme when system mode is light", () => {
        jest.spyOn(ReactNative, "useColorScheme").mockReturnValue("light");

        renderApp();

        const themeValue = mockThemeProvider.mock.calls[0][0].value;

        expect(themeValue.colors.primary).toBe(
            lightTheme.navigation.active,
        );

        expect(themeValue.colors.background).toBe(
            lightTheme.background.primary,
        );
    });

    it("uses the dark theme when system mode is dark", () => {
        jest.spyOn(ReactNative, "useColorScheme").mockReturnValue("dark");

        renderApp();

        const themeValue = mockThemeProvider.mock.calls[0][0].value;

        expect(themeValue.colors.primary).toBe(
            darkTheme.navigation.active,
        );

        expect(themeValue.colors.background).toBe(
            darkTheme.background.primary,
        );
    });

    it("uses the dark theme when manually selected", () => {
        mockUseAppStore.mockImplementation(
            (selector: (state: { themeMode: string }) => unknown) =>
                selector({ themeMode: "dark" }),
        );

        renderApp();

        const themeValue = mockThemeProvider.mock.calls[0][0].value;

        expect(themeValue.colors.primary).toBe(
            darkTheme.navigation.active,
        );
    });

    it("uses the light theme when manually selected", () => {
        mockUseAppStore.mockImplementation(
            (selector: (state: { themeMode: string }) => unknown) =>
                selector({ themeMode: "light" }),
        );

        jest.spyOn(ReactNative, "useColorScheme").mockReturnValue("dark");

        renderApp();

        const themeValue = mockThemeProvider.mock.calls[0][0].value;

        expect(themeValue.colors.primary).toBe(
            lightTheme.navigation.active,
        );
    });

    it("passes the shared query client to QueryClientProvider", () => {
        renderApp();

        expect(mockQueryClientProvider).toHaveBeenCalledTimes(1);

        expect(
            mockQueryClientProvider.mock.calls[0][0].client,
        ).toBe(queryClient);
    });

    it("wraps application content with authentication bootstrap", () => {
        renderApp();

        expect(mockAuthBootstrap).toHaveBeenCalledTimes(1);
        expect(mockAuthBootstrap.mock.calls[0][0].children).toBeTruthy();
    });

    it("uses the appropriate Expo Router navigation theme", () => {
        jest.spyOn(ReactNative, "useColorScheme").mockReturnValue("dark");

        renderApp();

        const themeValue = mockThemeProvider.mock.calls[0][0].value;

        expect(themeValue.dark).toBe(true);
        expect(themeValue.colors.background).toBe(
            darkTheme.background.primary,
        );
    });
});
