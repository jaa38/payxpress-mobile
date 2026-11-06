
import {
    fireEvent,
    render,
    screen,
} from "@testing-library/react-native";
import React from "react";
import {
    StyleSheet
} from "react-native";

import { PhoneNumberInput } from "@/components/ui/PhoneInput";
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
            style,
        }: {
            children: React.ReactNode;
            style?: object;
        }) => <Text style={style}>{children}</Text>,
    };
});

jest.mock("react-native-country-picker-modal", () => {
    const React = require("react");
    const { View, Text, Pressable } = require("react-native");

    return {
        __esModule: true,
        default: ({
            visible,
            countryCode,
            onSelect,
            onClose,
        }: {
            visible: boolean;
            countryCode: string;
            onSelect: (country: {
                cca2: string;
                callingCode: string[];
                flag: string;
            }) => void;
            onClose: () => void;
        }) => (
            <View testID="country-picker">
                <Text testID="picker-visibility">
                    {visible ? "visible" : "hidden"}
                </Text>

                <Text testID="picker-country-code">
                    {countryCode}
                </Text>

                <Pressable
                    testID="select-country"
                    onPress={() =>
                        onSelect({
                            cca2: "US",
                            callingCode: ["1"],
                            flag: "🇺🇸",
                        })
                    }
                >
                    <Text>Select US</Text>
                </Pressable>

                <Pressable
                    testID="close-country-picker"
                    onPress={onClose}
                >
                    <Text>Close picker</Text>
                </Pressable>
            </View>
        ),
    };
});

const mockTheme = {
    input: {
        background: "#FFFFFF",
        border: "#D0D5DD",
        errorBorder: "#D92D20",
        placeholder: "#98A2B3",
        text: "#101828",
    },
};

const mockedUseTheme = useTheme as jest.MockedFunction<
    typeof useTheme
>;

const defaultProps = {
    value: "",
    onChangeText: jest.fn(),
    countryCode: "NG",
    onCountryCodeChange: jest.fn(),
};

const getPhoneInput = () =>
    screen.getByPlaceholderText("8012345678");

const getPhoneInputStyles = () =>
    StyleSheet.flatten(getPhoneInput().props.style);

const getCountryButtonStyles = () => {
    const button = screen.getByRole("button", {
        name: "Country calling code +234",
    });

    return StyleSheet.flatten(button.props.style);
};

