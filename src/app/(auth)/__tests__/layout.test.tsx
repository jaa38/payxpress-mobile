import { render } from "@testing-library/react-native";

import AuthLayout from "@/app/(auth)/_layout";
import { useAuthStore } from "@/store/auth-store";

jest.mock("expo-router", () => {
    const { Text } = require("react-native");

    return {
        Redirect: jest.fn(({ href }) => (
            <Text>Redirecting to {href}</Text>
        )),
        Stack: Object.assign(
            jest.fn(({ screenOptions }) => (
                <Text>
                    Auth stack: {String(screenOptions.headerShown)}
                </Text>
            )),
            {
                Screen: jest.fn(),
            },
        ),
    };
});

describe("AuthLayout", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useAuthStore.setState({
            user: null,
            isAuthenticated: false,
            isHydrating: false,
        });
    });

    it("renders nothing while authentication is hydrating", () => {
        useAuthStore.setState({
            isHydrating: true,
            isAuthenticated: false,
        });

        const { toJSON } = render(<AuthLayout />);

        expect(toJSON()).toBeNull();
    });

    it("renders the authentication stack for unauthenticated users", () => {
        const { getByText } = render(<AuthLayout />);

        expect(getByText("Auth stack: false")).toBeTruthy();
    });

    it("redirects authenticated users to the tabs", () => {
        useAuthStore.setState({
            isHydrating: false,
            isAuthenticated: true,
        });

        const { getByText } = render(<AuthLayout />);

        expect(getByText("Redirecting to /(tabs)")).toBeTruthy();
    });
});