import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from "react-native";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { OTPInput } from "@/components/ui/OTPInput";
import { colors, spacing, theme } from "@/theme";

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
        backgroundColor: colors.neutral.white,
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
              paddingBottom: spacing.xl,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.text.primary}
              />
            </Pressable>

            <View
              style={{
                flex: 1,
              }}
            >
              <AppText
                variant="h1"
                color="heading"
                style={{
                  fontWeight: "700",
                  marginBottom: spacing.sm,
                }}
              >
                Confirm your BVN
              </AppText>

              <AppText
                variant="body"
                color="muted"
                style={{
                  marginBottom: spacing.xl,
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