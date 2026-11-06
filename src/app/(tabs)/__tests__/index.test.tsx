
import { render, screen } from "@testing-library/react-native";
import HomeScreen from "../index";

jest.mock("@/hooks/use-theme", () => ({
    useTheme: () => ({
        theme: {
            background: {
                surface: "#FFFFFF",
            },
        },
    }),
}));

jest.mock("@/components/ui/AppText", () => {
    const React = require("react");
    const { Text } = require("react-native");

    return {
        AppText: ({ children, ...props }: any) =>
            React.createElement(Text, props, children),
    };
});

describe("HomeScreen", () => {
    afterEach(() => {
        jest.useRealTimers();
    });

    const renderAtHour = (hour: number) => {
        jest.useFakeTimers();

        jest.setSystemTime(
            new Date(2026, 10, 6, hour, 0, 0),
        );

        return render(<HomeScreen />);
    };

    describe("Rendering", () => {
        it("renders the Home screen", () => {
            renderAtHour(9);

            expect(screen.getByText("Home")).toBeTruthy();
        });

        it("renders the customer name placeholder", () => {
            renderAtHour(9);

            expect(screen.getByText("Customer Name")).toBeTruthy();
        });

        it("renders the Home page heading", () => {
            renderAtHour(9);

            expect(screen.getByText("Home")).toBeTruthy();
        });

        it("renders the development placeholder message", () => {
            renderAtHour(9);

            expect(
                screen.getByText(
                    "PayXpress home will be built in a later sprint.",
                ),
            ).toBeTruthy();
        });
    });

    describe("Time-based greeting", () => {
        it("displays Good morning before 12 PM", () => {
            renderAtHour(9);

            expect(screen.getByText("Good morning")).toBeTruthy();
        });

        it("displays Good afternoon from 12 PM", () => {
            renderAtHour(12);

            expect(screen.getByText("Good afternoon")).toBeTruthy();
        });

        it("displays Good afternoon before 6 PM", () => {
            renderAtHour(17);

            expect(screen.getByText("Good afternoon")).toBeTruthy();
        });

        it("displays Good evening from 6 PM", () => {
            renderAtHour(18);

            expect(screen.getByText("Good evening")).toBeTruthy();
        });

        it("displays Good evening late at night", () => {
            renderAtHour(23);

            expect(screen.getByText("Good evening")).toBeTruthy();
        });

        it("displays Good morning at midnight", () => {
            renderAtHour(0);

            expect(screen.getByText("Good morning")).toBeTruthy();
        });
    });
});
