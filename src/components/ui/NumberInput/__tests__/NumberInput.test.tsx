
import {
    fireEvent,
    render,
    screen,
} from "@testing-library/react-native";
import { createRef } from "react";
import {
    StyleSheet,
    TextInput,
} from "react-native";

import { NumberInput } from "@/components/ui/NumberInput";
import { useTheme } from "@/hooks/use-theme";

jest.mock("@/hooks/use-theme", () => ({
    useTheme: jest.fn(),
}));

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

const getInputStyles = () => {
    const input = screen.getByTestId("number-input");

    return StyleSheet.flatten(input.props.style);
};

describe("NumberInput", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedUseTheme.mockReturnValue({
            theme: mockTheme,
        } as ReturnType<typeof useTheme>);
    });

    describe("Rendering", () => {
        it("renders the number input", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                />,
            );

            expect(screen.getByTestId("number-input")).toBeTruthy();
        });

        it("renders the current value", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value="5"
                    onChangeText={jest.fn()}
                />,
            );

            expect(screen.getByDisplayValue("5")).toBeTruthy();
        });

        it("renders the default placeholder", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                />,
            );

            expect(
                screen.getByPlaceholderText("-"),
            ).toBeTruthy();
        });

        it("uses number-pad keyboard type", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                />,
            );

            expect(
                screen.getByTestId("number-input").props.keyboardType,
            ).toBe("number-pad");
        });

        it("limits input to one character", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                />,
            );

            expect(
                screen.getByTestId("number-input").props.maxLength,
            ).toBe(1);
        });

        it("centres the input text", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                />,
            );

            expect(
                screen.getByTestId("number-input").props.textAlign,
            ).toBe("center");
        });

        it("uses the default editable state", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                />,
            );

            expect(
                screen.getByTestId("number-input").props.editable,
            ).toBe(true);
        });
    });

    describe("Input styles", () => {
        it("applies the default border and background styles", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                />,
            );

            const styles = getInputStyles();

            expect(styles.borderColor).toBe(
                mockTheme.input.border,
            );
            expect(styles.backgroundColor).toBe(
                mockTheme.input.background,
            );
        });

        it("applies focus styles when focused", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                />,
            );

            fireEvent(
                screen.getByTestId("number-input"),
                "focus",
            );

            const styles = getInputStyles();

            expect(styles.borderColor).toBe(
                mockTheme.input.focusBorder,
            );
            expect(styles.backgroundColor).toBe(
                mockTheme.input.background,
            );
        });

        it("returns to default styles when blurred", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                />,
            );

            const input = screen.getByTestId("number-input");

            fireEvent(input, "focus");
            fireEvent(input, "blur");

            expect(getInputStyles().borderColor).toBe(
                mockTheme.input.border,
            );
        });

        it("applies error styles when error is true", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                    error
                />,
            );

            const styles = getInputStyles();

            expect(styles.borderColor).toBe(
                mockTheme.input.errorBorder,
            );
            expect(styles.backgroundColor).toBe(
                mockTheme.input.background,
            );
        });

        it("prioritises error styles over focus styles", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                    error
                />,
            );

            fireEvent(
                screen.getByTestId("number-input"),
                "focus",
            );

            expect(getInputStyles().borderColor).toBe(
                mockTheme.input.errorBorder,
            );
        });

        it("applies disabled styles when editable is false", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                    editable={false}
                />,
            );

            const styles = getInputStyles();

            expect(styles.borderColor).toBe(
                mockTheme.input.border,
            );
            expect(styles.backgroundColor).toBe(
                mockTheme.input.disabledBackground,
            );
        });

        it("prioritises disabled styles over error styles", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                    editable={false}
                    error
                />,
            );

            expect(getInputStyles().backgroundColor).toBe(
                mockTheme.input.disabledBackground,
            );
        });

        it("applies the expected dimensions", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                />,
            );

            const styles = getInputStyles();

            expect(styles.width).toBe(42);
            expect(styles.height).toBe(48);
            expect(styles.borderWidth).toBe(1);
        });
    });

    describe("Interactions", () => {
        it("calls onChangeText when text changes", () => {
            const onChangeText = jest.fn();

            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={onChangeText}
                />,
            );

            fireEvent.changeText(
                screen.getByTestId("number-input"),
                "7",
            );

            expect(onChangeText).toHaveBeenCalledWith("7");
            expect(onChangeText).toHaveBeenCalledTimes(1);
        });

        it("calls onFocus when focused", () => {
            const onFocus = jest.fn();

            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                    onFocus={onFocus}
                />,
            );

            fireEvent(
                screen.getByTestId("number-input"),
                "focus",
            );

            expect(onFocus).toHaveBeenCalledTimes(1);
        });

        it("calls onBlur when blurred", () => {
            const onBlur = jest.fn();

            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                    onBlur={onBlur}
                />,
            );

            fireEvent(
                screen.getByTestId("number-input"),
                "blur",
            );

            expect(onBlur).toHaveBeenCalledTimes(1);
        });
    });

    describe("TextInput props", () => {
        it("forwards editable", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                    editable={false}
                />,
            );

            expect(
                screen.getByTestId("number-input").props.editable,
            ).toBe(false);
        });

        it("forwards accessibility label", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                    accessibilityLabel="Verification digit one"
                />,
            );

            expect(
                screen.getByLabelText("Verification digit one"),
            ).toBeTruthy();
        });

        it("forwards accessibility hint", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                    accessibilityHint="Enter the first verification digit"
                />,
            );

            expect(
                screen.getByTestId("number-input").props.accessibilityHint,
            ).toBe("Enter the first verification digit");
        });

        it("applies custom styles", () => {
            render(
                <NumberInput
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                    style={{ width: 50, marginTop: 8 }}
                />,
            );

            const styles = getInputStyles();

            expect(styles.width).toBe(50);
            expect(styles.marginTop).toBe(8);
        });

        it("forwards a ref to the underlying TextInput", () => {
            const ref = createRef<TextInput>();

            render(
                <NumberInput
                    ref={ref}
                    testID="number-input"
                    value=""
                    onChangeText={jest.fn()}
                />,
            );

            expect(ref.current).toBeTruthy();
        });
    });
});
