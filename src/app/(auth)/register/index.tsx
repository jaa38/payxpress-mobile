import { router } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { colors, spacing, theme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
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

              // gap: spacing.md,
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
                ID Verification
              </AppText>

              <AppText
                variant="body"
                color="muted"
                style={{
                  marginBottom: spacing.xl,
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
              paddingVertical: spacing.lg,
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
