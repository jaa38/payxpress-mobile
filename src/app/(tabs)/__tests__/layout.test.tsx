import {
    render,
    waitFor,
} from "@testing-library/react-native";

import TabsLayout from "@/app/(tabs)/_layout";
import AppTabs from "@/components/app-tabs";
import { onboardingStorage } from "@/services/auth/onboarding-storage";
import { useAuthStore } from "@/store/auth-store";

jest.mock("expo-router", () => ({
    Redirect: jest.fn(({ href }) => {
        const { Text } = require("react-native");

        return <Text>Redirecting to {href}</Text>;
    }),
}));

jest.mock("@/components/app-tabs", () => {
    const { Text } = require("react-native");

    return jest.fn(() => <Text>PayXpress tabs</Text>);
});

jest.mock("@/services/auth/onboarding-storage", () => ({
    onboardingStorage: {
        hasCompleted: jest.fn(),
    },
}));

describe("TabsLayout", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Default onboarding state for authenticated users.
        jest.mocked(onboardingStorage.hasCompleted).mockResolvedValue(true);

        useAuthStore.setState({
            user: null,
            isAuthenticated: false,
            isHydrating: true,
        });
    });

    it("renders nothing while authentication is hydrating", () => {
        useAuthStore.setState({
            isHydrating: true,
            isAuthenticated: false,
        });

        const { toJSON } = render(<TabsLayout />);

        expect(toJSON()).toBeNull();
        expect(AppTabs).not.toHaveBeenCalled();
    });

    it("redirects unauthenticated users to the welcome screen", () => {
        useAuthStore.setState({
            isHydrating: false,
            isAuthenticated: false,
        });

        const { getByText } = render(<TabsLayout />);

        expect(
            getByText("Redirecting to /welcome"),
        ).toBeTruthy();

        expect(AppTabs).not.toHaveBeenCalled();
        expect(onboardingStorage.hasCompleted).not.toHaveBeenCalled();
    });

    it("renders AppTabs for authenticated users", async () => {
        useAuthStore.setState({
            isHydrating: false,
            isAuthenticated: true,
        });

        const { getByText } = render(<TabsLayout />);

        await waitFor(() => {
            expect(getByText("PayXpress tabs")).toBeTruthy();
        });

        expect(AppTabs).toHaveBeenCalledTimes(1);
        expect(onboardingStorage.hasCompleted).toHaveBeenCalledTimes(1);
    });

    it("redirects authenticated users who have not completed onboarding", async () => {
        jest.mocked(onboardingStorage.hasCompleted).mockResolvedValue(false);

        useAuthStore.setState({
            isHydrating: false,
            isAuthenticated: true,
        });

        const { getByText } = render(<TabsLayout />);

        await waitFor(() => {
            expect(
                getByText("Redirecting to /(tabs)/first-time-guidance"),
            ).toBeTruthy();
        });

        expect(AppTabs).not.toHaveBeenCalled();
    });
});