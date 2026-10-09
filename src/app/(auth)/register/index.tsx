import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
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
import { useState } from "react";

export default function RegisterScreen() {
  const [bvn, setBvn] = useState("");
  const isBvnValid = /^\d{11}$/.test(bvn);

  return (
    <SafeAreaView
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
                ID Verification
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
                Enter your BVN to verify your account opening application.
              </AppText>
            </View>
          </View>

          {/* Content */}
          <View
            style={{
              flex: 1,
              marginTop: spacing["2xl"],
            }}
          >
            <Input
              label="BVN"
              placeholder="Enter your 11-digit BVN"
              keyboardType="number-pad"
              maxLength={11}
              value={bvn}
              onChangeText={setBvn}
            />

            <View
              style={{
                flexDirection: "row",
                marginTop: spacing.lg,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.sm,
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={24}
                  color={theme.text.primary}
                />

                <AppText variant="body" color="primary">
                  Forgot BVN?
                </AppText>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Find your BVN"
                hitSlop={8}
                onPress={() => {
                  // TODO: Add BVN assistance flow or link
                }}
                style={{
                  backgroundColor: theme.background.brandui,
                  borderRadius: 9999,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText variant="body" color="brand">
                  Click here
                </AppText>
              </Pressable>
            </View>

            <View
              style={{
                marginTop: spacing["5xl"],
                flexDirection: "row",
                alignItems: "flex-start",
                gap: spacing.rg,
              }}
            >
              <Ionicons
                name="shield-checkmark"
                size={24}
                color={theme.text.success}
              />

              <View
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <AppText variant="body" color="primary">
                  In line with the latest regulatory requirement from the CBN,
                  we will obtain the details attached to your BVN to verify your
                  account. Xpress Payments will protect your information
                  security.
                </AppText>
              </View>
            </View>
          </View>

          {/* Continue */}
          <View
            style={{
              paddingBottom: spacing.sm,
            }}
          >
            <Button
              title="Next"
              size="large"
              onPress={() => router.push("/register/bvn-confirmation")}
              disabled={!isBvnValid}
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
