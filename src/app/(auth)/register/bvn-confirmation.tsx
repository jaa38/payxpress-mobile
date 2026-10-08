import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { OTPInput } from "@/components/ui/OTPInput";
import { spacing, theme } from "@/theme";

export default function BVNConfirmationScreen() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP sent to you.");
      return;
    }

    setError("");
    router.push("/register/setup-account");
  };

  const handleResendOtp = () => {
    setOtp("");
    setError("");

    // TODO: Connect to the OTP resend API.
  };

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
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
                Confirm your BVN
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
                Enter the 6-digit OTP sent to your registered phone number.
              </AppText>
            </View>
          </View>

          {/* OTP Content */}
          <View
            style={{
              flex: 1,
              paddingTop: spacing.lg,
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

                  router.push("/register/setup-account");
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
              paddingVertical: spacing.lg,
            }}
          >
            <Button
              title="Continue"
              size="large"
              onPress={handleContinue}
              disabled={otp.length !== 6}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
