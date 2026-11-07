
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { OTPInput } from "@/components/ui/OTPInput";
import { useTheme } from "@/hooks/use-theme";
import { useRegistrationStore } from "@/store/registration-store";
import { spacing } from "@/theme";

export default function VerifyEmailScreen() {
  const { theme, isDark } = useTheme();

  const email = useRegistrationStore((state) => state.draft.email);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);

  // OTP must contain exactly six numeric digits.
  const isOtpComplete = /^\d{6}$/.test(otp);

  const handleOtpChange = (code: string) => {
    setOtp(code.replace(/\D/g, ""));

    if (error) {
      setError("");
    }
  };

  const handleOtpComplete = (code: string) => {
    setOtp(code.replace(/\D/g, ""));
    setError("");
  };

  const handleContinue = () => {
    if (!isOtpComplete) {
      setError("Enter the 6-digit OTP sent to your email.");
      return;
    }

    setError(
      "Email verification is not connected yet. Please try again once verification services are available.",
    );
  };

  const handleResendOtp = async () => {
    if (isResending) {
      return;
    }

    setIsResending(true);
    setOtp("");
    setError("");

    try {
      // TODO: Connect to the email OTP resend API.
      // Use the registration email and enforce backend resend limits.
    } finally {
      setIsResending(false);
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
                Enter the 6-digit OTP sent to your email address.
              </AppText>

              {email ? (
                <AppText
                  variant="bodyBold"
                  color="primary"
                  style={{ marginTop: spacing.sm }}
                >
                  {email}
                </AppText>
              ) : null}
            </View>
          </View>

          {/* OTP Content */}
          <View
            style={{
              flex: 1,
              marginTop: spacing["2xl"],
            }}
          >
            <View style={{ alignItems: "center" }}>
              <OTPInput
                length={6}
                value={otp}
                onChange={handleOtpChange}
                onComplete={handleOtpComplete}
              />

              {error ? (
                <AppText
                  variant="bodySmall"
                  color="error"
                  align="center"
                  style={{ marginTop: spacing.sm }}
                >
                  {error}
                </AppText>
              ) : null}
            </View>

            {/* Resend OTP */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Resend email OTP"
              accessibilityState={{ disabled: isResending }}
              disabled={isResending}
              onPress={handleResendOtp}
              style={{
                alignSelf: "flex-start",
                marginTop: spacing.lg,
                paddingVertical: spacing.xs,
                opacity: isResending ? 0.5 : 1,
              }}
            >
              <AppText variant="bodyBold" color="link">
                {isResending ? "Resending..." : "Resend OTP"}
              </AppText>
            </Pressable>
          </View>

          {/* Continue */}
          <View style={{ paddingBottom: spacing.sm }}>
            <Button
              title="Continue"
              size="large"
              onPress={handleContinue}
              disabled={!isOtpComplete}
            />

            {/* CBN licensing */}
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
