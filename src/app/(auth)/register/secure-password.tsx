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
import { Input } from "@/components/ui/Input";
import { spacing, theme } from "@/theme";

export default function SecurePasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password requirements
  const hasMinimumLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

  // Confirm password validation
  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  // Enable Create Account only when all requirements are met
  const canCreateAccount =
    hasMinimumLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialCharacter &&
    passwordsMatch;

  const handleCreateAccount = () => {
    if (!hasMinimumLength) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!hasUppercase) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!hasLowercase) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    if (!hasNumber) {
      setError("Password must contain at least one number.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    // TODO: Connect account creation to the registration API.
    // TODO: Store authentication tokens securely after successful registration.

    router.replace("/(tabs)");
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
                Secure your account
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
                Create a strong password to keep your PayXpress account secure.
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
            {/* Password */}
            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(value) => {
                setPassword(value);

                if (error) {
                  setError("");
                }
              }}
              rightElement={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? "Hide password" : "Show password"
                  }
                  onPress={() => setShowPassword((current) => !current)}
                  hitSlop={8}
                  style={{
                    width: 40,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color={theme.text.secondary}
                  />
                </Pressable>
              }
            />

            {/* Password Requirements */}
            <View
              style={{
                marginTop: spacing.md,
                paddingLeft: spacing.xs,
                flexDirection: "column",
                gap: spacing.xs,
              }}
            >
              <AppText variant="bodySmall" color="muted">
                Your password must contain:
              </AppText>

              <AppText
                variant="bodySmall"
                color={hasMinimumLength ? "success" : "muted"}
              >
                {hasMinimumLength ? "✓" : "•"} At least 8 characters
              </AppText>

              <AppText
                variant="bodySmall"
                color={hasUppercase ? "success" : "muted"}
              >
                {hasUppercase ? "✓" : "•"} One uppercase letter
              </AppText>

              <AppText
                variant="bodySmall"
                color={hasLowercase ? "success" : "muted"}
              >
                {hasLowercase ? "✓" : "•"} One lowercase letter
              </AppText>

              <AppText
                variant="bodySmall"
                color={hasNumber ? "success" : "muted"}
              >
                {hasNumber ? "✓" : "•"} One number
              </AppText>

              <AppText
                variant="bodySmall"
                color={hasSpecialCharacter ? "success" : "muted"}
              >
                {hasSpecialCharacter ? "✓" : "•"} One special character
              </AppText>
            </View>

            {/* Confirm Password */}
            <View
              style={{
                marginTop: spacing.lg,
              }}
            >
              <Input
                label="Confirm Password"
                placeholder="Re-enter your password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);

                  if (error) {
                    setError("");
                  }
                }}
                rightElement={
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    onPress={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    hitSlop={8}
                    style={{
                      width: 40,
                      height: 40,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={24}
                      color={theme.text.secondary}
                    />
                  </Pressable>
                }
              />
            </View>

            {/* Password Match */}
            {confirmPassword.length > 0 && (
              <AppText
                variant="bodySmall"
                color={passwordsMatch ? "success" : "error"}
                style={{
                  marginTop: spacing.sm,
                }}
              >
                {passwordsMatch
                  ? "✓ Passwords match"
                  : "Passwords do not match"}
              </AppText>
            )}

            {/* Error */}
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

          {/* Create Account */}
          <View
            style={{
              paddingBottom: spacing.sm,
            }}
          >
            <Button
              title="Create Account"
              size="large"
              onPress={handleCreateAccount}
              disabled={!canCreateAccount}
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
