
import { render } from "@testing-library/react-native";

import TabsLayout from "@/app/(tabs)/_layout";
import AppTabs from "@/components/app-tabs";
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

describe("TabsLayout", () => {
    beforeEach(() => {
        jest.clearAllMocks();

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

        expect(getByText("Redirecting to /welcome")).toBeTruthy();
        expect(AppTabs).not.toHaveBeenCalled();
    });

    it("renders AppTabs for authenticated users", () => {
        useAuthStore.setState({
            isHydrating: false,
            isAuthenticated: true,
        });

        const { getByText } = render(<TabsLayout />);

        expect(getByText("PayXpress tabs")).toBeTruthy();
        expect(AppTabs).toHaveBeenCalledTimes(1);
    });
});
