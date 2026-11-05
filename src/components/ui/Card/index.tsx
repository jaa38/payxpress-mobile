
import React from "react";

import {
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { radius, spacing } from "@/theme";

export type CardVariant =
  | "default"
  | "active"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "disabled";

interface CardProps extends ViewProps {
  variant?: CardVariant;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Card({
  variant = "default",
  fullWidth = true,
  children,
  style,
  ...props
}: CardProps) {
  const { theme } = useTheme();

  const cardTheme = theme.card[variant];

  const variantStyle: ViewStyle = {
    backgroundColor: cardTheme.background,
    borderColor: cardTheme.border,
  };

  return (
    <View
      {...props}
      style={[
        styles.card,
        variantStyle,
        fullWidth ? styles.fullWidth : styles.autoWidth,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
  },

  fullWidth: {
    width: "100%",
  },

  autoWidth: {
    alignSelf: "flex-start",
  },
});
