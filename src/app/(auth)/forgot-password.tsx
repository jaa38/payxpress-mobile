
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
import { authApi } from "@/services/auth/auth-api";
import { spacing } from "@/theme";

export default function ForgotPasswordScreen() {
    const { theme, isDark } = useTheme();

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (value: string): boolean => {
        if (!value.trim()) {
            setEmailError("Email address is required.");
            return false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(value.trim())) {
            setEmailError("Please enter a valid email address.");
            return false;
        }

        setEmailError("");
        return true;
    };

    const handleSubmit = async () => {
        const normalizedEmail = email.trim().toLowerCase();

        if (!validateEmail(normalizedEmail)) {
            return;
        }

        try {
            setIsSubmitting(true);

            await authApi.forgotPassword(normalizedEmail);

            router.push({
                pathname: "/verify-otp",
                params: {
                    email: normalizedEmail,
                },
            });
        } catch {
            Alert.alert(
                "Unable to submit request",
                "We couldn't process your request. Please try again.",
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
                                Forgot password?
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
                                Enter the email address associated with your PayXpress account.
                                We'll help you recover access to your account.
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
                            label="Email address"
                            placeholder="Enter your email address"
                            value={email}
                            onChangeText={(value) => {
                                setEmail(value);

                                if (emailError) {
                                    setEmailError("");
                                }
                            }}
                            error={emailError}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="emailAddress"
                            returnKeyType="done"
                            onSubmitEditing={handleSubmit}
                            editable={!isSubmitting}
                            required
                        />
                    </View>

                    {/* Continue */}
                    <View style={{ paddingBottom: spacing.sm }}>
                        <Button
                            title="Continue"
                            size="large"
                            onPress={handleSubmit}
                            loading={isSubmitting}
                            disabled={isSubmitting}
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
