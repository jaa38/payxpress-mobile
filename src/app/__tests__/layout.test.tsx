
import { render, screen } from "@testing-library/react-native";
import * as SplashScreen from "expo-splash-screen";

import RootLayout from "../_layout";

jest.mock("expo-splash-screen", () => ({
    preventAutoHideAsync: jest.fn(),
}));

jest.mock("expo-router", () => {
    const React = require("react");
    const { Text } = require("react-native");

    return {
        Slot: jest.fn(() =>
            React.createElement(Text, null, "Expo Router Slot"),
        ),
    };
});

jest.mock("@/components/animated-icon", () => {
    const React = require("react");
    const { Text } = require("react-native");

    return {
        AnimatedSplashOverlay: jest.fn(() =>
            React.createElement(
                Text,
                null,
                "Animated Splash Overlay",
            ),
        ),
    };
});

jest.mock("@/providers/AppProviders", () => {
    const React = require("react");

    return {
        AppProviders: jest.fn(
            ({ children }: { children: React.ReactNode }) =>
                React.createElement(React.Fragment, null, children),
        ),
    };
});

describe("RootLayout", () => {
    const mockPreventAutoHideAsync =
        SplashScreen.preventAutoHideAsync as jest.Mock;

    beforeEach(() => {
        jest.mocked(require("expo-router").Slot).mockClear();

        jest
            .mocked(
                require("@/components/animated-icon").AnimatedSplashOverlay,
            )
            .mockClear();

        jest
            .mocked(
                require("@/providers/AppProviders").AppProviders,
            )
            .mockClear();

        // Preserve the import-time splash-screen call.
        mockPreventAutoHideAsync.mockResolvedValue(undefined);
    });

    it("prevents the native splash screen from hiding automatically", () => {
        expect(mockPreventAutoHideAsync).toHaveBeenCalledTimes(1);
    });

    it("renders the Expo Router Slot", () => {
        render(<RootLayout />);

        expect(
            screen.getByText("Expo Router Slot"),
        ).toBeTruthy();
    });

    it("renders the animated splash overlay", () => {
        render(<RootLayout />);

        expect(
            screen.getByText("Animated Splash Overlay"),
        ).toBeTruthy();
    });

    it("wraps the application content with AppProviders", () => {
        render(<RootLayout />);

        expect(
            require("@/providers/AppProviders").AppProviders,
        ).toHaveBeenCalledTimes(1);
    });

    it("renders both the router slot and splash overlay together", () => {
        render(<RootLayout />);

        expect(
            screen.getByText("Expo Router Slot"),
        ).toBeTruthy();

        expect(
            screen.getByText("Animated Splash Overlay"),
        ).toBeTruthy();
    });
});
