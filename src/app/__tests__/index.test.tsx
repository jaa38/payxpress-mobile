import { render } from "@testing-library/react-native";

import IndexRoute from "@/app/index";
import { useAuthStore } from "@/store/auth-store";

jest.mock("expo-router", () => ({
    Redirect: jest.fn(({ href }) => {
        const { Text } = require("react-native");

        return <Text>Redirecting to {href}</Text>;
    }),
}));

describe("IndexRoute", () => {
    beforeEach(() => {
        useAuthStore.setState({
            user: null,
            isAuthenticated: false,
            isHydrating: false,
        });
    });

    it("renders nothing while authentication is hydrating", () => {
        useAuthStore.setState({
            isHydrating: true,
        });

        const { toJSON } = render(<IndexRoute />);

        expect(toJSON()).toBeNull();
    });

    it("redirects unauthenticated users to welcome", () => {
        const { getByText } = render(<IndexRoute />);

        expect(getByText("Redirecting to /welcome")).toBeTruthy();
    });

    it("redirects authenticated users to the tabs", () => {
        useAuthStore.setState({
            isHydrating: false,
            isAuthenticated: true,
        });

        const { getByText } = render(<IndexRoute />);

        expect(getByText("Redirecting to /(tabs)")).toBeTruthy();
    });
});