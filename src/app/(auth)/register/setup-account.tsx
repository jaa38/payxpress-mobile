
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
import { Input } from "@/components/ui/Input";
import { useTheme } from "@/hooks/use-theme";
import { useRegistrationStore } from "@/store/registration-store";
import { spacing } from "@/theme";

export default function SetupAccountScreen() {
  const { theme } = useTheme();

  const draft = useRegistrationStore((state) => state.draft);
  const updateDraft = useRegistrationStore((state) => state.updateDraft);

  const [error, setError] = useState("");

  const {
    fullName,
    phoneNumber,
    email,
    tagName,
    referralCode,
  } = draft;

  // Email validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Tag name validation
  const isValidTagName = tagName.trim().length > 0;

  // Email and tag name are required.
  // Referral code is optional.
  const canContinue = isValidEmail && isValidTagName;

  const handleContinue = () => {
    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }

    if (!isValidEmail) {
      setError("Enter a valid email address.");
      return;
    }

    if (!isValidTagName) {
      setError("Enter your tag name.");
      return;
    }

    setError("");

    // Registration data is available through registration-store.
    // Backend registration and OTP generation will be connected
    // after the request/response contracts are confirmed.

    router.push("/register/verify-email");
  };

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{
        flex: 1,
        backgroundColor: theme.background.surface,
      }}
    >
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
                Setup your Account
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
                Enter your details to set up your PayXpress account.
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
            {/* Full Name - Retrieved from BVN verification */}
            <Input
              label="Full Name"
              value={fullName}
              placeholder="Retrieved from BVN verification"
              editable={false}
            />

            {/* Phone Number - Retrieved from BVN verification */}
            <View style={{ marginTop: spacing.lg }}>
              <Input
                label="Phone Number"
                value={phoneNumber}
                placeholder="Retrieved from BVN verification"
                editable={false}
                keyboardType="phone-pad"
              />
            </View>

            {/* Email Address */}
            <View style={{ marginTop: spacing.lg }}>
              <Input
                label="Email Address"
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={(value) => {
                  updateDraft({ email: value.trimStart() });

                  if (error) {
                    setError("");
                  }
                }}
              />
            </View>

            {/* Tag Name */}
            <View style={{ marginTop: spacing.lg }}>
              <Input
                label="Tag Name"
                placeholder="Enter your tag name"
                autoCapitalize="none"
                autoCorrect={false}
                value={tagName}
                onChangeText={(value) => {
                  updateDraft({ tagName: value });

                  if (error) {
                    setError("");
                  }
                }}
              />
            </View>

            {/* Referral Code */}
            <View style={{ marginTop: spacing.lg }}>
              <Input
                label="Referral Code"
                placeholder="Enter referral code"
                optional
                autoCapitalize="characters"
                autoCorrect={false}
                value={referralCode}
                onChangeText={(value) => {
                  updateDraft({ referralCode: value });

                  if (error) {
                    setError("");
                  }
                }}
              />
            </View>

            {/* Validation Error */}
            {error ? (
              <AppText
                variant="bodySmall"
                color="error"
                style={{ marginTop: spacing.md }}
              >
                {error}
              </AppText>
            ) : null}
          </View>

          {/* Continue */}
          <View style={{ paddingBottom: spacing.sm }}>
            <Button
              title="Continue"
              size="large"
              onPress={handleContinue}
              disabled={!canContinue}
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
