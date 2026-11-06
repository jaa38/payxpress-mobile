
import {
    fireEvent,
    render,
    screen,
} from "@testing-library/react-native";
import React, { createRef } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { Input } from "@/components/ui/Input";
import { useTheme } from "@/hooks/use-theme";

jest.mock("@/hooks/use-theme", () => ({
    useTheme: jest.fn(),
}));

jest.mock("@/components/ui/AppText", () => {
    const React = require("react");
    const { Text } = require("react-native");

    return {
        AppText: ({
            children,
            accessibilityRole,
            style,
        }: {
            children: React.ReactNode;
            accessibilityRole?: "alert" | "text";
            style?: object;
        }) => (
            <Text
                accessibilityRole={accessibilityRole}
                style={style}
            >
                {children}
            </Text>
        ),
    };
});

const mockTheme = {
    input: {
        background: "#FFFFFF",
        border: "#D0D5DD",
        focusBorder: "#008A45",
        errorBorder: "#D92D20",
        disabledBackground: "#F2F4F7",
        placeholder: "#98A2B3",
        text: "#101828",
    },
};

const mockedUseTheme = useTheme as jest.MockedFunction<
    typeof useTheme
>;

const getInputContainerStyles = () => {
    const views = screen.UNSAFE_getAllByType(View);

    return StyleSheet.flatten(views[1].props.style);
};

