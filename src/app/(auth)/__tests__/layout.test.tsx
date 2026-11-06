
import { render } from "@testing-library/react-native";

import AuthLayout from "@/app/(auth)/_layout";

jest.mock("expo-router", () => {
    const { Text } = require("react-native");

    return {
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
    it("renders the authentication stack", () => {
        const { getByText } = render(<AuthLayout />);

        expect(
            getByText("Auth stack: false"),
        ).toBeTruthy();
    });
});
