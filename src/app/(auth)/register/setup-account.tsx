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
import { Input } from "@/components/ui/Input";
import { colors, spacing, theme } from "@/theme";

export default function SetupAccountScreen() {
  const [email, setEmail] = useState("");
  const [tagName, setTagName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canContinue =
    email.trim().length > 0 &&
    isValidEmail &&
    tagName.trim().length > 0;

  const handleContinue = () => {
    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }

    if (!isValidEmail) {
      setError("Enter a valid email address.");
      return;
    }

    if (!tagName.trim()) {
      setError("Enter your tag name.");
      return;
    }

    setError("");

    // TODO: Connect account setup to the registration API.
    // TODO: Pass registration data into the email verification flow.

    router.push("/register/verify-email");
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
                Setup your Account
              </AppText>

              <AppText
                variant="body"
                color="muted"
              >
                Enter your details to set up your PayXpress account.
              </AppText>
            </View>
          </View>

          {/* Form */}
          <View
            style={{
              flex: 1,
            }}
          >
            <Input
              label="Email Address"
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(value) => {
                setEmail(value);

                if (error) {
                  setError("");
                }
              }}
            />

            <View
              style={{
                marginTop: spacing.lg,
              }}
            >
              <Input
                label="Tag Name"
                placeholder="Enter your tag name"
                autoCapitalize="none"
                autoCorrect={false}
                value={tagName}
                onChangeText={(value) => {
                  setTagName(value);

                  if (error) {
                    setError("");
                  }
                }}
              />
            </View>

            <View
              style={{
                marginTop: spacing.lg,
              }}
            >
              <Input
                label="Referral Code"
                placeholder="Enter referral code"
                optional
                autoCapitalize="characters"
                autoCorrect={false}
                value={referralCode}
                onChangeText={(value) => {
                  setReferralCode(value);

                  if (error) {
                    setError("");
                  }
                }}
              />
            </View>

            {error ? (
              <AppText
                variant="bodySmall"
                color="error"
                style={{
                  marginTop: spacing.md,
                }}
              >
                {error}
              </AppText>
            ) : null}
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
              disabled={!canContinue}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
