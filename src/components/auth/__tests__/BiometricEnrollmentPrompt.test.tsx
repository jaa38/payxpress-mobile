
import {
    fireEvent,
    render,
    screen,
} from "@testing-library/react-native";
import { Modal } from "react-native";

import { BiometricEnrollmentPrompt } from "../BiometricEnrollmentPrompt";

const mockOnEnable = jest.fn();
const mockOnSkip = jest.fn();

jest.mock("@/hooks/use-theme", () => ({
    useTheme: () => ({
        theme: {
            overlay: {
                background: "rgba(0, 0, 0, 0.5)",
            },
            background: {
                surface: "#FFFFFF",
                subtle: "#F5F5F5",
            },
            action: {
                tertiary: {
                    background: "#EEEEEE",
                },
            },
            icon: {
                primary: "#000000",
                success: "#008000",
            },
        },
    }),
}));

jest.mock("@expo/vector-icons", () => {
    const React = require("react");
    const { Text } = require("react-native");

    return {
        Ionicons: ({ name }: { name: string }) =>
            React.createElement(Text, null, name),
    };
});

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
        ActivityIndicator,
    } = require("react-native");

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
                    accessibilityLabel: loading
                        ? `${title} loading`
                        : title,
                    accessibilityState: {
                        disabled: Boolean(disabled || loading),
                        busy: Boolean(loading),
                    },
                    disabled: Boolean(disabled || loading),
                    onPress,
                },
                loading
                    ? React.createElement(ActivityIndicator)
                    : React.createElement(Text, null, title),
            ),
    };
});

describe("BiometricEnrollmentPrompt", () => {
    const renderPrompt = (
        props: Partial<
            React.ComponentProps<typeof BiometricEnrollmentPrompt>
        > = {},
    ) =>
        render(
            <BiometricEnrollmentPrompt
                visible
                onEnable={mockOnEnable}
                onSkip={mockOnSkip}
                {...props}
            />,
        );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("renders the prompt with the default biometric name", () => {
            renderPrompt();

            expect(
                screen.getAllByText("Enable Face ID"),
            ).toHaveLength(2);
        });

        it("renders a custom biometric name", () => {
            renderPrompt({
                biometricName: "Fingerprint",
            });

            expect(
                screen.getAllByText("Enable Fingerprint"),
            ).toHaveLength(2);
        });

        it("renders the biometric sign-in description", () => {
            renderPrompt();

            expect(
                screen.getByText(
                    "Sign in to PayXpress quickly and securely using Face ID on this device.",
                ),
            ).toBeTruthy();
        });

        it("renders the security information heading", () => {
            renderPrompt();

            expect(
                screen.getByText("Your security matters"),
            ).toBeTruthy();
        });

        it("explains that biometric information stays protected on the device", () => {
            renderPrompt();

            expect(
                screen.getByText(
                    "Your biometric information stays protected on your device. PayXpress does not store your face or fingerprint data.",
                ),
            ).toBeTruthy();
        });

        it("renders the scan biometric icon", () => {
            renderPrompt();

            expect(
                screen.getByText("scan-outline"),
            ).toBeTruthy();
        });

        it("renders the security icon", () => {
            renderPrompt();

            expect(
                screen.getByText("shield-checkmark-outline"),
            ).toBeTruthy();
        });

        it("renders the Enable button", () => {
            renderPrompt();

            expect(
                screen.getByRole("button", {
                    name: "Enable Face ID",
                }),
            ).toBeTruthy();
        });

        it("renders the Maybe later action", () => {
            renderPrompt();

            expect(
                screen.getByText("Maybe later"),
            ).toBeTruthy();
        });
    });

    describe("Modal configuration", () => {
        it("renders a visible modal", () => {
            const { UNSAFE_getByType } = renderPrompt();

            const modal = UNSAFE_getByType(Modal);

            expect(modal.props.visible).toBe(true);
        });

        it("configures the modal with a transparent background", () => {
            const { UNSAFE_getByType } = renderPrompt();

            const modal = UNSAFE_getByType(Modal);

            expect(modal.props.transparent).toBe(true);
        });

        it("uses a fade animation", () => {
            const { UNSAFE_getByType } = renderPrompt();

            const modal = UNSAFE_getByType(Modal);

            expect(modal.props.animationType).toBe("fade");
        });

        it("uses a translucent status bar", () => {
            const { UNSAFE_getByType } = renderPrompt();

            const modal = UNSAFE_getByType(Modal);

            expect(modal.props.statusBarTranslucent).toBe(true);
        });

        it("calls onSkip when the modal requests to close", () => {
            const { UNSAFE_getByType } = renderPrompt();

            const modal = UNSAFE_getByType(Modal);

            modal.props.onRequestClose();

            expect(mockOnSkip).toHaveBeenCalledTimes(1);
        });
    });

    describe("Enable action", () => {
        it("calls onEnable when Enable is pressed", () => {
            renderPrompt();

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Enable Face ID",
                }),
            );

            expect(mockOnEnable).toHaveBeenCalledTimes(1);
        });

        it("uses the custom biometric name on the Enable button", () => {
            renderPrompt({
                biometricName: "Touch ID",
            });

            expect(
                screen.getByRole("button", {
                    name: "Enable Touch ID",
                }),
            ).toBeTruthy();
        });
    });

    describe("Skip action", () => {
        it("calls onSkip when Maybe later is pressed", () => {
            renderPrompt();

            fireEvent.press(
                screen.getByText("Maybe later"),
            );

            expect(mockOnSkip).toHaveBeenCalledTimes(1);
        });
    });

    describe("Loading state", () => {
        it("shows the loading state on the Enable button", () => {
            renderPrompt({
                loading: true,
            });

            expect(
                screen.getByRole("button", {
                    name: "Enable Face ID loading",
                }),
            ).toBeTruthy();
        });

        it("disables the Enable button while loading", () => {
            renderPrompt({
                loading: true,
            });

            expect(
                screen.getByRole("button", {
                    name: "Enable Face ID loading",
                }),
            ).toBeDisabled();
        });

        it("disables Maybe later while loading", () => {
            renderPrompt({
                loading: true,
            });

            fireEvent.press(
                screen.getByText("Maybe later"),
            );

            expect(mockOnSkip).not.toHaveBeenCalled();
        });

        it("does not call onEnable while loading", () => {
            renderPrompt({
                loading: true,
            });

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Enable Face ID loading",
                }),
            );

            expect(mockOnEnable).not.toHaveBeenCalled();
        });

        it("does not call onSkip while loading", () => {
            renderPrompt({
                loading: true,
            });

            fireEvent.press(
                screen.getByText("Maybe later"),
            );

            expect(mockOnSkip).not.toHaveBeenCalled();
        });
    });
});
