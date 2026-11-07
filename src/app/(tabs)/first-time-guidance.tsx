
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    Pressable,
    View,
    useWindowDimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/use-theme";
import { onboardingStorage } from "@/services/auth/onboarding-storage";
import { spacing } from "@/theme";

const GUIDANCE_SLIDES = [
    {
        id: "wallet",
        icon: "wallet-outline" as const,
        title: "Your wallet, all in one place",
        description:
            "Manage your PayXpress wallet and keep track of your available funds.",
    },
    {
        id: "payments",
        icon: "phone-portrait-outline" as const,
        title: "Everyday payments made easy",
        description:
            "Buy airtime, purchase data and pay your utility bills from one convenient platform.",
    },
    {
        id: "transfers",
        icon: "swap-horizontal-outline" as const,
        title: "Stay in control of your money",
        description:
            "Transfer funds and keep track of your transactions whenever you need to.",
    },
];

export default function FirstTimeGuidanceScreen() {
    const { theme, isDark } = useTheme();
    const { width } = useWindowDimensions();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);
    const [error, setError] = useState("");

    const currentSlide = GUIDANCE_SLIDES[currentIndex];
    const isLastSlide = currentIndex === GUIDANCE_SLIDES.length - 1;

    const finishGuidance = async () => {
        if (isCompleting) return;

        try {
            setIsCompleting(true);
            setError("");

            await onboardingStorage.markCompleted();

            router.replace("/(tabs)");
        } catch {
            setError(
                "We couldn't save your onboarding progress. Please try again.",
            );
        } finally {
            setIsCompleting(false);
        }
    };

    const handleNext = () => {
        if (isLastSlide) {
            void finishGuidance();
            return;
        }

        setCurrentIndex((index) => index + 1);
    };

    const handleBack = () => {
        setCurrentIndex((index) => Math.max(0, index - 1));
    };

    return (
        <SafeAreaView
            edges={["top", "bottom"]}
            style={{
                flex: 1,
                backgroundColor: theme.background.surface,
            }}
        >
            <StatusBar style={isDark ? "light" : "dark"} />

            <View
                style={{
                    flex: 1,
                    paddingHorizontal: spacing.lg,
                }}
            >
                {/* Header */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: spacing.md,
                    }}
                >
                    <AppText variant="bodySmall" color="muted">
                        {`Step ${currentIndex + 1} of ${GUIDANCE_SLIDES.length}`}
                    </AppText>

                    {!isLastSlide && (
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Skip onboarding"
                            onPress={() => void finishGuidance()}
                            disabled={isCompleting}
                            hitSlop={8}
                        >
                            <AppText variant="bodySmallBold" color="brand">
                                Skip
                            </AppText>
                        </Pressable>
                    )}
                </View>

                {/* Progress */}
                <View
                    accessibilityLabel={`Onboarding progress: ${currentIndex + 1} of ${GUIDANCE_SLIDES.length}`}
                    style={{
                        flexDirection: "row",
                        gap: spacing.sm,
                        marginTop: spacing.lg,
                    }}
                >
                    {GUIDANCE_SLIDES.map((slide, index) => (
                        <View
                            key={slide.id}
                            style={{
                                flex: 1,
                                height: 5,
                                borderRadius: 10,
                                backgroundColor:
                                    index <= currentIndex
                                        ? theme.action.primary.background
                                        : theme.border.default,
                            }}
                        />
                    ))}
                </View>

                {/* Slide content */}
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: spacing.md,
                    }}
                >
                    <View
                        style={{
                            width: Math.min(width * 0.55, 220),
                            aspectRatio: 1,
                            borderRadius: 999,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: theme.action.primary.background,
                            opacity: 0.95,
                        }}
                    >
                        <Ionicons
                            name={currentSlide.icon}
                            size={88}
                            color={theme.action.primary.text}
                        />
                    </View>

                    <AppText
                        variant="h1"
                        color="heading"
                        align="center"
                        style={{
                            marginTop: spacing["2xl"],
                            marginBottom: spacing.md,
                        }}
                    >
                        {currentSlide.title}
                    </AppText>

                    <AppText
                        variant="body"
                        color="muted"
                        align="center"
                        style={{
                            lineHeight: 26,
                            maxWidth: 340,
                        }}
                    >
                        {currentSlide.description}
                    </AppText>
                </View>

                {/* Error */}
                {error ? (
                    <AppText
                        variant="bodySmall"
                        color="error"
                        style={{ marginBottom: spacing.md }}
                    >
                        {error}
                    </AppText>
                ) : null}

                {/* Navigation */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.md,
                        paddingBottom: spacing.lg,
                    }}
                >
                    {currentIndex > 0 && (
                        <Button
                            title="Back"
                            variant="tertiary"
                            size="large"
                            style={{ flex: 1 }}
                            onPress={handleBack}
                            disabled={isCompleting}
                        />
                    )}

                    <Button
                        title={isLastSlide ? "Get Started" : "Next"}
                        size="large"
                        style={{ flex: 1 }}
                        onPress={handleNext}
                        loading={isCompleting}
                        disabled={isCompleting}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
