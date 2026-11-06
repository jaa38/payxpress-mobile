
import {
    fireEvent,
    render,
    screen,
} from "@testing-library/react-native";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
} from "react-native";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/use-theme";

jest.mock("@/hooks/use-theme", () => ({
    useTheme: jest.fn(),
}));

const mockTheme = {
    action: {
        primary: {
            background: "#008A45",
            pressed: "#006B36",
            disabled: "#D9D9D9",
            disabledText: "#888888",
            text: "#FFFFFF",
        },
        secondary: {
            background: "#E8F5EE",
            pressed: "#D0EBDD",
            text: "#008A45",
        },
        tertiary: {
            background: "#FFFFFF",
            pressed: "#F2F7F4",
            border: "#008A45",
            text: "#008A45",
        },
        destructive: {
            background: "#D92D20",
            pressed: "#B42318",
            text: "#FFFFFF",
        },
    },
};

const mockedUseTheme = useTheme as jest.MockedFunction<
    typeof useTheme
>;

describe("Button", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedUseTheme.mockReturnValue({
            theme: mockTheme,
        } as ReturnType<typeof useTheme>);
    });

    describe("Rendering", () => {
        it("renders the button title", () => {
            render(<Button title="Continue" />);

            expect(screen.getByText("Continue")).toBeTruthy();
        });

        it("renders with the default primary variant", () => {
            render(<Button title="Continue" />);

            const button = screen.getByRole("button", {
                name: "Continue",
            });

            const styles = StyleSheet.flatten(button.props.style);

            expect(styles.backgroundColor).toBe(
                mockTheme.action.primary.background,
            );
        });

        it("renders with the default medium size", () => {
            render(<Button title="Continue" />);

            const button = screen.getByRole("button", {
                name: "Continue",
            });

            const styles = StyleSheet.flatten(button.props.style);

            expect(styles.height).toBe(48);
            expect(styles.paddingVertical).toBe(12);
            expect(styles.paddingHorizontal).toBe(16);
        });

        it("renders the left icon when provided", () => {
            render(
                <Button
                    title="Continue"
                    leftIcon={<Text>LeftIcon</Text>}
                />,
            );

            expect(screen.getByText("LeftIcon")).toBeTruthy();
        });

        it("renders the right icon when provided", () => {
            render(
                <Button
                    title="Continue"
                    rightIcon={<Text>RightIcon</Text>}
                />,
            );

            expect(screen.getByText("RightIcon")).toBeTruthy();
        });

        it("renders both icons when provided", () => {
            render(
                <Button
                    title="Continue"
                    leftIcon={<Text>LeftIcon</Text>}
                    rightIcon={<Text>RightIcon</Text>}
                />,
            );

            expect(screen.getByText("LeftIcon")).toBeTruthy();
            expect(screen.getByText("RightIcon")).toBeTruthy();
        });
    });

    describe("Variants", () => {
        it("applies primary variant styles", () => {
            render(
                <Button title="Continue" variant="primary" />,
            );

            const button = screen.getByRole("button");
            const styles = StyleSheet.flatten(button.props.style);

            expect(styles.backgroundColor).toBe(
                mockTheme.action.primary.background,
            );
        });

        it("applies secondary variant styles", () => {
            render(
                <Button title="Continue" variant="secondary" />,
            );

            const button = screen.getByRole("button");
            const styles = StyleSheet.flatten(button.props.style);

            expect(styles.backgroundColor).toBe(
                mockTheme.action.secondary.background,
            );
        });

        it("applies tertiary variant styles", () => {
            render(
                <Button title="Continue" variant="tertiary" />,
            );

            const button = screen.getByRole("button");
            const styles = StyleSheet.flatten(button.props.style);

            expect(styles.backgroundColor).toBe(
                mockTheme.action.tertiary.background,
            );
            expect(styles.borderWidth).toBe(1);
            expect(styles.borderColor).toBe(
                mockTheme.action.tertiary.border,
            );
        });

        it("applies destructive variant styles", () => {
            render(
                <Button title="Delete" variant="destructive" />,
            );

            const button = screen.getByRole("button");
            const styles = StyleSheet.flatten(button.props.style);

            expect(styles.backgroundColor).toBe(
                mockTheme.action.destructive.background,
            );
        });
    });

    describe("Sizes", () => {
        it("applies large size styles", () => {
            render(
                <Button title="Continue" size="large" />,
            );

            const button = screen.getByRole("button");
            const styles = StyleSheet.flatten(button.props.style);

            expect(styles.height).toBe(56);
            expect(styles.paddingVertical).toBe(16);
            expect(styles.paddingHorizontal).toBe(20);
        });

        it("applies medium size styles", () => {
            render(
                <Button title="Continue" size="medium" />,
            );

            const button = screen.getByRole("button");
            const styles = StyleSheet.flatten(button.props.style);

            expect(styles.height).toBe(48);
            expect(styles.paddingVertical).toBe(12);
            expect(styles.paddingHorizontal).toBe(16);
        });

        it("applies small size styles", () => {
            render(
                <Button title="Continue" size="small" />,
            );

            const button = screen.getByRole("button");
            const styles = StyleSheet.flatten(button.props.style);

            expect(styles.height).toBe(40);
            expect(styles.paddingVertical).toBe(8);
            expect(styles.paddingHorizontal).toBe(12);
        });
    });

    describe("Interactions", () => {
        it("calls onPress when pressed", () => {
            const onPress = jest.fn();

            render(
                <Button
                    title="Continue"
                    onPress={onPress}
                />,
            );

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            );

            expect(onPress).toHaveBeenCalledTimes(1);
        });

        it("does not call onPress when disabled", () => {
            const onPress = jest.fn();

            render(
                <Button
                    title="Continue"
                    disabled
                    onPress={onPress}
                />,
            );

            const button = screen.getByRole("button", {
                name: "Continue",
            });

            expect(button.props.accessibilityState.disabled).toBe(true);

            fireEvent.press(button);

            expect(onPress).not.toHaveBeenCalled();
        });

        it("does not call onPress when loading", () => {
            const onPress = jest.fn();

            render(
                <Button
                    title="Continue"
                    loading
                    onPress={onPress}
                />,
            );

            const button = screen.getByRole("button", {
                name: "Continue loading",
            });

            expect(button.props.accessibilityState.disabled).toBe(true);

            fireEvent.press(button);

            expect(onPress).not.toHaveBeenCalled();
        });
    });

    describe("Loading state", () => {
        it("renders an activity indicator when loading", () => {
            const { UNSAFE_getByType } = render(
                <Button
                    title="Continue"
                    loading
                />,
            );

            expect(
                UNSAFE_getByType(ActivityIndicator),
            ).toBeTruthy();

            expect(screen.queryByText("Continue")).toBeNull();
        });

        it("uses the loading accessibility label", () => {
            render(
                <Button
                    title="Continue"
                    loading
                />,
            );

            expect(
                screen.getByRole("button", {
                    name: "Continue loading",
                }),
            ).toBeTruthy();
        });

        it("sets the busy accessibility state when loading", () => {
            render(
                <Button
                    title="Continue"
                    loading
                />,
            );

            const button = screen.getByRole("button", {
                name: "Continue loading",
            });

            expect(button.props.accessibilityState).toEqual({
                disabled: true,
                busy: true,
            });
        });
    });

    describe("Disabled state", () => {
        it("applies disabled styles", () => {
            render(
                <Button
                    title="Continue"
                    disabled
                />,
            );

            const button = screen.getByRole("button");
            const styles = StyleSheet.flatten(button.props.style);

            expect(styles.backgroundColor).toBe(
                mockTheme.action.primary.disabled,
            );
        });

        it("applies a border to a disabled tertiary button", () => {
            render(
                <Button
                    title="Continue"
                    variant="tertiary"
                    disabled
                />,
            );

            const button = screen.getByRole("button");
            const styles = StyleSheet.flatten(button.props.style);

            expect(styles.borderWidth).toBe(1);
            expect(styles.borderColor).toBe(
                mockTheme.action.tertiary.border,
            );
        });

        it("sets the disabled accessibility state", () => {
            render(
                <Button
                    title="Continue"
                    disabled
                />,
            );

            const button = screen.getByRole("button");

            expect(button.props.accessibilityState).toEqual({
                disabled: true,
                busy: false,
            });
        });
    });

    describe("Custom styles", () => {
        it("applies custom styles to the button", () => {
            render(
                <Button
                    title="Continue"
                    style={{ width: "100%", marginTop: 12 }}
                />,
            );

            const button = screen.getByRole("button");
            const styles = StyleSheet.flatten(button.props.style);

            expect(styles.width).toBe("100%");
            expect(styles.marginTop).toBe(12);
        });
    });

    describe("Accessibility", () => {
        it("uses the button accessibility role", () => {
            render(<Button title="Continue" />);

            expect(
                screen.getByRole("button", {
                    name: "Continue",
                }),
            ).toBeTruthy();
        });

        it("uses the title as the accessibility label", () => {
            render(<Button title="Make Payment" />);

            expect(
                screen.getByLabelText("Make Payment"),
            ).toBeTruthy();
        });
    });
});
