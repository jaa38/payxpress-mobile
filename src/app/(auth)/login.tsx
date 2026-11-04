
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
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
import { spacing, theme } from "@/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isEmailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const isFormValid = isEmailValid && password.length > 0;

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

  // Face ID authentication
  const handleBiometricLogin = async () => {
    try {
      // Check device biometric hardware
      const hasHardware =
        await LocalAuthentication.hasHardwareAsync();

      if (!hasHardware) {
        Alert.alert(
          "Biometric authentication unavailable",
          "Your device does not support biometric authentication."
        );
        return;
      }

      // Check whether biometrics are enrolled
      const isEnrolled =
        await LocalAuthentication.isEnrolledAsync();

      if (!isEnrolled) {
        Alert.alert(
          "Face ID not configured",
          "Please set up Face ID in your device settings before continuing."
        );
        return;
      }

      // Ensure Face ID is supported
      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      const hasFaceID = supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      );

      if (Platform.OS === "ios" && !hasFaceID) {
        Alert.alert(
          "Face ID unavailable",
          "Face ID is not available on this device."
        );
        return;
      }

      // Trigger native biometric authentication
      const result =
        await LocalAuthentication.authenticateAsync({
          promptMessage: "Sign in to PayXpress",
          cancelLabel: "Cancel",
          disableDeviceFallback: true,
        });

      if (result.success) {
        /*
         * TODO:
         * Restore the existing authenticated session
         * using the securely stored refresh token.
         *
         * Face ID verification alone does not authenticate
         * the user with the PayXpress backend.
         */

        Alert.alert(
          "Face ID verified",
          "Connect session restoration to complete biometric sign-in."
        );
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);

      Alert.alert(
        "Authentication error",
        "Unable to complete biometric authentication. Please try again."
      );
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
                color={theme.text.primary}
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
                      color={theme.text.secondary}
                    />
                  </Pressable>
                }
              />
            </View>

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
                Don't have an account?
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
