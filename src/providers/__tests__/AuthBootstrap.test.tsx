
import { render } from "@testing-library/react-native";
import { Text } from "react-native";

import { AuthBootstrap } from "@/providers/AuthBootstrap";
import { hydrateAuth } from "@/services/auth/auth-hydration";

jest.mock("@/services/auth/auth-hydration", () => ({
    hydrateAuth: jest.fn(),
}));

const mockedHydrateAuth = jest.mocked(hydrateAuth);

describe("AuthBootstrap", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders its children", () => {
        const { getByText } = render(
            <AuthBootstrap>
                <Text>PayXpress application</Text>
            </AuthBootstrap>,
        );

        expect(getByText("PayXpress application")).toBeTruthy();
    });

    it("hydrates authentication when mounted", () => {
        render(
            <AuthBootstrap>
                <Text>PayXpress application</Text>
            </AuthBootstrap>,
        );

        expect(mockedHydrateAuth).toHaveBeenCalledTimes(1);
    });

    it("does not trigger hydration again when rerendered", () => {
        const { rerender } = render(
            <AuthBootstrap>
                <Text>PayXpress application</Text>
            </AuthBootstrap>,
        );

        rerender(
            <AuthBootstrap>
                <Text>PayXpress application</Text>
            </AuthBootstrap>,
        );

        expect(mockedHydrateAuth).toHaveBeenCalledTimes(1);
    });
});
