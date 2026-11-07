
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";

import { onboardingStorage } from "@/services/auth/onboarding-storage";
import FirstTimeGuidanceScreen from "../first-time-guidance";

const mockRouterReplace = jest.fn();

jest.mock("expo-router", () => ({
    router: {
        replace: (...args: unknown[]) => mockRouterReplace(...args),
    },
}));

jest.mock("@/services/auth/onboarding-storage", () => ({
    onboardingStorage: {
        markCompleted: jest.fn(),
    },
}));

jest.mock("@/hooks/use-theme", () => ({
    useTheme: () => ({
        theme: {
            background: {
                surface: "#FFFFFF",
            },
            action: {
                primary: {
                    background: "#008000",
                    text: "#FFFFFF",
                },
            },
            border: {
                default: "#DDDDDD",
            },
        },
        isDark: false,
    }),
}));

jest.mock("@/components/ui/AppText", () => {
    const React = require("react");
    const { Text } = require("react-native");

    return {
        AppText: ({
            children,
            ...props
        }: {
            children: React.ReactNode;
            [key: string]: unknown;
        }) => React.createElement(Text, props, children),
    };
});

jest.mock("@/components/ui/Button", () => {
    const React = require("react");
    const { Pressable, Text } = require("react-native");

    return {
        Button: ({
            title,
            onPress,
            disabled,
            loading,
        }: {
            title: string;
            onPress?: () => void;
            disabled?: boolean;
            loading?: boolean;
        }) =>
            React.createElement(
                Pressable,
                {
                    accessibilityRole: "button",
                    accessibilityLabel: title,
                    onPress,
                    disabled,
                },
                React.createElement(Text, null, loading ? "Loading" : title),
            ),
    };
});

jest.mock("@expo/vector-icons", () => {
    const React = require("react");
    const { Text } = require("react-native");

    return {
        Ionicons: () => React.createElement(Text, null, "Icon"),
    };
});

const mockedMarkCompleted = jest.mocked(
    onboardingStorage.markCompleted,
);

describe("FirstTimeGuidanceScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedMarkCompleted.mockResolvedValue(undefined);
    });

    describe("Rendering", () => {
        it("renders the first guidance slide", () => {
            render(<FirstTimeGuidanceScreen />);

            expect(
                screen.getByText("Your wallet, all in one place"),
            ).toBeTruthy();

            expect(
                screen.getByText(
                    "Manage your PayXpress wallet and keep track of your available funds.",
                ),
            ).toBeTruthy();
        });

        it("displays the initial progress indicator", () => {
            render(<FirstTimeGuidanceScreen />);

            expect(screen.getByText("Step 1 of 3")).toBeTruthy();
        });

        it("renders the Skip button on the first slide", () => {
            render(<FirstTimeGuidanceScreen />);

            expect(
                screen.getByRole("button", { name: "Skip onboarding" }),
            ).toBeTruthy();
        });

        it("renders the Next button", () => {
            render(<FirstTimeGuidanceScreen />);

            expect(
                screen.getByRole("button", { name: "Next" }),
            ).toBeTruthy();
        });
    });

    describe("Slide navigation", () => {
        it("moves to the second slide when Next is pressed", () => {
            render(<FirstTimeGuidanceScreen />);

            fireEvent.press(
                screen.getByRole("button", { name: "Next" }),
            );

            expect(
                screen.getByText("Everyday payments made easy"),
            ).toBeTruthy();

            expect(screen.getByText("Step 2 of 3")).toBeTruthy();
        });

        it("moves to the third slide", () => {
            render(<FirstTimeGuidanceScreen />);

            fireEvent.press(
                screen.getByRole("button", { name: "Next" }),
            );

            fireEvent.press(
                screen.getByRole("button", { name: "Next" }),
            );

            expect(
                screen.getByText("Stay in control of your money"),
            ).toBeTruthy();

            expect(screen.getByText("Step 3 of 3")).toBeTruthy();
        });

        it("displays Get Started on the final slide", () => {
            render(<FirstTimeGuidanceScreen />);

            fireEvent.press(
                screen.getByRole("button", { name: "Next" }),
            );

            fireEvent.press(
                screen.getByRole("button", { name: "Next" }),
            );

            expect(
                screen.getByRole("button", { name: "Get Started" }),
            ).toBeTruthy();
        });

        it("allows users to navigate backwards", () => {
            render(<FirstTimeGuidanceScreen />);

            fireEvent.press(
                screen.getByRole("button", { name: "Next" }),
            );

            fireEvent.press(
                screen.getByRole("button", { name: "Back" }),
            );

            expect(
                screen.getByText("Your wallet, all in one place"),
            ).toBeTruthy();

            expect(screen.getByText("Step 1 of 3")).toBeTruthy();
        });

        it("does not display Back on the first slide", () => {
            render(<FirstTimeGuidanceScreen />);

            expect(
                screen.queryByRole("button", { name: "Back" }),
            ).toBeNull();
        });
    });

    describe("Onboarding completion", () => {
        it("marks onboarding as completed when Skip is pressed", async () => {
            render(<FirstTimeGuidanceScreen />);

            fireEvent.press(
                screen.getByRole("button", { name: "Skip onboarding" }),
            );

            await waitFor(() => {
                expect(mockedMarkCompleted).toHaveBeenCalledTimes(1);
                expect(mockRouterReplace).toHaveBeenCalledWith("/(tabs)");
            });
        });

        it("marks onboarding as completed when Get Started is pressed", async () => {
            render(<FirstTimeGuidanceScreen />);

            fireEvent.press(
                screen.getByRole("button", { name: "Next" }),
            );

            fireEvent.press(
                screen.getByRole("button", { name: "Next" }),
            );

            fireEvent.press(
                screen.getByRole("button", { name: "Get Started" }),
            );

            await waitFor(() => {
                expect(mockedMarkCompleted).toHaveBeenCalledTimes(1);
                expect(mockRouterReplace).toHaveBeenCalledWith("/(tabs)");
            });
        });

        it("does not navigate when onboarding completion fails", async () => {
            mockedMarkCompleted.mockRejectedValue(
                new Error("Storage unavailable"),
            );

            render(<FirstTimeGuidanceScreen />);

            fireEvent.press(
                screen.getByRole("button", { name: "Skip onboarding" }),
            );

            expect(
                await screen.findByText(
                    "We couldn't save your onboarding progress. Please try again.",
                ),
            ).toBeTruthy();

            expect(mockRouterReplace).not.toHaveBeenCalled();
        });

        it("does not save onboarding completion during ordinary slide navigation", () => {
            render(<FirstTimeGuidanceScreen />);

            fireEvent.press(
                screen.getByRole("button", { name: "Next" }),
            );

            expect(mockedMarkCompleted).not.toHaveBeenCalled();
            expect(mockRouterReplace).not.toHaveBeenCalled();
        });
    });
});
