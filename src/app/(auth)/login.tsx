
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
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
import { authService } from "@/services/auth/auth-service";
import { biometricAuth } from "@/services/auth/biometric-auth";
import { spacing } from "@/theme";
import { logger } from "@/utils/logger";

export default function LoginScreen() {
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);

  const isEmailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const isFormValid = isEmailValid && password.length > 0;

  // Normal email and password login
  const handleLogin = async () => {
    if (isLoading) return;

    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }

    if (!isEmailValid) {
      setError("Enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Enter your password.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login({
        email: email.trim().toLowerCase(),
        password,
      });

      /*
       * The API request has completed, but the response
       * contract has not yet been confirmed.
       *
       * We must map the actual access token, refresh token
       * and user profile before establishing a session.
       */
      logger.info("Login API request completed.");

      Alert.alert(
        "Login response received",
        "The authentication service responded. Session establishment is pending backend response mapping.",
      );

      // Do not navigate to /(tabs) yet.
      // Do not mark the user as authenticated yet.
      // Do not assume response token property names.

      void response;
    } catch (error) {
      logger.error("Login request failed.");

      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please check your details and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Biometric login
  const handleBiometricLogin = async () => {
    if (isBiometricLoading) return;

    try {
      setIsBiometricLoading(true);

      const result = await biometricAuth.authenticate();

      if (!result.success) {
        if (
          result.error === "user_cancel" ||
          result.error === "system_cancel" ||
          result.error === "app_cancel"
        ) {
          return;
        }

        Alert.alert(
          "Face ID unavailable",
          result.error ||
          "Unable to complete biometric authentication. Please try again.",
        );

        return;
      }

      /*
       * Device biometric verification is not the same as
       * PayXpress backend authentication.
       *
       * Session restoration must be implemented before
       * biometric verification can open the dashboard.
       */

      Alert.alert(
        "Face ID verified",
        "Your device identity has been verified. PayXpress session restoration is not connected yet.",
      );
    } catch {
      logger.error("Biometric authentication failed.");

      Alert.alert(
        "Authentication error",
        "Unable to complete biometric authentication. Please try again.",
      );
    } finally {
      setIsBiometricLoading(false);
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
                marginRight: spacing.sm,
              }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.icon.primary}
              />
            </Pressable>

            <View style={{ flex: 1 }}>
              <AppText
                variant="h1"
                color="heading"
                style={{ fontWeight: "700" }}
              >
                Welcome back
              </AppText>

              <AppText
                variant="body"
                color="muted"
                style={{ marginTop: spacing.sm }}
              >
                Log in to your PayXpress account.
              </AppText>
            </View>
          </View>

          {/* Form */}
          <View style={{ flex: 1 }}>
            <Input
              label="Email Address"
              placeholder="Enter your email address"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (error) setError("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              required
              error={error && !isEmailValid ? error : undefined}
            />

            {/* Password */}
            <View style={{ marginTop: spacing.lg }}>
              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (error) setError("");
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                required
                rightElement={
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onPress={() =>
                      setShowPassword((current) => !current)
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
                        showPassword
                          ? "eye-off-outline"
                          : "eye-outline"
                      }
                      size={24}
                      color={theme.icon.secondary}
                    />
                  </Pressable>
                }
              />
            </View>

            {/* Forgot Password */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
              onPress={() => router.push("/forgot-password")}
              style={{
                alignSelf: "flex-end",
                marginTop: spacing.md,
                paddingVertical: spacing.xs,
              }}
            >
              <AppText variant="bodyBold" color="link">
                Forgot password?
              </AppText>
            </Pressable>

            {/* Error */}
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

          {/* Actions */}
          <View
            style={{
              paddingVertical: spacing.lg,
            }}
          >
            {/* Face ID */}
            <Button
              title="Sign In with Face ID"
              variant="tertiary"
              size="large"
              onPress={handleBiometricLogin}
              loading={isBiometricLoading}
              disabled={isBiometricLoading || isLoading}
              style={{
                width: "100%",
                marginBottom: spacing.md,
              }}
            />

            {/* Login */}
            <Button
              title="Login"
              size="large"
              onPress={handleLogin}
              loading={isLoading}
              disabled={!isFormValid || isLoading}
              style={{
                width: "100%",
              }}
            />

            {/* Register */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: spacing.lg,
              }}
            >
              <AppText variant="body" color="muted">
                Don't have an account?{" "}
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Register"
                onPress={() => router.push("/register")}
                style={{
                  paddingVertical: spacing.xs,
                }}
              >
                <AppText variant="bodyBold" color="link">
                  Register
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
