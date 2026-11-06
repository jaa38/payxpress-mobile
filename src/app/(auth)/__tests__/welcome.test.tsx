
import {
    act,
    fireEvent,
    render,
    screen,
} from "@testing-library/react-native";
import React from "react";
import { Animated } from "react-native";

import WelcomeScreen from "../welcome";

const mockRouterPush = jest.fn();

jest.mock("expo-router", () => ({
    router: {
        push: (...args: unknown[]) => mockRouterPush(...args),
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
                },
            },
            border: {
                default: "#DDDDDD",
            },
        },
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
    const {
        Pressable,
        Text,
    } = require("react-native");

    return {
        Button: ({
            title,
            onPress,
        }: {
            title: string;
            onPress?: () => void;
        }) =>
            React.createElement(
                Pressable,
                {
                    accessibilityRole: "button",
                    accessibilityLabel: title,
                    onPress,
                },
                React.createElement(Text, null, title),
            ),
    };
});

describe("WelcomeScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    describe("Rendering", () => {
        it("renders the Easy onboarding slide", () => {
            render(<WelcomeScreen />);

            expect(screen.getByText("Easy")).toBeTruthy();

            expect(
                screen.getByText(
                    "Enjoy seamless access to our multiple products by signing up just once.",
                ),
            ).toBeTruthy();
        });

        it("renders the Fast onboarding slide", () => {
            render(<WelcomeScreen />);

            expect(screen.getByText("Fast")).toBeTruthy();

            expect(
                screen.getByText(
                    "Buy airtime and pay for subscription all on one platform.",
                ),
            ).toBeTruthy();
        });

        it("renders the Secure onboarding slide", () => {
            render(<WelcomeScreen />);

            expect(screen.getByText("Secure")).toBeTruthy();

            expect(
                screen.getByText(
                    "Easy, fast and secure way to make and receive payments anywhere.",
                ),
            ).toBeTruthy();
        });

        it("renders all three onboarding slides", () => {
            render(<WelcomeScreen />);

            expect(screen.getByText("Easy")).toBeTruthy();
            expect(screen.getByText("Fast")).toBeTruthy();
            expect(screen.getByText("Secure")).toBeTruthy();
        });

        it("renders the PayXpress logo", () => {
            render(<WelcomeScreen />);

            expect(
                screen.getByLabelText("PayXpress"),
            ).toBeTruthy();
        });

        it("renders the onboarding illustrations", () => {
            render(<WelcomeScreen />);

            expect(
                screen.getByLabelText("Easy PayXpress illustration"),
            ).toBeTruthy();

            expect(
                screen.getByLabelText("Fast PayXpress illustration"),
            ).toBeTruthy();

            expect(
                screen.getByLabelText("Secure PayXpress illustration"),
            ).toBeTruthy();
        });

        it("renders the CBN licensing logo", () => {
            render(<WelcomeScreen />);

            expect(
                screen.getByLabelText("Central Bank of Nigeria"),
            ).toBeTruthy();
        });

        it("renders the CBN licensing statement", () => {
            render(<WelcomeScreen />);

            expect(
                screen.getByText(/Licensed by the/),
            ).toBeTruthy();

            expect(
                screen.getByLabelText("Central Bank of Nigeria"),
            ).toBeTruthy();
        });
    });

    describe("Navigation", () => {
        it("renders the Login button", () => {
            render(<WelcomeScreen />);

            expect(
                screen.getByRole("button", { name: "Login" }),
            ).toBeTruthy();
        });

        it("navigates to the login screen when Login is pressed", () => {
            render(<WelcomeScreen />);

            fireEvent.press(
                screen.getByRole("button", { name: "Login" }),
            );

            expect(mockRouterPush).toHaveBeenCalledWith("/login");
        });

        it("renders the Register button", () => {
            render(<WelcomeScreen />);

            expect(
                screen.getByRole("button", { name: "Register" }),
            ).toBeTruthy();
        });

        it("navigates to registration when Register is pressed", () => {
            render(<WelcomeScreen />);

            fireEvent.press(
                screen.getByRole("button", { name: "Register" }),
            );

            expect(mockRouterPush).toHaveBeenCalledWith("/register");
        });

        it("does not navigate when the buttons have not been pressed", () => {
            render(<WelcomeScreen />);

            expect(mockRouterPush).not.toHaveBeenCalled();
        });
    });

    describe("Carousel animation", () => {
        it("waits 2800ms before starting the first slide animation", () => {
            jest.useFakeTimers();

            const timingSpy = jest
                .spyOn(Animated, "timing")
                .mockImplementation(() => ({
                    start: jest.fn(),
                    stop: jest.fn(),
                    reset: jest.fn(),
                }) as Animated.CompositeAnimation);

            render(<WelcomeScreen />);

            act(() => {
                jest.advanceTimersByTime(2799);
            });

            expect(timingSpy).not.toHaveBeenCalled();

            act(() => {
                jest.advanceTimersByTime(1);
            });

            expect(timingSpy).toHaveBeenCalledTimes(1);
        });

        it("uses the configured animation duration and native driver", () => {
            jest.useFakeTimers();

            const timingSpy = jest
                .spyOn(Animated, "timing")
                .mockImplementation(() => ({
                    start: jest.fn(),
                    stop: jest.fn(),
                    reset: jest.fn(),
                }) as Animated.CompositeAnimation);

            render(<WelcomeScreen />);

            act(() => {
                jest.advanceTimersByTime(2800);
            });

            expect(timingSpy).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    duration: 700,
                    useNativeDriver: true,
                }),
            );
        });

        it("animates towards the next slide", () => {
            jest.useFakeTimers();

            const timingSpy = jest
                .spyOn(Animated, "timing")
                .mockImplementation(() => ({
                    start: jest.fn(),
                    stop: jest.fn(),
                    reset: jest.fn(),
                }) as Animated.CompositeAnimation);

            render(<WelcomeScreen />);

            act(() => {
                jest.advanceTimersByTime(2800);
            });

            const animationConfig = timingSpy.mock.calls[0][1];

            expect(Number(animationConfig.toValue)).toBeLessThan(0);
        });

        it("advances through all slides and loops back to the first slide", () => {
            jest.useFakeTimers();

            const animationTargets: number[] = [];

            const timingSpy = jest
                .spyOn(Animated, "timing")
                .mockImplementation((_value, config) => ({
                    start: (callback) => {
                        animationTargets.push(Number(config.toValue));

                        callback?.({ finished: true });
                    },
                    stop: jest.fn(),
                    reset: jest.fn(),
                }) as Animated.CompositeAnimation);

            render(<WelcomeScreen />);

            act(() => {
                jest.advanceTimersByTime(2800);
            });

            expect(timingSpy).toHaveBeenCalledTimes(1);

            act(() => {
                jest.advanceTimersByTime(2800);
            });

            expect(timingSpy).toHaveBeenCalledTimes(2);

            act(() => {
                jest.advanceTimersByTime(2800);
            });

            expect(timingSpy).toHaveBeenCalledTimes(3);

            expect(animationTargets[0]).toBeLessThan(0);

            expect(animationTargets[1]).toBe(
                animationTargets[0] * 2,
            );

            expect(Math.abs(animationTargets[2])).toBe(0);
        });

        it("stops the active animation when the screen unmounts", () => {
            jest.useFakeTimers();

            const mockStop = jest.fn();

            jest.spyOn(Animated, "timing").mockImplementation(() => ({
                start: jest.fn(),
                stop: mockStop,
                reset: jest.fn(),
            }) as Animated.CompositeAnimation);

            const { unmount } = render(<WelcomeScreen />);

            act(() => {
                jest.advanceTimersByTime(2800);
            });

            unmount();

            expect(mockStop).toHaveBeenCalled();
        });

        it("clears the pending carousel timer when the screen unmounts", () => {
            jest.useFakeTimers();

            const clearTimeoutSpy = jest.spyOn(globalThis, "clearTimeout");

            const { unmount } = render(<WelcomeScreen />);

            expect(jest.getTimerCount()).toBeGreaterThan(0);

            unmount();

            expect(clearTimeoutSpy).toHaveBeenCalled();

            clearTimeoutSpy.mockRestore();
        });

        it("does not start another animation after unmounting", () => {
            jest.useFakeTimers();

            const timingSpy = jest
                .spyOn(Animated, "timing")
                .mockImplementation(() => ({
                    start: jest.fn(),
                    stop: jest.fn(),
                    reset: jest.fn(),
                }) as Animated.CompositeAnimation);

            const { unmount } = render(<WelcomeScreen />);

            unmount();

            act(() => {
                jest.advanceTimersByTime(5600);
            });

            expect(timingSpy).not.toHaveBeenCalled();
        });
    });
});
