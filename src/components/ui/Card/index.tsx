import React from "react";

import {
  StyleSheet,
  View,
  ViewProps,
} from "react-native";

import { radius, spacing, theme } from "@/theme";

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
  return (
    <View
      {...props}
      style={[
        styles.card,

        variantStyles[variant],

        fullWidth ? styles.fullWidth : styles.autoWidth,

        style,
      ]}
    >
      {children}
    </View>
  );
}

const variantStyles = {
  default: {
    backgroundColor: theme.card.default.background,

    borderColor: theme.card.default.border,
  },

  active: {
    backgroundColor: theme.card.active.background,

    borderColor: theme.card.active.border,
  },

  success: {
    backgroundColor: theme.card.success.background,

    borderColor: theme.card.success.border,
  },

  error: {
    backgroundColor: theme.card.error.background,

    borderColor: theme.card.error.border,
  },

  warning: {
    backgroundColor: theme.card.warning.background,

    borderColor: theme.card.warning.border,
  },

  info: {
    backgroundColor: theme.card.info.background,

    borderColor: theme.card.info.border,
  },

  disabled: {
    backgroundColor: theme.card.disabled.background,

    borderColor: theme.card.disabled.border,
  },
} as const;

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