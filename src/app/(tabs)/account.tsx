
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { useTheme } from "@/hooks/use-theme";
import { authService } from "@/services/auth/auth-service";
import { biometricAuth } from "@/services/auth/biometric-auth";
import { useAuthStore } from "@/store/auth-store";
import { spacing } from "@/theme";
import type { ThemeMode } from "@/theme/theme";

interface AccountRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightLabel?: string;
  showChevron?: boolean;
}

const APPEARANCE_OPTIONS: {
  value: ThemeMode;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
    {
      value: "system",
      label: "System",
      description: "Follow your device appearance settings",
      icon: "phone-portrait-outline",
    },
    {
      value: "light",
      label: "Light",
      description: "Always use light appearance",
      icon: "sunny-outline",
    },
    {
      value: "dark",
      label: "Dark",
      description: "Always use dark appearance",
      icon: "moon-outline",
    },
  ];

function AccountRow({
  icon,
  title,
  subtitle,
  onPress,
  rightLabel,
  showChevron = true,
}: AccountRowProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.md,
        gap: spacing.md,
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.background.subtle,
        }}
      >
        <Ionicons
          name={icon}
          size={21}
          color={theme.text.primary}
        />
      </View>

      <View style={{ flex: 1, gap: spacing.xs }}>
        <AppText variant="bodyBold">{title}</AppText>

        {subtitle ? (
          <AppText variant="bodySmall" color="secondary">
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {rightLabel ? (
        <AppText variant="bodySmall" color="secondary">
          {rightLabel}
        </AppText>
      ) : null}

      {showChevron ? (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.text.secondary}
        />
      ) : null}
    </Pressable>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <AppText
      variant="bodyBold"
      color="secondary"
      style={{ marginBottom: spacing.sm }}
    >
      {title}
    </AppText>
  );
}

