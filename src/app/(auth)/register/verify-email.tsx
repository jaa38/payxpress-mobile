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
import { spacing, theme } from "@/theme";

export default function VerifyEmailScreen() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const isOtpComplete = /^\d{6}$/.test(otp);

  const handleContinue = () => {
    if (!isOtpComplete) {
      setError("Enter the 6-digit OTP sent to your email.");
      return;
    }

    setError("");
    router.push("/register/secure-password");
  };

  const handleResendOtp = () => {
    setOtp("");
    setError("");

    // TODO: Connect to the email OTP resend API.
  };

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{
        flex: 1,
        backgroundColor: theme.background.surface,
      }}
    >
      <StatusBar style="auto" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          flex: 1,
        }}
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
            {/* Back button */}
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
                color={theme.input.icon}
              />
            </Pressable>

            {/* Header text */}
            <View
              style={{
                flex: 1,
                width: 0,
              }}
            >
              <AppText
                variant="h1"
                color="heading"
                style={{
                  marginBottom: spacing.sm,
                }}
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
            </View>
          </View>

          {/* OTP Content */}
          <View
            style={{
              flex: 1,
              marginTop: spacing["2xl"],
            }}
          >
            <View
              style={{
                alignItems: "center",
              }}
            >
              <OTPInput
                length={6}
                value={otp}
                onChange={(code) => {
                  setOtp(code);

                  if (error) {
                    setError("");
                  }
                }}
                onComplete={(code) => {
                  setOtp(code);
                  setError("");
                }}
              />

              {error ? (
                <AppText
                  variant="bodySmall"
                  color="error"
                  align="center"
                  style={{
                    marginTop: spacing.sm,
                  }}
                >
                  {error}
                </AppText>
              ) : null}
            </View>

            {/* Resend OTP */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Resend OTP"
              onPress={handleResendOtp}
              style={{
                alignSelf: "flex-start",
                marginTop: spacing.lg,
                paddingVertical: spacing.xs,
              }}
            >
              <AppText variant="bodyBold" color="link">
                Resend OTP
              </AppText>
            </Pressable>
          </View>

          {/* Continue */}
          <View
            style={{
              paddingBottom: spacing.sm,
            }}
          >
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