
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
import { biometricAuth } from "@/services/auth/biometric-auth";
import { spacing } from "@/theme";

import { logger } from "@/utils/logger";

export default function LoginScreen() {
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);

  const isEmailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const isFormValid = isEmailValid && password.length > 0;

  // Normal email and password login
  const handleLogin = () => {
    if (!isEmailValid) {
      setError("Enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Enter your password.");
      return;
    }

    setError("");

    /*
     * TODO:
     * Connect to the authentication API once the backend
     * login endpoint and response contract are available.
     *
     * The API response should eventually provide the
     * access and refresh tokens required by authSession.
     */
  };

  // Biometric login
  const handleBiometricLogin = async () => {
    if (isBiometricLoading) return;

    try {
      setIsBiometricLoading(true);

      const result = await biometricAuth.authenticate();

      if (!result.success) {
        // Avoid showing an error when the user intentionally cancels.
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
       * TODO:
       * Restore the authenticated PayXpress session.
       *
       * Once the backend refresh-token endpoint is available:
       * 1. Retrieve the protected biometric credential.
       * 2. Call the refresh-token API.
       * 3. Save the returned session using authSession.
       * 4. Restore the authenticated user profile.
       * 5. Update useAuthStore.
       * 6. Navigate to /(tabs).
       *
       * Local biometric verification alone does not
       * authenticate the customer with the backend.
       */

      Alert.alert(
        "Face ID verified",
        "Your device identity has been verified. Complete account sign-in will be available once session restoration is connected.",
      );
    } catch (error) {
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
              onPress={() => { }}
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

            {error && isEmailValid ? (
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
            {/* Face ID Secondary Button */}
            <Button
              title="Sign In with Face ID"
              variant="tertiary"
              size="large"
              onPress={handleBiometricLogin}
              loading={isBiometricLoading}
              disabled={isBiometricLoading}
              style={{
                width: "100%",
                marginBottom: spacing.md,
              }}
            />

            {/* Primary Login Button */}
            <Button
              title="Login"
              size="large"
              onPress={handleLogin}
              disabled={!isFormValid}
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