describe("PhoneNumberInput", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedUseTheme.mockReturnValue({
            theme: mockTheme,
        } as ReturnType<typeof useTheme>);
    });

    describe("Rendering", () => {
        it("renders the phone number input", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            expect(getPhoneInput()).toBeTruthy();
        });

        it("renders the provided phone number", () => {
            render(
                <PhoneNumberInput
                    {...defaultProps}
                    value="8012345678"
                />,
            );

            expect(
                screen.getByDisplayValue("8012345678"),
            ).toBeTruthy();
        });

        it("renders the placeholder", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            expect(
                screen.getByPlaceholderText("8012345678"),
            ).toBeTruthy();
        });

        it("renders the label when provided", () => {
            render(
                <PhoneNumberInput
                    {...defaultProps}
                    label="Phone number"
                />,
            );

            expect(screen.getByText("Phone number")).toBeTruthy();
        });

        it("does not render a label when omitted", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            expect(
                screen.queryByText("Phone number"),
            ).toBeNull();
        });

        it("renders the default Nigerian calling code", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            expect(
                screen.getByText("+234"),
            ).toBeTruthy();
        });

        it("renders the country picker", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            expect(screen.getByTestId("country-picker")).toBeTruthy();
        });

        it("initialises the country picker as hidden", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            expect(
                screen.getByTestId("picker-visibility").props.children,
            ).toBe("hidden");
        });
    });

    describe("Phone number input", () => {
        it("uses the phone-pad keyboard", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            expect(getPhoneInput().props.keyboardType).toBe(
                "phone-pad",
            );
        });

        it("calls onChangeText when the phone number changes", () => {
            const onChangeText = jest.fn();

            render(
                <PhoneNumberInput
                    {...defaultProps}
                    onChangeText={onChangeText}
                />,
            );

            fireEvent.changeText(getPhoneInput(), "8012345678");

            expect(onChangeText).toHaveBeenCalledWith("8012345678");
            expect(onChangeText).toHaveBeenCalledTimes(1);
        });

        it("uses the provided value", () => {
            render(
                <PhoneNumberInput
                    {...defaultProps}
                    value="8098765432"
                />,
            );

            expect(getPhoneInput().props.value).toBe("8098765432");
        });
    });

    describe("Country picker", () => {
        it("opens the country picker when the country button is pressed", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Country calling code +234",
                }),
            );

            expect(
                screen.getByTestId("picker-visibility").props.children,
            ).toBe("visible");
        });

        it("closes the country picker when onClose is triggered", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Country calling code +234",
                }),
            );

            fireEvent.press(
                screen.getByTestId("close-country-picker"),
            );

            expect(
                screen.getByTestId("picker-visibility").props.children,
            ).toBe("hidden");
        });

        it("updates the calling code when a country is selected", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Country calling code +234",
                }),
            );

            fireEvent.press(
                screen.getByTestId("select-country"),
            );

            expect(screen.getByText("+1")).toBeTruthy();
        });

        it("calls onCountryCodeChange with the selected country code", () => {
            const onCountryCodeChange = jest.fn();

            render(
                <PhoneNumberInput
                    {...defaultProps}
                    onCountryCodeChange={onCountryCodeChange}
                />,
            );

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Country calling code +234",
                }),
            );

            fireEvent.press(
                screen.getByTestId("select-country"),
            );

            expect(onCountryCodeChange).toHaveBeenCalledWith("US");
            expect(onCountryCodeChange).toHaveBeenCalledTimes(1);
        });

        it("closes the picker after selecting a country", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Country calling code +234",
                }),
            );

            fireEvent.press(
                screen.getByTestId("select-country"),
            );

            expect(
                screen.getByTestId("picker-visibility").props.children,
            ).toBe("hidden");
        });

        it("passes the provided country code to CountryPicker", () => {
            render(
                <PhoneNumberInput
                    {...defaultProps}
                    countryCode="GB"
                />,
            );

            expect(
                screen.getByTestId("picker-country-code").props.children,
            ).toBe("GB");
        });
    });

    describe("Error handling", () => {
        it("renders the error message", () => {
            render(
                <PhoneNumberInput
                    {...defaultProps}
                    error="Invalid phone number"
                />,
            );

            expect(
                screen.getByText("Invalid phone number"),
            ).toBeTruthy();
        });

        it("does not render an error when none is provided", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            expect(
                screen.queryByText("Invalid phone number"),
            ).toBeNull();
        });

        it("applies the error border colour when an error exists", () => {
            render(
                <PhoneNumberInput
                    {...defaultProps}
                    error="Invalid phone number"
                />,
            );

            expect(getPhoneInputStyles().borderColor).toBe(
                mockTheme.input.errorBorder,
            );
        });

        it("applies the default border colour without an error", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            expect(getPhoneInputStyles().borderColor).toBe(
                mockTheme.input.border,
            );
        });
    });

    describe("Styling", () => {
        it("applies the default input background and text colours", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            const styles = getPhoneInputStyles();

            expect(styles.backgroundColor).toBe(
                mockTheme.input.background,
            );
            expect(styles.color).toBe(mockTheme.input.text);
        });

        it("applies the country button background and border colours", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            const styles = getCountryButtonStyles();

            expect(styles.backgroundColor).toBe(
                mockTheme.input.background,
            );
            expect(styles.borderColor).toBe(
                mockTheme.input.border,
            );
        });

        it("uses the expected phone input height", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            expect(getPhoneInputStyles().height).toBe(48);
        });
    });

    describe("Accessibility", () => {
        it("exposes the country selector as a button", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            expect(
                screen.getByRole("button", {
                    name: "Country calling code +234",
                }),
            ).toBeTruthy();
        });

        it("updates the country button accessibility label after selection", () => {
            render(<PhoneNumberInput {...defaultProps} />);

            fireEvent.press(
                screen.getByRole("button", {
                    name: "Country calling code +234",
                }),
            );

            fireEvent.press(
                screen.getByTestId("select-country"),
            );

            expect(
                screen.getByRole("button", {
                    name: "Country calling code +1",
                }),
            ).toBeTruthy();
        });
    });
});
