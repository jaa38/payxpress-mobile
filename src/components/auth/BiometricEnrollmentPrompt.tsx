
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, View } from "react-native";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { spacing, theme } from "@/theme";

interface BiometricEnrollmentPromptProps {
    visible: boolean;
    biometricName?: string;
    loading?: boolean;
    onEnable: () => void;
    onSkip: () => void;
}

export function BiometricEnrollmentPrompt({
    visible,
    biometricName = "Face ID",
    loading = false,
    onEnable,
    onSkip,
}: BiometricEnrollmentPromptProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onSkip}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    paddingHorizontal: spacing.lg,
                    backgroundColor: "rgba(0,0,0,0.5)",
                }}
            >
                <View
                    style={{
                        backgroundColor: theme.background.surface,
                        borderRadius: 24,
                        padding: spacing.lg,
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            width: 76,
                            height: 76,
                            borderRadius: 38,
                            backgroundColor: theme.action.tertiary.background,
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: spacing.lg,
                        }}
                    >
                        <Ionicons
                            name="scan-outline"
                            size={42}
                            color={theme.text.primary}
                        />
                    </View>

                    <AppText
                        variant="h2"
                        color="heading"
                        style={{ textAlign: "center" }}
                    >
                        Enable {biometricName}
                    </AppText>

                    <AppText
                        variant="body"
                        color="muted"
                        style={{
                            textAlign: "center",
                            marginTop: spacing.sm,
                            lineHeight: 24,
                        }}
                    >
                        Sign in to PayXpress quickly and securely using
                        {` ${biometricName}`} on this device.
                    </AppText>

                    <View
                        style={{
                            width: "100%",
                            marginTop: spacing.lg,
                            padding: spacing.md,
                            borderRadius: 12,
                            backgroundColor: theme.background.subtle,
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: spacing.sm,
                        }}
                    >
                        <Ionicons
                            name="shield-checkmark-outline"
                            size={22}
                            color={theme.text.primary}
                        />

                        <View style={{ flex: 1 }}>
                            <AppText variant="bodyBold">
                                Your security matters
                            </AppText>

                            <AppText
                                variant="bodySmall"
                                color="muted"
                                style={{ marginTop: spacing.xs, lineHeight: 20 }}
                            >
                                Your biometric information stays protected
                                on your device. PayXpress does not store
                                your face or fingerprint data.
                            </AppText>
                        </View>
                    </View>

                    <View style={{ width: "100%", marginTop: spacing.xl }}>
                        <Button
                            title={`Enable ${biometricName}`}
                            size="large"
                            loading={loading}
                            disabled={loading}
                            onPress={onEnable}
                            style={{ width: "100%" }}
                        />

                        <Pressable
                            accessibilityRole="button"
                            disabled={loading}
                            onPress={onSkip}
                            style={{
                                alignItems: "center",
                                paddingVertical: spacing.md,
                            }}
                        >
                            <AppText variant="bodyBold" color="muted">
                                Maybe later
                            </AppText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
