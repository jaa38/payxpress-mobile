import React from "react";

import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

import { radius } from "@/theme/radius";
import { theme, typography } from "@/theme";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "destructive";

type ButtonSize = "large" | "medium" | "small";

interface ButtonProps {
  title: string;

  variant?: ButtonVariant;

  size?: ButtonSize;

  disabled?: boolean;

  loading?: boolean;

  onPress?: () => void;

  style?: StyleProp<ViewStyle>;

  leftIcon?: React.ReactNode;

  rightIcon?: React.ReactNode;

  iconOnly?: boolean;
}

const BUTTON_SIZES = {
  large: {
    height: 56,
    paddingVertical: 16,
    paddingHorizontal: 20,
    textStyle: typography.buttonLarge,
  },

  medium: {
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    textStyle: typography.button,
  },

  small: {
    height: 40,
    paddingVertical: 8,
    paddingHorizontal: 12,
    textStyle: typography.buttonSmall,
  },
} as const;

function getVariantStyles({
  variant,
  pressed,
  disabled,
}: {
  variant: ButtonVariant;
  pressed: boolean;
  disabled: boolean;
}): ViewStyle {
  if (disabled) {
    return {
      backgroundColor: theme.action.primary.disabled,

      borderWidth: variant === "tertiary" ? 1 : 0,

      borderColor:
        variant === "tertiary"
          ? theme.action.tertiary.border
          : "transparent",
    };
  }

  switch (variant) {
    case "primary":
      return {
        backgroundColor: pressed
          ? theme.action.primary.pressed
          : theme.action.primary.background,
      };

    case "secondary":
      return {
        backgroundColor: pressed
          ? theme.action.secondary.pressed
          : theme.action.secondary.background,
      };

    case "tertiary":
      return {
        backgroundColor: pressed
          ? theme.action.tertiary.pressed
          : theme.action.tertiary.background,

        borderWidth: 1,

        borderColor: theme.action.tertiary.border,
      };

    case "destructive":
      return {
        backgroundColor: pressed
          ? theme.action.destructive.pressed
          : theme.action.destructive.background,
      };
  }
}

function getTextColor(
  variant: ButtonVariant,
  disabled: boolean
): string {
  if (disabled) {
    return theme.action.primary.disabledText;
  }

  switch (variant) {
    case "primary":
      return theme.action.primary.text;

    case "secondary":
      return theme.action.secondary.text;

    case "tertiary":
      return theme.action.tertiary.text;

    case "destructive":
      return theme.action.destructive.text;
  }
}

export function Button({
  title,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  onPress,
  style,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const sizeStyles = BUTTON_SIZES[size];

  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={loading ? `${title} loading` : title}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: "auto",

          height: sizeStyles.height,

          paddingVertical: sizeStyles.paddingVertical,

          paddingHorizontal: sizeStyles.paddingHorizontal,

          borderRadius: radius.md,

          flexDirection: "row",

          alignItems: "center",

          justifyContent: "center",
        },

        getVariantStyles({
          variant,
          pressed,
          disabled: isDisabled,
        }),

        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor(variant, true)}
        />
      ) : (
        <>
          {leftIcon}

          <Text
            style={[
              sizeStyles.textStyle,

              {
                color: getTextColor(variant, disabled),

                fontFamily: typography.fontFamily,

                marginHorizontal: leftIcon || rightIcon ? 6 : 0,
              } as TextStyle,
            ]}
          >
            {title}
          </Text>

          {rightIcon}
        </>
      )}
    </Pressable>
  );
}