describe("Input", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedUseTheme.mockReturnValue({
            theme: mockTheme,
        } as ReturnType<typeof useTheme>);
    });

    describe("Rendering", () => {
        it("renders the input", () => {
            render(
                <Input
                    testID="input"
                    placeholder="Enter your name"
                />,
            );

            expect(screen.getByTestId("input")).toBeTruthy();
        });

        it("renders the label when provided", () => {
            render(
                <Input
                    testID="input"
                    label="Full name"
                />,
            );

            expect(screen.getByText("Full name")).toBeTruthy();
        });

        it("renders the placeholder", () => {
            render(
                <Input
                    testID="input"
                    placeholder="Enter your email"
                />,
            );

            expect(
                screen.getByPlaceholderText("Enter your email"),
            ).toBeTruthy();
        });

        it("renders the current value", () => {
            render(
                <Input
                    testID="input"
                    value="John Doe"
                />,
            );

            expect(screen.getByDisplayValue("John Doe")).toBeTruthy();
        });

        it("uses the default input variant", () => {
            render(<Input testID="input" />);

            const input = screen.getByTestId("input");

            expect(input.props.multiline).toBe(false);
            expect(input.props.textAlignVertical).toBe("center");
        });

        it("uses the default editable state", () => {
            render(<Input testID="input" />);

            expect(
                screen.getByTestId("input").props.editable,
            ).toBe(true);
        });
    });

    describe("Labels", () => {
        it("renders the required indicator", () => {
            render(
                <Input
                    testID="input"
                    label="Email"
                    required
                />,
            );

            expect(screen.getByText(" *")).toBeTruthy();
        });

        it("renders the optional indicator", () => {
            render(
                <Input
                    testID="input"
                    label="Middle name"
                    optional
                />,
            );

            expect(screen.getByText("(Optional)")).toBeTruthy();
        });

        it("renders the character count when maxLength is provided", () => {
            render(
                <Input
                    testID="input"
                    label="Username"
                    value="jeremiah"
                    maxLength={20}
                />,
            );

            expect(screen.getByText("8/20")).toBeTruthy();
        });

        it("shows zero characters when no value is provided", () => {
            render(
                <Input
                    testID="input"
                    label="Username"
                    maxLength={20}
                />,
            );

            expect(screen.getByText("0/20")).toBeTruthy();
        });
    });

    describe("Input states", () => {
        it("applies default border and background styles", () => {
            render(<Input testID="input" />);

            const styles = getInputContainerStyles();

            expect(styles.borderColor).toBe(
                mockTheme.input.border,
            );
            expect(styles.backgroundColor).toBe(
                mockTheme.input.background,
            );
        });

        it("applies focus styles when focused", () => {
            render(<Input testID="input" />);

            fireEvent(screen.getByTestId("input"), "focus");

            const styles = getInputContainerStyles();

            expect(styles.borderColor).toBe(
                mockTheme.input.focusBorder,
            );
            expect(styles.backgroundColor).toBe(
                mockTheme.input.background,
            );
        });

        it("returns to default styles when blurred", () => {
            render(<Input testID="input" />);

            const input = screen.getByTestId("input");

            fireEvent(input, "focus");
            fireEvent(input, "blur");

            const styles = getInputContainerStyles();

            expect(styles.borderColor).toBe(
                mockTheme.input.border,
            );
        });

        it("applies error styles when an error is provided", () => {
            render(
                <Input
                    testID="input"
                    error="Invalid email address"
                />,
            );

            const styles = getInputContainerStyles();

            expect(styles.borderColor).toBe(
                mockTheme.input.errorBorder,
            );
        });

        it("prioritises error styles over focus styles", () => {
            render(
                <Input
                    testID="input"
                    error="Invalid email address"
                />,
            );

            const input = screen.getByTestId("input");

            fireEvent(input, "focus");

            expect(getInputContainerStyles().borderColor).toBe(
                mockTheme.input.errorBorder,
            );
        });

        it("applies disabled styles when editable is false", () => {
            render(
                <Input
                    testID="input"
                    editable={false}
                />,
            );

            const styles = getInputContainerStyles();

            expect(styles.borderColor).toBe(
                mockTheme.input.border,
            );
            expect(styles.backgroundColor).toBe(
                mockTheme.input.disabledBackground,
            );
        });
    });

    describe("Feedback", () => {
        it("renders helper text", () => {
            render(
                <Input
                    testID="input"
                    helperText="Enter your registered email"
                />,
            );

            expect(
                screen.getByText("Enter your registered email"),
            ).toBeTruthy();
        });

        it("renders error feedback", () => {
            render(
                <Input
                    testID="input"
                    error="This field is required"
                />,
            );

            expect(
                screen.getByText("This field is required"),
            ).toBeTruthy();
        });

        it("prioritises error feedback over helper text", () => {
            render(
                <Input
                    testID="input"
                    error="Invalid email"
                    helperText="Enter your registered email"
                />,
            );

            expect(screen.getByText("Invalid email")).toBeTruthy();

            expect(
                screen.queryByText("Enter your registered email"),
            ).toBeNull();
        });

        it("sets the error accessibility role to alert", () => {
            render(
                <Input
                    testID="input"
                    error="Invalid email"
                />,
            );

            expect(screen.getByRole("alert")).toBeTruthy();
        });
    });

    describe("Textarea", () => {
        it("enables multiline mode", () => {
            render(
                <Input
                    testID="input"
                    variant="textarea"
                />,
            );

            const input = screen.getByTestId("input");

            expect(input.props.multiline).toBe(true);
            expect(input.props.textAlignVertical).toBe("top");
        });

        it("applies textarea container styles", () => {
            render(
                <Input
                    testID="input"
                    variant="textarea"
                />,
            );

            const styles = getInputContainerStyles();

            expect(styles.height).toBe(120);
            expect(styles.alignItems).toBe("flex-start");
        });
    });

    describe("Elements", () => {
        it("renders the left element", () => {
            render(
                <Input
                    testID="input"
                    leftElement={<Text>Left element</Text>}
                />,
            );

            expect(screen.getByText("Left element")).toBeTruthy();
        });

        it("renders the right element", () => {
            render(
                <Input
                    testID="input"
                    rightElement={<Text>Right element</Text>}
                />,
            );

            expect(screen.getByText("Right element")).toBeTruthy();
        });

        it("renders the right icon", () => {
            render(
                <Input
                    testID="input"
                    rightIcon={<Text>Right icon</Text>}
                />,
            );

            expect(screen.getByText("Right icon")).toBeTruthy();
        });
    });

    describe("Interactions", () => {
        it("calls onFocus when focused", () => {
            const onFocus = jest.fn();

            render(
                <Input
                    testID="input"
                    onFocus={onFocus}
                />,
            );

            fireEvent(screen.getByTestId("input"), "focus");

            expect(onFocus).toHaveBeenCalledTimes(1);
        });

        it("calls onBlur when blurred", () => {
            const onBlur = jest.fn();

            render(
                <Input
                    testID="input"
                    onBlur={onBlur}
                />,
            );

            fireEvent(screen.getByTestId("input"), "blur");

            expect(onBlur).toHaveBeenCalledTimes(1);
        });
    });

    describe("Accessibility", () => {
        it("uses the label as the accessibility label", () => {
            render(
                <Input
                    testID="input"
                    label="Email address"
                />,
            );

            expect(
                screen.getByLabelText("Email address"),
            ).toBeTruthy();
        });

        it("uses the error as the accessibility hint", () => {
            render(
                <Input
                    testID="input"
                    label="Email"
                    error="Invalid email address"
                />,
            );

            expect(
                screen.getByTestId("input").props.accessibilityHint,
            ).toBe("Error. Invalid email address");
        });

        it("uses helper text as the accessibility hint", () => {
            render(
                <Input
                    testID="input"
                    helperText="Use your work email"
                />,
            );

            expect(
                screen.getByTestId("input").props.accessibilityHint,
            ).toBe("Use your work email");
        });

        it("sets the disabled accessibility state", () => {
            render(
                <Input
                    testID="input"
                    editable={false}
                />,
            );

            expect(
                screen.getByTestId("input").props.accessibilityState,
            ).toEqual({
                disabled: true,
            });
        });
    });

    describe("TextInput props and ref", () => {
        it("forwards keyboardType", () => {
            render(
                <Input
                    testID="input"
                    keyboardType="email-address"
                />,
            );

            expect(
                screen.getByTestId("input").props.keyboardType,
            ).toBe("email-address");
        });

        it("forwards secureTextEntry", () => {
            render(
                <Input
                    testID="input"
                    secureTextEntry
                />,
            );

            expect(
                screen.getByTestId("input").props.secureTextEntry,
            ).toBe(true);
        });

        it("forwards maxLength to TextInput", () => {
            render(
                <Input
                    testID="input"
                    maxLength={30}
                />,
            );

            expect(
                screen.getByTestId("input").props.maxLength,
            ).toBe(30);
        });

        it("forwards a ref to the underlying TextInput", () => {
            const ref = createRef<TextInput>();

            render(
                <Input
                    ref={ref}
                    testID="input"
                />,
            );

            expect(ref.current).toBeTruthy();
        });
    });
});