export default function AccountScreen() {
  const user = useAuthStore((state) => state.user);

  const {
    theme,
    themeMode,
    setThemeMode,
  } = useTheme();

  const [biometricType, setBiometricType] = useState<
    "Face ID" | "Fingerprint" | "Biometrics" | null
  >(null);

  const [isBiometricAvailable, setIsBiometricAvailable] =
    useState(false);

  const [isCheckingBiometrics, setIsCheckingBiometrics] =
    useState(true);

  const [isAppearanceModalVisible, setIsAppearanceModalVisible] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkBiometrics = async () => {
      try {
        const availability = await biometricAuth.getAvailability();

        if (isMounted) {
          setBiometricType(availability.biometricType);
          setIsBiometricAvailable(availability.isAvailable);
        }
      } catch (error) {
        console.error("Unable to check biometrics:", error);
      } finally {
        if (isMounted) {
          setIsCheckingBiometrics(false);
        }
      }
    };

    void checkBiometrics();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleBiometricSettings = () => {
    if (isCheckingBiometrics) return;

    if (!isBiometricAvailable) {
      Alert.alert(
        "Biometrics unavailable",
        biometricType
          ? `Please configure ${biometricType} on your device before continuing.`
          : "Your device does not currently have an enrolled biometric authentication method."
      );

      return;
    }

    Alert.alert(
      `${biometricType} available`,
      `${biometricType} is supported and enrolled on this device. Biometric sign-in setup will become available once PayXpress session credentials can be securely registered.`,
      [{ text: "OK" }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out of your PayXpress account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            try {
              await authService.logout();
              router.replace("/welcome");
            } catch {
              Alert.alert(
                "Unable to log out",
                "We couldn't securely clear your session. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleComingSoon = (feature: string) => {
    Alert.alert(
      feature,
      "This feature will be available in a future PayXpress update."
    );
  };

  const handleAppearanceChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    setIsAppearanceModalVisible(false);
  };

  const selectedAppearance =
    APPEARANCE_OPTIONS.find(
      (option) => option.value === themeMode
    )?.label ?? "System";

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xl,
        }}
      >
        <View
          style={{
            paddingTop: spacing.sm,
            marginBottom: spacing.lg,
          }}
        >
          <AppText
            variant="h1"
            style={{ marginBottom: spacing.sm }}
          >
            Account
          </AppText>

          <AppText variant="body" color="secondary">
            Manage your profile and account preferences.
          </AppText>
        </View>

        {/* Profile */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: spacing.lg,
            borderRadius: 16,
            backgroundColor: theme.background.subtle,
            marginBottom: spacing.xl,
            gap: spacing.md,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: theme.background.surface,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="person-outline"
              size={28}
              color={theme.text.primary}
            />
          </View>

          <View style={{ flex: 1, gap: spacing.xs }}>
            <AppText variant="bodyBold">
              {user?.tagName || "PayXpress Customer"}
            </AppText>

            <AppText variant="bodySmall" color="secondary">
              {user?.email || "Account profile"}
            </AppText>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.text.secondary}
          />
        </View>

        {/* Account */}
        <View style={{ marginBottom: spacing.xl }}>
          <SectionHeading title="ACCOUNT" />

          <AccountRow
            icon="person-outline"
            title="Personal Information"
            subtitle="Manage your personal details"
            onPress={() =>
              handleComingSoon("Personal Information")
            }
          />
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: theme.border.default,
            marginBottom: spacing.lg,
          }}
        />

        {/* Security */}
        <View style={{ marginBottom: spacing.xl }}>
          <SectionHeading title="SECURITY" />

          <AccountRow
            icon="scan-outline"
            title={biometricType || "Biometric Sign-in"}
            subtitle={
              isCheckingBiometrics
                ? "Checking device..."
                : isBiometricAvailable
                  ? "Available on this device"
                  : "Not configured on this device"
            }
            rightLabel={
              isCheckingBiometrics
                ? undefined
                : isBiometricAvailable
                  ? "Available"
                  : "Unavailable"
            }
            showChevron={!isCheckingBiometrics}
            onPress={handleBiometricSettings}
          />

          {isCheckingBiometrics ? (
            <ActivityIndicator
              size="small"
              color={theme.text.secondary}
            />
          ) : null}

          <AccountRow
            icon="lock-closed-outline"
            title="Change Password"
            subtitle="Update your account password"
            onPress={() =>
              handleComingSoon("Change Password")
            }
          />
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: theme.border.default,
            marginBottom: spacing.lg,
          }}
        />

        {/* Preferences */}
        <View style={{ marginBottom: spacing.xl }}>
          <SectionHeading title="PREFERENCES" />

          <AccountRow
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your notifications"
            onPress={() =>
              handleComingSoon("Notifications")
            }
          />

          <AccountRow
            icon="language-outline"
            title="Language"
            subtitle="Choose your preferred language"
            rightLabel="English"
            onPress={() =>
              handleComingSoon("Language")
            }
          />

          <AccountRow
            icon="color-palette-outline"
            title="Appearance"
            subtitle="Manage your app appearance"
            rightLabel={selectedAppearance}
            onPress={() =>
              setIsAppearanceModalVisible(true)
            }
          />
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: theme.border.default,
            marginBottom: spacing.lg,
          }}
        />

        {/* Support */}
        <View style={{ marginBottom: spacing.xl }}>
          <SectionHeading title="SUPPORT" />

          <AccountRow
            icon="help-circle-outline"
            title="Help Centre"
            onPress={() => handleComingSoon("Help Centre")}
          />

          <AccountRow
            icon="headset-outline"
            title="Contact Support"
            onPress={() =>
              handleComingSoon("Contact Support")
            }
          />

          <AccountRow
            icon="document-text-outline"
            title="Terms and Privacy"
            onPress={() =>
              handleComingSoon("Terms and Privacy")
            }
          />
        </View>

        {/* Logout */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log out"
          onPress={handleLogout}
          style={{
            marginTop: spacing.md,
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.lg,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border.error,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: spacing.sm,
          }}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={theme.text.error}
          />

          <AppText variant="bodyBold" color="error">
            Log out
          </AppText>
        </Pressable>

        <AppText
          variant="bodySmall"
          color="secondary"
          align="center"
          style={{ marginTop: spacing.lg }}
        >
          PayXpress
        </AppText>
      </ScrollView>

      {/* Appearance selector */}
      <Modal
        visible={isAppearanceModalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() =>
          setIsAppearanceModalVisible(false)
        }
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: theme.overlay.background,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close appearance settings"
            onPress={() =>
              setIsAppearanceModalVisible(false)
            }
            style={{ flex: 1 }}
          />

          <View
            style={{
              backgroundColor: theme.background.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.lg,
              paddingBottom: spacing.xl,
            }}
          >
            <View
              style={{
                alignSelf: "center",
                width: 40,
                height: 4,
                borderRadius: 4,
                backgroundColor: theme.border.strong,
                marginBottom: spacing.lg,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: spacing.xs,
              }}
            >
              <AppText variant="h2">
                Appearance
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={() =>
                  setIsAppearanceModalVisible(false)
                }
                hitSlop={12}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.text.secondary}
                />
              </Pressable>
            </View>

            <AppText
              variant="bodySmall"
              color="secondary"
              style={{ marginBottom: spacing.lg }}
            >
              Choose how PayXpress looks on your device.
            </AppText>

            {APPEARANCE_OPTIONS.map((option) => {
              const isSelected =
                themeMode === option.value;

              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="radio"
                  accessibilityState={{
                    checked: isSelected,
                  }}
                  accessibilityLabel={option.label}
                  onPress={() =>
                    handleAppearanceChange(option.value)
                  }
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: spacing.md,
                    marginBottom: spacing.sm,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: isSelected
                      ? theme.border.brand
                      : theme.border.default,
                    backgroundColor: isSelected
                      ? theme.background.brand
                      : theme.background.surface,
                    gap: spacing.md,
                  }}
                >
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: theme.background.subtle,
                    }}
                  >
                    <Ionicons
                      name={option.icon}
                      size={21}
                      color={
                        isSelected
                          ? theme.text.brand
                          : theme.text.secondary
                      }
                    />
                  </View>

                  <View style={{ flex: 1, gap: 3 }}>
                    <AppText variant="bodyBold">
                      {option.label}
                    </AppText>

                    <AppText
                      variant="bodySmall"
                      color="secondary"
                    >
                      {option.description}
                    </AppText>
                  </View>

                  {isSelected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={23}
                      color={theme.text.brand}
                    />
                  ) : (
                    <Ionicons
                      name="ellipse-outline"
                      size={23}
                      color={theme.border.strong}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
