
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTheme } from "@/hooks/use-theme";
import { spacing } from "@/theme";

export default function VerifyOtpScreen() {
    const { theme, isDark } = useTheme();
    const { email } = useLocalSearchParams<{ email?: string }>();

    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleVerify = async () => {
        if (!otp.trim()) {
            setOtpError("Please enter the verification code.");
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            setOtpError("Enter the complete 6-digit verification code.");
            return;
        }

        setOtpError("");

        try {
            setIsSubmitting(true);

            // Backend OTP verification is pending confirmation
            // of the verifyOtp request and response contracts.

            Alert.alert(
                "Verification pending",
                "OTP verification will be enabled once the backend request contract is confirmed.",
            );
        } finally {
            setIsSubmitting(false);
        }
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

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: spacing.lg,
                    }}
                >
                    {/* Header */}
                    <View
                        style={{
                            paddingTop: spacing.md,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Go back"
                            hitSlop={8}
                            onPress={() => router.back()}
                            style={{
                                width: 32,
                                height: 32,
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: spacing.md,
                                flexShrink: 0,
                            }}
                        >
                            <Ionicons
                                name="chevron-back"
                                size={24}
                                color={theme.icon.primary}
                            />
                        </Pressable>

                        <View style={{ flex: 1, width: 0 }}>
                            <AppText
                                variant="h1"
                                color="heading"
                                style={{ marginBottom: spacing.sm }}
                            >
                                Verify your email
                            </AppText>

                            <AppText
                                variant="body"
                                color="muted"
                                style={{
                                    width: "100%",
                                    lineHeight: 26,
                                    flexWrap: "wrap",
                                }}
                            >
                                Enter the 6-digit verification code sent to{" "}
                                <AppText variant="bodyBold" color="heading">
                                    {email || "your email address"}
                                </AppText>
                                .
                            </AppText>
                        </View>
                    </View>

                    {/* Form */}
                    <View
                        style={{
                            flex: 1,
                            marginTop: spacing["2xl"],
                        }}
                    >
                        <Input
                            label="Verification code"
                            placeholder="Enter 6-digit code"
                            value={otp}
                            onChangeText={(value) => {
                                setOtp(value.replace(/\D/g, "").slice(0, 6));

                                if (otpError) {
                                    setOtpError("");
                                }
                            }}
                            error={otpError}
                            keyboardType="number-pad"
                            maxLength={6}
                            returnKeyType="done"
                            onSubmitEditing={handleVerify}
                            editable={!isSubmitting}
                            required
                        />

                        <AppText
                            variant="bodySmall"
                            color="muted"
                            style={{ marginTop: spacing.md }}
                        >
                            Didn't receive a code? Resend functionality will be connected
                            once the backend OTP generation contract is confirmed.
                        </AppText>
                    </View>

                    {/* Continue */}
                    <View style={{ paddingBottom: spacing.sm }}>
                        <Button
                            title="Verify code"
                            size="large"
                            onPress={handleVerify}
                            loading={isSubmitting}
                            disabled={isSubmitting || otp.length !== 6}
                        />

                        {/* CBN Licensing */}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: spacing["3xl"],
                                paddingHorizontal: spacing.sm,
                                paddingBottom: spacing.xs,
                            }}
                        >
                            <Image
                                source={require("@/assets/onboarding/cbn-logo.png")}
                                resizeMode="contain"
                                accessibilityLabel="Central Bank of Nigeria"
                                style={{
                                    width: 20,
                                    height: 24,
                                    marginRight: spacing.xs,
                                }}
                            />

                            <AppText variant="bodySmall" color="muted">
                                Licensed by the{" "}
                                <AppText variant="bodySmallBold" color="muted">
                                    Central Bank of Nigeria
                                </AppText>
                            </AppText>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
