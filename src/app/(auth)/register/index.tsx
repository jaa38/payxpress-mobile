import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView, Platform, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { spacing, theme } from "@/theme";

export default function RegisterScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
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
              paddingTop: spacing.lg,
            }}
          >
            <Input
              label="BVN"
              placeholder="Enter your 11-digit BVN"
              keyboardType="number-pad"
              maxLength={11}
            />
          </View>

          {/* Continue */}
          <View
            style={{
              paddingBottom: spacing.lg,
            }}
          >
            <Button
              title="Next"
              size="large"
              onPress={() => router.push("/register/bvn-confirmation")}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
