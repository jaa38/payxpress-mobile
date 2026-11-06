
import {
    fireEvent,
    render,
    screen,
} from "@testing-library/react-native";
import { TextInput } from "react-native";

import { OTPInput } from "@/components/ui/OTPInput";
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

const getOtpInputs = () => screen.UNSAFE_getAllByType(TextInput);

describe("OTPInput", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedUseTheme.mockReturnValue({
            theme: mockTheme,
        } as ReturnType<typeof useTheme>);
    });

    describe("Rendering", () => {
        it("renders six inputs by default", () => {
            render(<OTPInput />);

            expect(getOtpInputs()).toHaveLength(6);
        });

        it("renders the configured number of inputs", () => {
            render(<OTPInput length={4} />);

            expect(getOtpInputs()).toHaveLength(4);
        });

        it("renders the provided OTP value", () => {
            render(
                <OTPInput
                    length={4}
                    value="1234"
                />,
            );

            const inputs = getOtpInputs();

            expect(inputs).toHaveLength(4);
            expect(inputs[0].props.value).toBe("1");
            expect(inputs[1].props.value).toBe("2");
            expect(inputs[2].props.value).toBe("3");
            expect(inputs[3].props.value).toBe("4");
        });

        it("renders empty inputs when no value is provided", () => {
            render(<OTPInput length={4} />);

            const inputs = getOtpInputs();

            expect(inputs).toHaveLength(4);

            inputs.forEach((input) => {
                expect(input.props.value).toBe("");
            });
        });

        it("renders partially completed OTP values", () => {
            render(
                <OTPInput
                    length={4}
                    value="12"
                />,
            );

            const inputs = getOtpInputs();

            expect(inputs[0].props.value).toBe("1");
            expect(inputs[1].props.value).toBe("2");
            expect(inputs[2].props.value).toBe("");
            expect(inputs[3].props.value).toBe("");
        });
    });

    describe("Input sanitisation", () => {
        it("removes non-numeric characters from the provided value", () => {
            render(
                <OTPInput
                    length={4}
                    value="1a2b"
                />,
            );

            const inputs = getOtpInputs();

            expect(inputs[0].props.value).toBe("1");
            expect(inputs[1].props.value).toBe("2");
            expect(inputs[2].props.value).toBe("");
            expect(inputs[3].props.value).toBe("");
        });

        it("limits the provided value to the configured length", () => {
            render(
                <OTPInput
                    length={4}
                    value="123456"
                />,
            );

            const inputs = getOtpInputs();

            expect(inputs).toHaveLength(4);
            expect(inputs.map((input) => input.props.value)).toEqual([
                "1",
                "2",
                "3",
                "4",
            ]);
        });

        it("removes non-numeric characters when entering a digit", () => {
            const onChange = jest.fn();

            render(
                <OTPInput
                    length={4}
                    onChange={onChange}
                />,
            );

            fireEvent.changeText(getOtpInputs()[0], "a");

            expect(onChange).toHaveBeenCalledWith("");
        });
    });

    describe("Single digit entry", () => {
        it("calls onChange when a digit is entered", () => {
            const onChange = jest.fn();

            render(
                <OTPInput
                    length={4}
                    onChange={onChange}
                />,
            );

            fireEvent.changeText(getOtpInputs()[0], "1");

            expect(onChange).toHaveBeenCalledWith("1");
            expect(onChange).toHaveBeenCalledTimes(1);
        });

        it("preserves existing digits when another digit is entered", () => {
            const onChange = jest.fn();

            const { rerender } = render(
                <OTPInput
                    length={4}
                    value="1"
                    onChange={onChange}
                />,
            );

            fireEvent.changeText(getOtpInputs()[1], "2");

            expect(onChange).toHaveBeenCalledWith("12");

            rerender(
                <OTPInput
                    length={4}
                    value="12"
                    onChange={onChange}
                />,
            );

            expect(
                getOtpInputs().map((input) => input.props.value),
            ).toEqual(["1", "2", "", ""]);
        });

        it("replaces the digit at the selected position", () => {
            const onChange = jest.fn();

            render(
                <OTPInput
                    length={4}
                    value="123"
                    onChange={onChange}
                />,
            );

            fireEvent.changeText(getOtpInputs()[1], "9");

            expect(onChange).toHaveBeenCalledWith("193");
        });
    });

    describe("Paste support", () => {
        it("distributes pasted digits across the inputs", () => {
            const onChange = jest.fn();

            render(
                <OTPInput
                    length={4}
                    onChange={onChange}
                />,
            );

            fireEvent.changeText(getOtpInputs()[0], "1234");

            expect(onChange).toHaveBeenCalledWith("1234");
        });

        it("removes non-numeric characters from pasted text", () => {
            const onChange = jest.fn();

            render(
                <OTPInput
                    length={4}
                    onChange={onChange}
                />,
            );

            fireEvent.changeText(getOtpInputs()[0], "1a2b3c4d");

            expect(onChange).toHaveBeenCalledWith("1234");
        });

        it("truncates pasted digits to the configured length", () => {
            const onChange = jest.fn();

            render(
                <OTPInput
                    length={4}
                    onChange={onChange}
                />,
            );

            fireEvent.changeText(getOtpInputs()[0], "12345678");

            expect(onChange).toHaveBeenCalledWith("1234");
        });

        it("does not call onComplete when pasted OTP is incomplete", () => {
            const onChange = jest.fn();
            const onComplete = jest.fn();

            render(
                <OTPInput
                    length={6}
                    onChange={onChange}
                    onComplete={onComplete}
                />,
            );

            fireEvent.changeText(getOtpInputs()[0], "123");

            expect(onChange).toHaveBeenCalledWith("123");
            expect(onComplete).not.toHaveBeenCalled();
        });
    });

    describe("Completion", () => {
        it("calls onComplete when all digits are pasted", () => {
            const onChange = jest.fn();
            const onComplete = jest.fn();

            render(
                <OTPInput
                    length={4}
                    onChange={onChange}
                    onComplete={onComplete}
                />,
            );

            fireEvent.changeText(getOtpInputs()[0], "1234");

            expect(onChange).toHaveBeenCalledWith("1234");
            expect(onComplete).toHaveBeenCalledWith("1234");
            expect(onComplete).toHaveBeenCalledTimes(1);
        });

        it("calls onComplete when the final digit is entered", () => {
            const onChange = jest.fn();
            const onComplete = jest.fn();

            const { rerender } = render(
                <OTPInput
                    length={3}
                    value="12"
                    onChange={onChange}
                    onComplete={onComplete}
                />,
            );

            fireEvent.changeText(getOtpInputs()[2], "3");

            expect(onChange).toHaveBeenCalledWith("123");
            expect(onComplete).toHaveBeenCalledWith("123");

            rerender(
                <OTPInput
                    length={3}
                    value="123"
                    onChange={onChange}
                    onComplete={onComplete}
                />,
            );

            expect(getOtpInputs()).toHaveLength(3);
        });

        it("does not call onComplete when digits are incomplete", () => {
            const onComplete = jest.fn();

            render(
                <OTPInput
                    length={4}
                    value="12"
                    onComplete={onComplete}
                />,
            );

            fireEvent.changeText(getOtpInputs()[2], "3");

            expect(onComplete).not.toHaveBeenCalled();
        });

        it("works without optional callbacks", () => {
            render(
                <OTPInput length={4} />,
            );

            expect(() => {
                fireEvent.changeText(getOtpInputs()[0], "1");
            }).not.toThrow();
        });
    });

    describe("Backspace handling", () => {
        it("handles backspace on an empty input", () => {
            render(
                <OTPInput
                    length={4}
                    value="12"
                />,
            );

            expect(() => {
                fireEvent(getOtpInputs()[2], "keyPress", {
                    nativeEvent: {
                        key: "Backspace",
                    },
                });
            }).not.toThrow();
        });

        it("handles backspace on the first input", () => {
            render(
                <OTPInput
                    length={4}
                    value="12"
                />,
            );

            expect(() => {
                fireEvent(getOtpInputs()[0], "keyPress", {
                    nativeEvent: {
                        key: "Backspace",
                    },
                });
            }).not.toThrow();
        });
    });
});
