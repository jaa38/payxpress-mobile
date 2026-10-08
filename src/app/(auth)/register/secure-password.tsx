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

export default function SecurePasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const hasMinimumLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const canCreateAccount =
    hasMinimumLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    // TODO: Connect account creation to the registration API.
    // TODO: Store authentication tokens securely after successful registration.

    router.replace("/(tabs)");
  };

  const getRequirementColor = (met: boolean) =>
    met ? theme.text.success : theme.text.muted;

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
                Secure your account
              </AppText>

              <AppText
                variant="body"
                color="muted"
              >
                Create a strong password to keep your PayXpress account secure.
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
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={theme.text.muted}
                  />
                </Pressable>
              }
            />

            {/* Password Requirements */}
            <View
              style={{
                marginTop: spacing.md,
                paddingLeft: spacing.xs,
              }}
            >
              <AppText
                variant="bodySmall"
                color="muted"
                style={{
                  marginBottom: spacing.xs,
                }}
              >
                Your password must contain:
              </AppText>

              <AppText
                variant="bodySmall"
                color={hasMinimumLength ? "success" : "muted"}
                style={{
                  marginBottom: spacing.xs,
                }}
              >
                {hasMinimumLength ? "✓" : "•"} At least 8 characters
              </AppText>

              <AppText
                variant="bodySmall"
                color={hasUppercase ? "success" : "muted"}
                style={{
                  marginBottom: spacing.xs,
                }}
              >
                {hasUppercase ? "✓" : "•"} One uppercase letter
              </AppText>

              <AppText
                variant="bodySmall"
                color={hasLowercase ? "success" : "muted"}
                style={{
                  marginBottom: spacing.xs,
                }}
              >
                {hasLowercase ? "✓" : "•"} One lowercase letter
              </AppText>

              <AppText
                variant="bodySmall"
                color={hasNumber ? "success" : "muted"}
              >
                {hasNumber ? "✓" : "•"} One number
              </AppText>
            </View>

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
                  >
                    <Ionicons
                      name={
                        showConfirmPassword
                          ? "eye-off-outline"
                          : "eye-outline"
                      }
                      size={22}
                      color={theme.text.muted}
                    />
                  </Pressable>
                }
              />
            </View>

            {confirmPassword.length > 0 ? (
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
            ) : null}

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
              paddingVertical: spacing.lg,
            }}
          >
            <Button
              title="Create Account"
              size="large"
              onPress={handleCreateAccount}
              disabled={!canCreateAccount}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
