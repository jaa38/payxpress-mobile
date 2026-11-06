
import {
    render,
    screen,
} from "@testing-library/react-native";
import {
    StyleSheet,
    Text,
} from "react-native";

import { Card } from "@/components/ui/Card";
import { useTheme } from "@/hooks/use-theme";

jest.mock("@/hooks/use-theme", () => ({
    useTheme: jest.fn(),
}));

const mockTheme = {
    card: {
        default: {
            background: "#FFFFFF",
            border: "#E5E7EB",
        },
        active: {
            background: "#E8F5EE",
            border: "#008A45",
        },
        success: {
            background: "#ECFDF3",
            border: "#12B76A",
        },
        error: {
            background: "#FEF3F2",
            border: "#F04438",
        },
        warning: {
            background: "#FFFAEB",
            border: "#F79009",
        },
        info: {
            background: "#EFF8FF",
            border: "#2E90FA",
        },
        disabled: {
            background: "#F2F4F7",
            border: "#D0D5DD",
        },
    },
};

const mockedUseTheme = useTheme as jest.MockedFunction<
    typeof useTheme
>;

const getCardStyles = () => {
    const card = screen.getByTestId("card");
    return StyleSheet.flatten(card.props.style);
};

describe("Card", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedUseTheme.mockReturnValue({
            theme: mockTheme,
        } as ReturnType<typeof useTheme>);
    });

    describe("Rendering", () => {
        it("renders its children", () => {
            render(
                <Card testID="card">
                    <Text>Card content</Text>
                </Card>,
            );

            expect(screen.getByText("Card content")).toBeTruthy();
        });

        it("uses the default variant", () => {
            render(
                <Card testID="card">
                    <Text>Default card</Text>
                </Card>,
            );

            const styles = getCardStyles();

            expect(styles.backgroundColor).toBe(
                mockTheme.card.default.background,
            );
            expect(styles.borderColor).toBe(
                mockTheme.card.default.border,
            );
        });

        it("uses full width by default", () => {
            render(
                <Card testID="card">
                    <Text>Full width card</Text>
                </Card>,
            );

            expect(getCardStyles().width).toBe("100%");
        });
    });

    describe("Variants", () => {
        const variants = [
            "default",
            "active",
            "success",
            "error",
            "warning",
            "info",
            "disabled",
        ] as const;

        it.each(variants)(
            "applies the correct %s variant styles",
            (variant) => {
                render(
                    <Card testID="card" variant={variant}>
                        <Text>{variant} card</Text>
                    </Card>,
                );

                const styles = getCardStyles();

                expect(styles.backgroundColor).toBe(
                    mockTheme.card[variant].background,
                );
                expect(styles.borderColor).toBe(
                    mockTheme.card[variant].border,
                );
            },
        );
    });

    describe("Width", () => {
        it("uses auto width when fullWidth is false", () => {
            render(
                <Card testID="card" fullWidth={false}>
                    <Text>Auto width card</Text>
                </Card>,
            );

            const styles = getCardStyles();

            expect(styles.alignSelf).toBe("flex-start");
            expect(styles.width).toBeUndefined();
        });

        it("uses full width when fullWidth is true", () => {
            render(
                <Card testID="card" fullWidth>
                    <Text>Full width card</Text>
                </Card>,
            );

            expect(getCardStyles().width).toBe("100%");
        });
    });

    describe("Custom styles", () => {
        it("applies custom styles", () => {
            render(
                <Card
                    testID="card"
                    style={{ marginTop: 16, padding: 24 }}
                >
                    <Text>Custom styled card</Text>
                </Card>,
            );

            const styles = getCardStyles();

            expect(styles.marginTop).toBe(16);
            expect(styles.padding).toBe(24);
        });

        it("allows custom styles to override default styles", () => {
            render(
                <Card
                    testID="card"
                    style={{ width: "80%" }}
                >
                    <Text>Overridden card</Text>
                </Card>,
            );

            expect(getCardStyles().width).toBe("80%");
        });
    });

    describe("View props", () => {
        it("forwards testID to the underlying View", () => {
            render(
                <Card testID="payment-card">
                    <Text>Payment details</Text>
                </Card>,
            );

            expect(screen.getByTestId("payment-card")).toBeTruthy();
        });

        it("forwards accessibility props", () => {
            render(
                <Card
                    accessible
                    accessibilityLabel="Payment summary"
                >
                    <Text>Payment details</Text>
                </Card>,
            );

            expect(
                screen.getByLabelText("Payment summary"),
            ).toBeTruthy();
        });
    });
});
